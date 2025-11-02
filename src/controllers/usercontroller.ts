import {signup,login,getUserByApiKey,getallusers, requestPasswordReset, resetPassword, verifyEmail} from "../services/userServices";
import { sendWelcomeEmail } from "../services/mailer";
import { Request, Response } from "express";
import v4 from "uuid";
import {generateToken} from "../utils/tokengenreation";

export const signupController = async (req: Request, res: Response) => {
    const { username, email, password, verificationBaseUrl } = req.body;
    if (!username || !email || !password || !verificationBaseUrl) {
        return res.status(400).json({ message: 'username, email, password, and verificationBaseUrl are required' });
    }
    try {
        const user = await signup(username, email, password, verificationBaseUrl);
        res.status(201).json({ 
            message: "Signup successful! Please check your email to verify your account.", 
            user: { guid: user.guid, username: user.username, email: user.email, is_verified: user.is_verified }
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const verifyEmailController = async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'token is required' });
    }
    try {
        const result = await verifyEmail(token);
        // Send welcome email after successful verification
        if (result.user && result.user.email) {
            sendWelcomeEmail(result.user.email, result.user.username)
                .then(() => console.log('Welcome email sent successfully'))
                .catch(err => console.error('Welcome email failed:', err));
        }
        res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
    }
};
// Request password reset: accepts { email, resetBaseUrl }
export const requestPasswordResetController = async (req: Request, res: Response) => {
    const { email, resetBaseUrl } = req.body;
    if (!email || !resetBaseUrl) {
        return res.status(400).json({ message: 'email and resetBaseUrl are required' });
    }
    try {
        await requestPasswordReset(email, resetBaseUrl);
        // Always return success to avoid leaking whether email exists
        res.status(200).json({ message: 'If the email is registered, you will receive reset instructions' });
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};

// Perform password reset: accepts { token, newPassword }
export const resetPasswordController = async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ message: 'token and newPassword are required' });
    }
    try {
        await resetPassword(token, newPassword);
        res.status(200).json({ message: 'Password has been reset' });
    } catch (err) {
        res.status(400).json({ message: (err as Error).message });
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
