import db from "../db/schema";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";
import { posts } from "../db/schema/postSchema";

export const createPost = async (title: string, content: string, author_id: number, is_public: boolean) => {
    const savevalues={
        title,
        content,
        author_id,
        is_public,
        guid: v4()  
    }
    const newPost = await db.insert(posts).values(savevalues).returning();
    return newPost[0];
};

export const getPostById = async (id: number) => {
    const post = await db.select().from(posts).where(eq(posts.id, id));
    if (post.length === 0) {
        throw new Error("Post not found");
    }
    return post[0];
};

export const getAllPosts = async () => {
    const allPosts = await db.select().from(posts).where(eq(posts.is_public, true));
    return allPosts;
}

export const updatePost = async (id: number, title?: string, content?: string, is_public?: boolean) => {
    const existingPost = await db.select().from(posts).where(eq(posts.id, id));
    if (existingPost.length === 0) {
        throw new Error("Post not found");
    }
    const updatedValues: { title?: string; content?: string; is_public?: boolean; updated_at: Date } = { updated_at: new Date() };
    if (title !== undefined) updatedValues.title = title;
    if (content !== undefined) updatedValues.content = content;
    if (is_public !== undefined) updatedValues.is_public = is_public;
    
    const updatedPost = await db.update(posts).set(updatedValues).where(eq(posts.id, id)).returning();
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