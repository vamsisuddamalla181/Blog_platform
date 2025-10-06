import db from "../db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4, v4 } from "uuid";
import { users } from "../db/schema/userSchema";
import bcrypt from "bcrypt";

export const signup = async (username: string, email: string, password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const savevalues={
        username,
        email,
        password: hashedPassword,
        guid: v4()
    }
    const newUser = await db.insert(users).values(savevalues).returning();
    return newUser[0];
};
export const login = async (email: string, password: string) => {
    const user = await db.select().from(users).where(eq(users.email, email));   
    if (user.length === 0) {
        throw new Error("User not found");
    }
    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
        throw new Error("Invalid password");
    }
    return user[0];
};

export const getUserByApiKey = async (api_key: string) => {
    const user = await db.select().from(users).where(eq(users.guid, api_key));
    if (user.length === 0) {
        throw new Error("User not found");
    }   
    return user[0];
};
 
export const  getallusers=async()=>{
    const allusers=await db.select().from(users);
    return allusers;
}