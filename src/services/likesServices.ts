import {likes} from "../db/schema/likesSchema"
import { eq, or,and,count } from "drizzle-orm";
import db from "../db/schema"
import crypto from "crypto";

export const LikesService = {
  // Add a like
  async addLike(userguid: string, postguid: string) {
    // Check if already liked
    const existing = await db.select().from(likes)
      .where(
        and(
          eq(likes.userguid, userguid),
          eq(likes.postguid, postguid)
        )
      );

    if (existing.length > 0) {
      throw new Error("Post already liked by this user");
    }

    return db.insert(likes).values({
      guid: crypto.randomUUID(),
      userguid,
      postguid
    }).returning();
  },

  // Remove a like
  async removeLike(userguid: string, postguid: string) {
    return db.delete(likes)
      .where(
        and(
          eq(likes.userguid, userguid),
          eq(likes.postguid, postguid)
        )
      )
      .returning();
  },

  // Get likes count for a post
  async getLikesCount(postguid: string) {
    const result = await db.select({
      total: count(likes.id)
    })
      .from(likes)
      .where(eq(likes.postguid, postguid));

    return Number(result[0].total); // Convert to number
  },

  // Check if a user liked a post
  async isLikedByUser(userguid: string, postguid: string) {
    const result = await db.select().from(likes)
      .where(
        and(
          eq(likes.userguid, userguid),
          eq(likes.postguid, postguid)
        )
      );

    return result.length > 0;
  }
};
