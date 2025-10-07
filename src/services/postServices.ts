import db from "../db/schema";
import { eq, or } from "drizzle-orm";
import { v4 } from "uuid";
import { posts } from "../db/schema/postSchema";

export const createPost = async (title: string, content: string, userguid: any, is_public: boolean) => {
    const savevalues = {
        title,
        content,
        userguid,
        is_public,
        guid: v4()
    }
    const newPost = await db.insert(posts).values(savevalues).returning();
    return newPost[0];
};

export const getPostById = async (guid: string, userguid?: string) => {
    const post = await db.select().from(posts).where(eq(posts.guid, guid));
    if (post.length === 0) {
        throw new Error("Post not found");
    }

    const p = post[0];

    // If post is private and the user is not the owner, block access
    if (!p.is_public && p.userguid !== userguid) {
        throw new Error("You are not authorized to view this post");
    }

    return p;
};


export const getAllPosts = async (userguid?: string) => {
    const allPosts = await db.select().from(posts).where(eq(posts.is_public, true));

    if (userguid) {
        const privatePosts = await db.select().from(posts).where(
            or(
                eq(posts.is_public, true),
                eq(posts.userguid, userguid)
            )
        );
        return [allPosts, privatePosts];
    }

    return allPosts;
};


// export const updatePost = async (guid: string, title?: string, content?: string, is_public?: boolean, userid?: String) => {
//     if (userid) {
//         const existingPost = await db.select().from(posts).where(eq(posts.guid, guid));
//         if (existingPost.length === 0) {
//             throw new Error("Post not found");
//         }
//         const updatedValues: { title?: string; content?: string; is_public?: boolean; updated_at: Date } = { updated_at: new Date() };
//         if (title !== undefined) updatedValues.title = title;
//         if (content !== undefined) updatedValues.content = content;
//         if (is_public !== undefined) updatedValues.is_public = is_public;

//         const updatedPost = await db.update(posts).set(updatedValues).where(eq(posts.guid, guid)).returning();
//         return updatedPost[0];
//     }
// };

export const updatePost = async (
    guid: string,
    userguid: string,
    title?: string,
    content?: string,
    is_public?: boolean
) => {
    const existingPost = await db.select().from(posts).where(eq(posts.guid, guid));
    if (existingPost.length === 0) {
        throw new Error("No post found");
    }

    const post = existingPost[0];

    // authorization check
    if (post.userguid !== userguid) {
        throw new Error("You are not authorized to update this post");
    }
    const updatedValues: {
        title?: string;
        content?: string;
        is_public?: boolean;
        updated_at: Date;
    } = { updated_at: new Date() };

    if (title !== undefined) updatedValues.title = title;
    if (content !== undefined) updatedValues.content = content;
    if (is_public !== undefined) updatedValues.is_public = is_public;

    const updatedPost = await db
        .update(posts)
        .set(updatedValues)
        .where(eq(posts.guid, guid))
        .returning();

    return updatedPost[0];
};

export const deletePost = async (id: number) => {
    const existingPost = await db.select().from(posts).where(eq(posts.id, id));
    if (existingPost.length === 0) {
        throw new Error("Post not found");
    }
    await db.delete(posts).where(eq(posts.id, id));
    return { message: "Post deleted successfully" };
};