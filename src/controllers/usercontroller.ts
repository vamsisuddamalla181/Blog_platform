import {signup,login,getUserByApiKey,getallusers} from "../services/userServices";
import { Request, Response } from "express";
import v4 from "uuid";
import {generateToken} from "../utils/tokengenreation";
export const signupController = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const user = await signup(username, email, password);
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
export const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await login(email, password);
        const token=generateToken(user.guid);
        user.token=token;
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(401).json({ message: (error as Error).message });
    }
};

export const getUserByApiKeyController = async (req: Request, res: Response) => {
    const guid = req.params.guid;
    if (!guid) {
        return res.status(400).json({ message: "API key is required" });
    }
    try {
        const user = await getUserByApiKey(guid);
        res.status(200).json({ user });
    } catch (error) {
        res.status(404).json({ message: (error as Error).message });
    }   
};
export const getallusersController=async(req:Request,res:Response)=>{
    try {
        const allusers=await getallusers();
        res.status(200).json({allusers});
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
