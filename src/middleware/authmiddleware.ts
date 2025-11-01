import * as users from "../db/schema/userSchema";  
import { Request, Response, NextFunction } from "express";
import db from "../db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token =req.headers["authorization"]?.split(" ")[1]||req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const secret=process.env.SECRET_KEY
        const decoded: any = jwt.verify(token,secret);
        const userr = await db.select().from(users.users).where(eq(users.users.guid, decoded.userguid)).limit(1);
        if (!userr || userr.length === 0) {
            return res.status(401).json({ message: "Invalid token" });
        }
        (req as any).user = { userguid: decoded.userguid };
        next();
    } catch (error) {
        return res.status(401).json({ message:error });
    } 
}