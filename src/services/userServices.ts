import db from "../db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4, v4 } from "uuid";
import { users } from "../db/schema/userSchema";
import bcrypt from "bcrypt";
import { and, lt } from "drizzle-orm";
import { sendPasswordResetEmail, sendPasswordResetConfirmationEmail, sendVerificationEmail } from "./mailer";

export const signup = async (username: string, email: string, password: string, verificationBaseUrl: string) => {
    // Check if email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
        throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    const verificationExpires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    const savevalues = {
        username,
        email,
        password: hashedPassword,
        guid: v4(),
        is_verified: false,
        verification_token: verificationToken,
        verification_expires: verificationExpires
    };
    
    const newUser = await db.insert(users).values(savevalues).returning();
    
    // Send verification email
    const verificationLink = `${verificationBaseUrl.replace(/\/$/, '')}/verify-email?token=${verificationToken}`;
    try {
        await sendVerificationEmail(newUser[0].email, verificationLink, newUser[0].username);
    } catch (err) {
        console.error('Error sending verification email:', err);
    }
    
    return newUser[0];
};

export const verifyEmail = async (token: string) => {
    const usersWithToken = await db.select().from(users).where(eq(users.verification_token, token));
    if (usersWithToken.length === 0) {
        throw new Error('Invalid or expired verification token');
    }
    const user = usersWithToken[0];
    
    if (!user.verification_expires || new Date(user.verification_expires) < new Date()) {
        throw new Error('Verification token has expired');
    }
    
    if (user.is_verified) {
        throw new Error('Email already verified');
    }
    
    // Mark user as verified and clear token
    await db.update(users).set({ 
        is_verified: true, 
        verification_token: null, 
        verification_expires: null 
    }).where(eq(users.guid, user.guid));
    
    return { ok: true, user };
};

// Request a password reset for a given email: creates a token, stores expiry, and sends email
export const requestPasswordReset = async (email: string, resetBaseUrl: string) => {
    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length === 0) {
        // For security, don't reveal whether email exists — but return success for client
        return { ok: true };
    }
    const u = user[0];
    const token = uuidv4();
    // expires in 1 hour
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    await db.update(users).set({ password_reset_token: token, password_reset_expires: expires }).where(eq(users.guid, u.guid));

    const resetLink = `${resetBaseUrl.replace(/\/$/, '')}/reset-password?token=${token}`;
    // send email (don't await to avoid blocking, but ensure errors bubble if awaited)
    try {
        await sendPasswordResetEmail(u.email, resetLink);
    } catch (err) {
        console.error('Error sending password reset email:', err);
    }

    return { ok: true };
};

export const resetPassword = async (token: string, newPassword: string) => {
    const usersWithToken = await db.select().from(users).where(eq(users.password_reset_token, token));
    if (usersWithToken.length === 0) {
        throw new Error('Invalid or expired token');
    }
    const user = usersWithToken[0];
    if (!user.password_reset_expires || new Date(user.password_reset_expires) < new Date()) {
        throw new Error('Invalid or expired token');
    }
    // Prevent user from reusing the same password
    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
        throw new Error('New password must be different from the old password');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.update(users).set({ password: hashed, password_reset_token: null, password_reset_expires: null }).where(eq(users.guid, user.guid));
    
    // Send confirmation email after successful reset
    try {
        await sendPasswordResetConfirmationEmail(user.email, user.username);
    } catch (err) {
        console.error('Error sending password reset confirmation email:', err);
    }
    
    return { ok: true };
};
export const login = async (email: string, password: string) => {
    const user = await db.select().from(users).where(eq(users.email, email));   
    if (user.length === 0) {
        throw new Error("User not found");
    }
    
    // Check if email is verified
    if (!user[0].is_verified) {
        throw new Error("Please verify your email before logging in");
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