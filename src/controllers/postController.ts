import {createPost,getAllPosts,getPostById,updatePost,deletePost} from "../services/postServices";
import { Request, Response } from "express";
export const createPostController = async (req: Request, res: Response) => {
    try {
        const author_id = parseInt(req.headers['author_id'] as string, 10);
        if (isNaN(author_id)) {
            return res.status(400).json({ error: "Invalid or missing author_id in headers" });
        }
        const { title, content,  is_public } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }
        const newPost = await createPost(title, content, author_id, is_public ?? true);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};
