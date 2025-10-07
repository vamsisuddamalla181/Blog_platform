import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const SECRET_KEY = "your_secret_key"; 

  
export const generateToken = (userguid: any) => {
    const token = jwt.sign({ userguid }, SECRET_KEY, { expiresIn: "1h" });
    return token;
}
