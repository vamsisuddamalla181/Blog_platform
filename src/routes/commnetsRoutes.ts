import {commentcontroller} from "../controllers/commentController"
import { authMiddleware } from "../middleware/authmiddleware"
import express from "express"




const commentrouter=express.Router()
const commentController=new commentcontroller()




commentrouter.get("/posts/:postguid/comments", commentController.getComments);
commentrouter.post("/addcomment", commentController.addingcomment);
commentrouter.put("/updatecomments/:id", authMiddleware, commentController.updatecomment);
commentrouter.delete("/removecomments/:id", authMiddleware, commentController.removeingcomment);



export default commentrouter;