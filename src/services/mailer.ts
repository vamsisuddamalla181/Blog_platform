import 'dotenv/config';
import nodemailer from 'nodemailer';

// Configure transporter using environment variables.
// Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE (true/false), SMTP_FROM
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
        user: process.env.SMTP_USER || 'vamsikrishnanaidu18@gmail.com',
        pass: process.env.SMTP_PASS || 'ptwclibynsmobgne',
    },
});

export const sendWelcomeEmail = async (to: string, username?: string) => {
    const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com';
    const subject = 'Welcome to Blog Platform!';
    const text = `Hi ${username || ''},\n\nWelcome to Blog Platform! We're glad you joined.\n\nBest,\nThe Blog Platform team`;
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      background-color: #f7f9fc;
      font-family: 'Arial', sans-serif;
      color: #444;
      line-height: 1.6;
      padding: 0;
      margin: 0;
    }
    .container {
      max-width: 600px;
      background-color: #ffffff;
      margin: 40px auto;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    .logo {
      text-align: center;
      margin-bottom: 20px;
    }
    .logo img {
      height: 60px;
    }
    .welcome {
      text-align: center;
      color: #333;
    }
    .welcome h1 {
      font-size: 24px;
      margin-bottom: 10px;
      color: #3f51b5;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #3f51b5;
      color: #ffffff;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 20px;
      transition: 0.3s;
    }
    .button:hover {
      background-color: #303f9f;
    }
    .footer {
      font-size: 12px;
      color: #aaaaaa;
      text-align: center;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://imgs.search.brave.com/gZhRqAKlrkTkF9UF1-wGCpOwY_lqaBWBvHU4n1LUP0U/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAxNC8w/Mi8xMy8wNy8yOC93/b3JkcHJlc3MtMjY1/MTMyXzY0MC5qcGc" alt="Blog Platform">
    </div>

    <div class="welcome">
      <h1>Welcome Aboard, ${username || 'Writer'}! 🚀</h1>
      <p>We're thrilled to have you join the <strong>Blog Platform</strong> community! ✍️</p>
      <p>Your voice matters — this is your space to write, share, explore, and inspire.</p>
      
      <a href="https://yourblogplatform.com/login" class="button">Start Your Journey</a>
    </div>

    <div class="footer">
      <p>You’re receiving this email because you registered on Blog Platform.</p>
      <p>© ${new Date().getFullYear()} Blog Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

    const mailOptions = {
        from,
        to,
        subject,
        text,
        html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
};

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
    const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@example.com';
    const subject = 'Password Reset Request';
    const text = `Hi,\n\nPlease use the following link to reset your password:\n${resetLink}\n\nBest,\nThe Blog Platform team`;
    const html = `<p>Hi,</p><p>Please use the following link to reset your password:</p><p><a href="${resetLink}">Reset Password</a></p><p>Best,<br/>The Blog Platform team</p>`;

    const mailOptions = {
        from,
        to,
        subject,
        text,
        html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
};
