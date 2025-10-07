import { createPost ,getPostById,getAllPosts,updatePost,deletePost} from "../services/postServices";
import { Request, Response } from "express";
class postcontroller {
    createPostController = async (req: Request, res: Response) => {
        try {
            const userguid = (req as any).user?.userguid;
            if (!userguid) {
                return res.status(400).json({ error: "Invalid or missing userid " });
            }
            const { title, content, is_public } = req.body;
            if (!title || !content) {
                return res.status(400).json({ error: "Title and content are required" });
            }
            const newPost = await createPost(title, content, userguid, is_public);
            res.status(201).json(newPost);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };

    getPostById=async(req:Request,res:Response)=>{
        try{
            const postId=req.params.guid
            const userguid=(req as any).user?.userguid
            if (!postId) {
                return res.status(400).json({ error: "Invalid or missing userid " });
            }
            const postbyid=await getPostById(postId,userguid)
            res.status(201).json(postbyid)
        }
        catch(error){
            res.status(500).json({message:"Internal server error"})
        }
    }
    getallpost=async(req:Request,res:Response)=>{
        try{
            const userID=(req as any).user?.userguid;
            if(!userID){
                res.status(404).json({message:"userId not found"})
            }
            const getall=await getAllPosts(userID)
            res.status(200).json(getall)
        }
        catch(error){
        res.status(500).json({message:"Internal server Error"})
        }
    }
    upatepost=async(req:Request,res:Response)=>{
        try{
            const userId=(req as any).user?.userguid;
            const guid=req.params.guid;
            const {title,context,is_boolean}=req.body;
            const update=await updatePost(guid,userId,title,context,is_boolean)
            res.status(200).json(update)
        }
        catch(error)
        {
            res.status(500).json({message:"Internal server error"})
        }
    }
    deletepost=async(req:Request,res:Response)=>{
        try{
            const userId=(req as any).user?.userguid;
            const guid=req.params.guid
            const deletepost=await deletePost(guid,userId)
            res.status(200).json({message:"post deleted",deletepost})
        }
        catch(error){
            res.status(500).json({message:"Internal server Error"})
        }
    }
}
export default postcontroller;