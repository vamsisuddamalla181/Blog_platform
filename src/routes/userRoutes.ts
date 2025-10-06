import {signupController,loginController,getUserByApiKeyController,getallusersController} from "../controllers/usercontroller";
import express from "express";
const userrouter=express.Router();

userrouter.post("/signup",signupController);
userrouter.post("/login",loginController);
userrouter.get("/user/:api_key",getUserByApiKeyController);
userrouter.get("/getallusers",getallusersController);
export default userrouter;