import postcontroller from "../controllers/postController";
import express from "express";
const postrouter=express.Router();
import {authMiddleware} from "../middleware/authmiddleware"; 
const post=new postcontroller()   
postrouter.post("/createpost",authMiddleware,post.createPostController);
postrouter.get("/getallposts",authMiddleware,post.getallpost);
postrouter.get("/getpostbyid/:guid",authMiddleware,post.getPostById);
postrouter.put("/updatepost/:guid",authMiddleware,post.upatepost);
postrouter.delete("/deletePost/:guid",authMiddleware,post.deletepost);
export default postrouter;
