"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getAllPosts = exports.getPostById = exports.createPost = void 0;
const schema_1 = __importDefault(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const uuid_1 = require("uuid");
const postSchema_1 = require("../db/schema/postSchema");
const createPost = (title, content, userguid, is_public) => __awaiter(void 0, void 0, void 0, function* () {
    const savevalues = {
        title,
        content,
        userguid,
        is_public,
        guid: (0, uuid_1.v4)()
    };
    const newPost = yield schema_1.default.insert(postSchema_1.posts).values(savevalues).returning();
    return newPost[0];
});
exports.createPost = createPost;
const getPostById = (guid, userguid) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield schema_1.default.select().from(postSchema_1.posts).where((0, drizzle_orm_1.eq)(postSchema_1.posts.guid, guid));
    if (post.length === 0) {
        throw new Error("Post not found");
    }
    const p = post[0];
    // If post is private and the user is not the owner, block access
    if (!p.is_public && p.userguid !== userguid) {
        throw new Error("You are not authorized to view this post");
    }
    return p;
});
exports.getPostById = getPostById;
const getAllPosts = (userguid) => __awaiter(void 0, void 0, void 0, function* () {
    const allPosts = yield schema_1.default.select().from(postSchema_1.posts).where((0, drizzle_orm_1.eq)(postSchema_1.posts.is_public, true));
    if (userguid) {
        const privatePosts = yield schema_1.default.select().from(postSchema_1.posts).where((0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(postSchema_1.posts.is_public, true), (0, drizzle_orm_1.eq)(postSchema_1.posts.userguid, userguid)));
        return [allPosts, privatePosts];
    }
    return allPosts;
});
exports.getAllPosts = getAllPosts;
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
const updatePost = (guid, userguid, title, content, is_public) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPost = yield schema_1.default.select().from(postSchema_1.posts).where((0, drizzle_orm_1.eq)(postSchema_1.posts.guid, guid));
    if (existingPost.length === 0) {
        throw new Error("No post found");
    }
    const post = existingPost[0];
    // authorization check
    if (post.userguid !== userguid) {
        throw new Error("You are not authorized to update this post");
    }
    const updatedValues = { updated_at: new Date() };
    if (title !== undefined)
        updatedValues.title = title;
    if (content !== undefined)
        updatedValues.content = content;
    if (is_public !== undefined)
        updatedValues.is_public = is_public;
    const updatedPost = yield schema_1.default
        .update(postSchema_1.posts)
        .set(updatedValues)
        .where((0, drizzle_orm_1.eq)(postSchema_1.posts.guid, guid))
        .returning();
    return updatedPost[0];
});
exports.updatePost = updatePost;
const deletePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingPost = yield schema_1.default.select().from(postSchema_1.posts).where((0, drizzle_orm_1.eq)(postSchema_1.posts.id, id));
    if (existingPost.length === 0) {
        throw new Error("Post not found");
    }
    yield schema_1.default.delete(postSchema_1.posts).where((0, drizzle_orm_1.eq)(postSchema_1.posts.id, id));
    return { message: "Post deleted successfully" };
});
exports.deletePost = deletePost;
