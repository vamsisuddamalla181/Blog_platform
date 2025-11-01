import { comments } from "../db/schema/commentSchema"
import { eq, and, or } from "drizzle-orm"
import db from "../db/schema"
import { posts } from "../db/schema/postSchema"
import crypto from "crypto"

export class commentService {
    addcomment = async (userguid: string, postguid: string, text: any) => {
        return db
            .insert(comments)
            .values({
                guid: crypto.randomUUID(),
                postguid,
                userguid,
                text
            })
            .returning();
    }
    removecomment = async (userguid: string, commnetguid: string) => {
        const comment = await db
            .select()
            .from(comments)
            .where(
                and(
                    eq(comments.userguid, userguid),
                    eq(comments.guid, commnetguid)
                )
            );
        if (comment.length === 0) {
            throw new Error("No commnet is there")
        }
        const existing = comment[0]
        const post = await db
            .select({ userguid: posts.userguid })
            .from(posts)
            .where(eq(posts.guid, existing.postguid));

        if (post.length === 0) {
            throw new Error("Post not found");
        }

        const postOwnerGuid = post[0];
        if (existing.userguid !== userguid && postOwnerGuid.userguid !== userguid) {
            throw new Error("You are not authorized to delete this comment");
        }
        const deleted = await db
            .delete(comments)
            .where(eq(comments.guid, commnetguid))
            .returning();
        return deleted[0];
    };
    updateComment = async (userguid: string, commentguid: string, text?: string) => {
        const existing = await db
            .select()
            .from(comments)
            .where(and(eq(comments.guid, commentguid), eq(comments.userguid, userguid)));

        if (existing.length === 0) {
            throw new Error("Nothing to update or unauthorized");
        }

        const updatedFields: { text?: string; updated_at: Date } = { updated_at: new Date() };

        if (text !== undefined) {
            updatedFields.text = text;
        }
        const updated = await db
            .update(comments)
            .set(updatedFields)
            .where(eq(comments.guid, commentguid)).returning();

        return updated[0];
    };
    getCommentsByPostId = async (postguid: string) => {
    const allComments = await db
      .select()
      .from(comments)
      .where(eq(comments.postguid, postguid));

    return allComments;
  };
}