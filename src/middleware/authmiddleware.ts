import * as users from "../db/schema/userSchema";  
import { Request, Response, NextFunction } from "express";
import db from "../db/schema";
import { eq } from "drizzle-orm";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    
}