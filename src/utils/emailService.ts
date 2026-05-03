import nodemailer from 'nodemailer';

export interface WelcomeEmailParams {
    userEmail: string;
    userName: string;
    promoCode: string;
}

export interface ResetPasswordEmailParams {
    userEmail: string;
    userName: string;
}

export interface UserOnBoardingPasswordResetParams {
    userEmail: string;
    userName: string;
    password: string;
    roleName: string;
}

export interface EmailResponse {
    success: boolean;
    messageId?: string;
    error?: unknown;
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    service: 'gmail',
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'kannandk37@gmail.com',
        pass: 'stfb qtut ekxd bdrc', // Remember to use environment variables for this in production!
    },
});

export async function sendWelcomeEmail({
    userEmail,
    userName,
    promoCode
}: WelcomeEmailParams) {

    // The path to your banner
    const heroImageUrl = 'D:/naturecandy/back-end/data/Banner.png';

    const htmlContent = `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Nature's Candy</title>
        <style>
            body { margin: 0; padding: 0; background-color: #FDF8F5; font-family: 'Georgia', serif; color: #333333; }
            .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; }
            .content { padding: 40px 30px; text-align: center; background-color: #FDF8F5; }
            .brand-subtitle { font-family: 'Arial', sans-serif; font-size: 12px; font-weight: bold; letter-spacing: 2px; color: #8B6D41; text-transform: uppercase; margin-bottom: 10px; }
            h1 { font-size: 28px; margin: 0 0 20px 0; color: #2C2C2C; }
            p { font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6; color: #555555; margin-bottom: 25px; }
            .promo-box { background-color: #FFFFFF; border: 1px dashed #8B6D41; padding: 15px; margin: 20px auto; max-width: 250px; border-radius: 4px; }
            .promo-code { font-size: 20px; font-weight: bold; color: #8B6D41; letter-spacing: 1px; }
            .cta-button { display: inline-block; background-color: #927552; color: #ffffff !important; text-decoration: none; font-family: 'Arial', sans-serif; font-weight: bold; font-size: 14px; padding: 14px 30px; border-radius: 4px; margin-top: 10px; }
            .footer { text-align: center; padding: 30px; background-color: #FDF8F5; border-top: 1px solid #EBE4DD; font-family: 'Arial', sans-serif; font-size: 11px; color: #888888; }
            .footer a { color: #8B6D41; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            
            <div style="background-color: #333333; width: 100%; max-width: 600px;">
                <div style="background-image: url('cid:nature-banner'); background-color: #333333; background-position: center; background-size: cover; background-repeat: no-repeat; text-align: center; width: 100%; max-width: 600px;">
                    
                    <div style="background-color: rgba(0, 0, 0, 0.4); padding: 80px 20px; text-align: center;">
                        <h2 style="color: #FFFFFF !important; font-family: 'Georgia', serif; font-size: 36px; line-height: 1.2; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); font-weight: normal;">
                            Start Your Nutritious Journey
                        </h2>
                    </div>
                    
                </div>
                
                </div>
            <div class="content">
                <div class="brand-subtitle">Nature's Candy</div>
                <h1>Welcome to the Nature's Candy, ${userName}</h1>
                
                <p>We're thrilled to have you here. Explore our curated harvest of sun-dried fruits and premium nuts, selected for their exceptional texture and concentrated natural sweetness. These staples are the cornerstone of a mindful pantry.</p>
                
                <p>As a special thank you for joining us, please enjoy a gift on your first harvest</p>

                <div class="promo-box">
                    <span style="font-size: 12px; font-family: Arial, sans-serif; color: #555; display: block; margin-bottom: 5px;">YOUR EXCLUSIVE CODE</span>
                    <span class="promo-code">${promoCode}</span>
                </div>

                <a href="https://naturecandy.vercel.app" class="cta-button">Shop Now</a>
            </div>

            <div class="footer">
                <p>Need assistance with your selection?<br>
                Reply to this email or <a href="https://naturecandy.vercel.app/">visit our help center</a>.</p>
                <p>© ${new Date().getFullYear()} Nature's Candy. Ethically sourced, curated with care.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const info = await transporter.sendMail({
            from: '"Nature\'s Candy" <kannandk37@gmail.com>',
            to: userEmail,
            subject: "Welcome to Nature's Candy! Your special gift inside ✨",
            html: htmlContent,
            attachments: [
                {
                    filename: 'banner.png',
                    path: heroImageUrl,
                    cid: 'nature-banner'
                }
            ]
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error: unknown) {
        console.error("Error sending welcome email:", error);
        return { success: false, error };
    }
}


export async function resetPasswordEmail({
    userEmail,
    userName,
}: ResetPasswordEmailParams) {

    // The path to your banner
    const heroImageUrl = 'D:/naturecandy/back-end/data/Banner.png';
    const url = `https://naturecandy.vercel.app/reset-password?email=${userEmail}`
    const htmlContent = `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password for Nature's Candy</title>
        <style>
            body { margin: 0; padding: 0; background-color: #FDF8F5; font-family: 'Georgia', serif; color: #333333; }
            .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; }
            .content { padding: 40px 30px; text-align: center; background-color: #FDF8F5; }
            .brand-subtitle { font-family: 'Arial', sans-serif; font-size: 12px; font-weight: bold; letter-spacing: 2px; color: #8B6D41; text-transform: uppercase; margin-bottom: 10px; }
            h1 { font-size: 28px; margin: 0 0 20px 0; color: #2C2C2C; }
            p { font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6; color: #555555; margin-bottom: 25px; }
            .promo-box { background-color: #FFFFFF; border: 1px dashed #8B6D41; padding: 15px; margin: 20px auto; max-width: 250px; border-radius: 4px; }
            .promo-code { font-size: 20px; font-weight: bold; color: #8B6D41; letter-spacing: 1px; }
            .cta-button { display: inline-block; background-color: #927552; color: #ffffff !important; text-decoration: none; font-family: 'Arial', sans-serif; font-weight: bold; font-size: 14px; padding: 14px 30px; border-radius: 4px; margin-top: 10px; }
            .footer { text-align: center; padding: 30px; background-color: #FDF8F5; border-top: 1px solid #EBE4DD; font-family: 'Arial', sans-serif; font-size: 11px; color: #888888; }
            .footer a { color: #8B6D41; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            
            <div style="background-color: #333333; width: 100%; max-width: 600px;">
                <div style="background-image: url('cid:nature-banner'); background-color: #333333; background-position: center; background-size: cover; background-repeat: no-repeat; text-align: center; width: 100%; max-width: 600px;">
                    
                    <div style="background-color: rgba(0, 0, 0, 0.4); padding: 80px 20px; text-align: center;">
                        <h2 style="color: #FFFFFF !important; font-family: 'Georgia', serif; font-size: 36px; line-height: 1.2; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); font-weight: normal;">
                            Reset Your Nutritious Journey
                        </h2>
                    </div>
                    
                </div>
                
                </div>
            <div class="content">
                <div class="brand-subtitle">Nature's Candy</div>
                <h1>Hello, ${userName}</h1>
                
                <p>We received a request to reset your password. Click the button below to secure your account and return to your curated collection.</p>

                <a href=${url} class="cta-button">Reset Password</a>

                <p>If you did not request this, you can safely ignore this email. Your account security remains our highest priority.</p>

            </div>

            <div class="footer">
                <p>Need assistance with your selection?<br>
                Reply to this email or <a href="https://naturecandy.vercel.app/">visit our help center</a>.</p>
                <p>© ${new Date().getFullYear()} Nature's Candy. Ethically sourced, curated with care.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const info = await transporter.sendMail({
            from: '"Nature\'s Candy" <kannandk37@gmail.com>',
            to: userEmail,
            subject: "Reset password for Nature's Candy",
            html: htmlContent,
            attachments: [
                {
                    filename: 'banner.png',
                    path: heroImageUrl,
                    cid: 'nature-banner'
                }
            ]
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error: unknown) {
        console.error("Error sending Reset password email:", error);
        return { success: false, error };
    }
}

export async function userOnBoardingPasswordReset({
    userEmail,
    userName,
    password,
    roleName
}: UserOnBoardingPasswordResetParams) {

    // The path to your banner
    const heroImageUrl = 'D:/naturecandy/back-end/data/Banner.png';
    const url = `https://naturecandy.vercel.app/reset-password?email=${userEmail}`
    const htmlContent = `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Nature's Candy</title>
        <style>
            body { margin: 0; padding: 0; background-color: #FDF8F5; font-family: 'Georgia', serif; color: #333333; }
            .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; }
            .content { padding: 40px 30px; text-align: center; background-color: #FDF8F5; }
            .brand-subtitle { font-family: 'Arial', sans-serif; font-size: 12px; font-weight: bold; letter-spacing: 2px; color: #8B6D41; text-transform: uppercase; margin-bottom: 10px; }
            h1 { font-size: 28px; margin: 0 0 20px 0; color: #2C2C2C; }
            p { font-family: 'Arial', sans-serif; font-size: 14px; line-height: 1.6; color: #555555; margin-bottom: 25px; }
            .promo-box { background-color: #FFFFFF; border: 1px dashed #8B6D41; padding: 15px; margin: 20px auto; max-width: 250px; border-radius: 4px; }
            .promo-code { font-size: 20px; font-weight: bold; color: #8B6D41; letter-spacing: 1px; }
            .cta-button { display: inline-block; background-color: #927552; color: #ffffff !important; text-decoration: none; font-family: 'Arial', sans-serif; font-weight: bold; font-size: 14px; padding: 14px 30px; border-radius: 4px; margin-top: 10px; }
            .footer { text-align: center; padding: 30px; background-color: #FDF8F5; border-top: 1px solid #EBE4DD; font-family: 'Arial', sans-serif; font-size: 11px; color: #888888; }
            .footer a { color: #8B6D41; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            
            <div style="background-color: #333333; width: 100%; max-width: 600px;">
                <div style="background-image: url('cid:nature-banner'); background-color: #333333; background-position: center; background-size: cover; background-repeat: no-repeat; text-align: center; width: 100%; max-width: 600px;">
                    
                    <div style="background-color: rgba(0, 0, 0, 0.4); padding: 80px 20px; text-align: center;">
                        <h2 style="color: #FFFFFF !important; font-family: 'Georgia', serif; font-size: 36px; line-height: 1.2; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); font-weight: normal;">
                            Start Your Journey
                        </h2>
                    </div>
                    
                </div>
                
                </div>
            <div class="content">
                <div class="brand-subtitle">Nature's Candy</div>
                <h1>Welcome to the Nature's Candy, ${userName}</h1>
                
                <p>We are pleased to welcome you to the team. As an ${roleName.charAt(0).toLocaleUpperCase() + roleName.slice(1)}, you will play a vital role in managing our organic harvest and maintaining the digital integrity of our online store.</p>
                
                <p>Your Email : ${userEmail}</p>

                <div class="promo-box">
                    <span style="font-size: 12px; font-family: Arial, sans-serif; color: #555; display: block; margin-bottom: 5px;">YOUR TEMPORARYU PASSWORD</span>
                    <span class="promo-code">${password}</span>
                </div>

                <a href=${url} class="cta-button">Reset Password</a>
            </div>

            <div class="footer">
                <p>Need assistance with your selection?<br>
                Reply to this email or <a href="https://naturecandy.vercel.app/">visit our help center</a>.</p>
                <p>© ${new Date().getFullYear()} Nature's Candy. Ethically sourced, curated with care.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const info = await transporter.sendMail({
            from: '"Nature\'s Candy" <kannandk37@gmail.com>',
            to: userEmail,
            subject: "Reset password for Nature's Candy",
            html: htmlContent,
            attachments: [
                {
                    filename: 'banner.png',
                    path: heroImageUrl,
                    cid: 'nature-banner'
                }
            ]
        });

        console.log("Message sent: %s", info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error: unknown) {
        console.error("Error sending Reset password email:", error);
        return { success: false, error };
    }
}