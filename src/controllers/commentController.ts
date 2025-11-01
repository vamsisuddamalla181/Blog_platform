import { Request, Response } from "express"
import { commentService } from "../services/commentServices"


const comment = new commentService()
export class commentcontroller {
    addingcomment = async (req: Request, res: Response) => {
        try {
            const { userguid, postguid, text } = req.body;
            const adding = await comment.addcomment(userguid, postguid, text);
            res.status(200).json({ message: "commnet added successfully", adding })
        }
        catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    removeingcomment = async (req: Request, res: Response) => {
        try {
            const commentid = req.params.id;
            const userid = (req as any).user.userguid;
            const remove = await comment.removecomment(userid, commentid);
            res.status(200).json({ message: "Comment deleted successfully", remove })
        }
        catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    updatecomment = async (req: Request, res: Response) => {
        try {
            const commentId = req.params.id;
            const userId = (req as any).user.userguid; 
            const { text } = req.body;
            const adding = await comment.updateComment(userId, commentId, text);
            res.status(200).json({ message: "commnet updated successfully", adding })
        }
        catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    getComments = async (req: Request, res: Response) => {
    try {
      const { postguid } = req.params;
      const comments = await comment.getCommentsByPostId(postguid);
      res.status(200).json({ comments });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };
}