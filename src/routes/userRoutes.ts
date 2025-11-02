import {signupController,loginController,getUserByApiKeyController,getallusersController, requestPasswordResetController, resetPasswordController, verifyEmailController} from "../controllers/usercontroller";
import express from "express";
const userrouter=express.Router();

userrouter.post("/signup",signupController);
userrouter.post("/verify-email", verifyEmailController);
userrouter.post("/login",loginController);
userrouter.post("/forgot-password", requestPasswordResetController);
userrouter.post("/reset-password", resetPasswordController);
userrouter.get("/user/:api_key",getUserByApiKeyController);
userrouter.get("/getallusers",getallusersController);
export default userrouter;