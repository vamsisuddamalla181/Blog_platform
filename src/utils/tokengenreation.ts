import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config(); 
const SECRET_KEY=process.env.SECRET_KEY||"this is key";
  
export const generateToken = (userguid: any) => {
    const token = jwt.sign({ userguid }, SECRET_KEY, { expiresIn: "1h" });
    return token;
}
