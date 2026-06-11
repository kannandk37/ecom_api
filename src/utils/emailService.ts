import nodemailer from 'nodemailer';
import path from 'path';

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
    const imagePath = path.join(process.cwd(), 'data', 'Banner.png');
    const heroImageUrl = imagePath

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

                <a href="https://naturecandy.vercel.app" class="cta-button" target="_blank" rel="noopener noreferrer">Shop Now</a>
            </div>

            <div class="footer">
                <p>Need assistance with your selection?<br>
                Reply to this email or <a href="https://naturecandy.vercel.app/" target="_blank" rel="noopener noreferrer">visit our help center</a>.</p>
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
    const imagePath = path.join(process.cwd(), 'data', 'Banner.png');
    const heroImageUrl = imagePath
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

                <a href=${url} class="cta-button" target="_blank" rel="noopener noreferrer">Reset Password</a>

                <p>If you did not request this, you can safely ignore this email. Your account security remains our highest priority.</p>

            </div>

            <div class="footer">
                <p>Need assistance with your selection?<br>
                Reply to this email or <a href="https://naturecandy.vercel.app/" target="_blank" rel="noopener noreferrer">visit our help center</a>.</p>
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
    const imagePath = path.join(process.cwd(), 'data', 'Banner.png');
    const heroImageUrl = imagePath
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
                
                <p style = "font-weight: 900">Your Email : ${userEmail}</p>

                <div class="promo-box">
                    <span style="font-size: 12px; font-family: Arial, sans-serif; color: #555; display: block; margin-bottom: 5px; font-weight: 900">YOUR TEMPORARY PASSWORD</span>
                    <span class="promo-code">${password}</span>
                </div>

                <a href=${url} class="cta-button" target="_blank" rel="noopener noreferrer">Reset Password</a>
            </div>

            <div class="footer">
                <p>Need assistance with your selection?<br>
                Reply to this email or <a href="https://naturecandy.vercel.app/" target="_blank" rel="noopener noreferrer">visit our help center</a>.</p>
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
            subject: `Welcome On Board ${userName}`,
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


// Below is for the order confirmation

// const htmlContent = `
// <!DOCTYPE html>
// <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
// <head>
//     <meta charset="utf-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Order Confirmation - Nature's Candy</title>
//     <style>
//         body { margin: 0; padding: 0; background-color: #FDF8F5; font-family: 'Georgia', serif; color: #333333; }
//         .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; }
//         .content { padding: 40px 30px; background-color: #FDF8F5; }
//         .brand-subtitle { font-family: 'Arial', sans-serif; font-size: 12px; font-weight: bold; letter-spacing: 2px; color: #8B6D41; text-transform: uppercase; margin-bottom: 10px; }

//         /* ── Order Meta ── */
//         .order-meta { display: flex; justify-content: space-between; margin-bottom: 24px; }
//         .order-meta-block { display: flex; flex-direction: column; gap: 4px; }
//         .order-meta-label { font-family: 'Arial', sans-serif; font-size: 10px; font-weight: bold; letter-spacing: 1.5px; color: #8B6D41; text-transform: uppercase; }
//         .order-meta-value { font-family: 'Arial', sans-serif; font-size: 14px; font-weight: bold; color: #2C2C2C; }
//         .order-meta-right { text-align: right; }

//         /* ── Items ── */
//         .items-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
//         .item-row td { padding: 14px 0; border-bottom: 1px solid #F0EBE5; vertical-align: middle; }
//         .item-row:last-child td { border-bottom: none; }
//         .item-thumb { width: 52px; height: 52px; border-radius: 8px; object-fit: cover; }
//         .item-info { padding: 0 12px; }
//         .item-name { font-family: 'Arial', sans-serif; font-size: 13px; font-weight: 700; color: #2C2C2C; margin: 0 0 4px 0; }
//         .item-qty { font-family: 'Arial', sans-serif; font-size: 12px; color: #888888; margin: 0; }
//         .item-price { font-family: 'Arial', sans-serif; font-size: 14px; font-weight: 800; color: #8B6D41; text-align: right; white-space: nowrap; }

//         /* ── Totals ── */
//         .totals-section { border-top: 1px solid #EBE4DD; padding-top: 16px; margin-top: 8px; }
//         .totals-row { display: flex; justify-content: space-between; font-family: 'Arial', sans-serif; font-size: 13px; color: #555555; margin-bottom: 10px; }
//         .totals-free { color: #2C7A4B; font-weight: 700; }
//         .totals-discount { color: #C0392B; font-weight: 700; }
//         .totals-divider { height: 1px; background: #EBE4DD; margin: 14px 0; }
//         .totals-final { font-family: 'Arial', sans-serif; font-size: 15px; font-weight: 800; color: #2C2C2C; }
//         .totals-final-price { font-family: 'Arial', sans-serif; font-size: 15px; font-weight: 800; color: #8B6D41; }

//         /* ── Address & Delivery ── */
//         .info-grid { display: flex; gap: 30px; margin-top: 24px; padding-top: 24px; border-top: 1px solid #EBE4DD; }
//         .info-block { flex: 1; }
//         .info-label { font-family: 'Arial', sans-serif; font-size: 10px; font-weight: bold; letter-spacing: 1.5px; color: #8B6D41; text-transform: uppercase; margin-bottom: 8px; }
//         .info-text { font-family: 'Arial', sans-serif; font-size: 13px; color: #555555; line-height: 1.7; margin: 0; }
//         .info-text-bold { font-family: 'Arial', sans-serif; font-size: 13px; font-weight: 700; color: #2C2C2C; margin: 0 0 4px 0; }

//         /* ── CTA ── */
//         .cta-wrap { text-align: center; margin-top: 32px; }
//         .cta-button { display: inline-block; background-color: #927552; color: #ffffff !important; text-decoration: none; font-family: 'Arial', sans-serif; font-weight: bold; font-size: 14px; padding: 14px 30px; border-radius: 4px; }

//         /* ── Footer ── */
//         .footer-note { text-align: center; margin-top: 28px; padding-top: 20px; border-top: 1px solid #EBE4DD; }
//         .footer-note p { font-family: 'Arial', sans-serif; font-size: 12px; color: #888888; line-height: 1.6; margin: 0; }
//         .footer-note a { color: #8B6D41; text-decoration: underline; }
//         .footer { text-align: center; padding: 30px; background-color: #FDF8F5; border-top: 1px solid #EBE4DD; font-family: 'Arial', sans-serif; font-size: 11px; color: #888888; }
//         .footer a { color: #8B6D41; text-decoration: none; }
//     </style>
// </head>
// <body>
//     <div class="container">

//         <!-- ── Hero Banner ── -->
//         <div style="background-color: #333333; width: 100%; max-width: 600px;">
//             <div style="background-image: url('cid:nature-banner'); background-color: #333333; background-position: center; background-size: cover; background-repeat: no-repeat; text-align: center; width: 100%; max-width: 600px;">
//                 <div style="background-color: rgba(0, 0, 0, 0.4); padding: 80px 20px; text-align: center;">
//                     <h2 style="color: #FFFFFF !important; font-family: 'Georgia', serif; font-size: 36px; line-height: 1.2; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); font-weight: normal;">
//                         Your Order Is Confirmed
//                     </h2>
//                     <p style="color: #F5EFE8; font-family: 'Arial', sans-serif; font-size: 14px; margin: 12px 0 0 0; letter-spacing: 0.5px;">
//                         Thank you for choosing Nature's Candy
//                     </p>
//                 </div>
//             </div>
//         </div>

//         <!-- ── Main Content ── -->
//         <div class="content">
//             <div class="brand-subtitle">Nature's Candy</div>

//             <!-- Order Meta -->
//             <div class="order-meta">
//                 <div class="order-meta-block">
//                     <span class="order-meta-label">Order Number</span>
//                     <span class="order-meta-value">#${orderNumber}</span>
//                 </div>
//                 <div class="order-meta-block order-meta-right">
//                     <span class="order-meta-label">Order Date</span>
//                     <span class="order-meta-value">${orderDate}</span>
//                 </div>
//             </div>

//             <!-- Items -->
//             <table class="items-table">
//                 <tbody>
//                     ${orderItems.map((item) => `
//                     <tr class="item-row">
//                         <td style="width: 52px;">
//                             <img src="${item.image}" alt="${item.name}" class="item-thumb" />
//                         </td>
//                         <td class="item-info">
//                             <p class="item-name">${item.name}</p>
//                             <p class="item-qty">Quantity: ${item.quantity} x ${item.weight}${item.unit}</p>
//                         </td>
//                         <td class="item-price">$${(item.price * item.quantity).toFixed(2)}</td>
//                     </tr>
//                     `).join("")}
//                 </tbody>
//             </table>

//             <!-- Totals -->
//             <div class="totals-section">
//                 <div class="totals-row">
//                     <span>Subtotal</span>
//                     <span>$${subtotal.toFixed(2)}</span>
//                 </div>
//                 <div class="totals-row">
//                     <span>Shipping</span>
//                     <span class="${shipping === 0 ? "totals-free" : ""}">
//                         ${shipping === 0 ? "Complimentary" : `$${shipping.toFixed(2)}`}
//                     </span>
//                 </div>
//                 ${discountCode ? `
//                 <div class="totals-row">
//                     <span>Archive Discount (${discountCode})</span>
//                     <span class="totals-discount">-$${discountAmount.toFixed(2)}</span>
//                 </div>
//                 ` : ""}
//                 <div class="totals-divider"></div>
//                 <div class="totals-row">
//                     <span class="totals-final">Total Amount</span>
//                     <span class="totals-final-price">$${totalAmount.toFixed(2)}</span>
//                 </div>
//             </div>

//             <!-- Shipping Address & Estimated Delivery -->
//             <div class="info-grid">
//                 <div class="info-block">
//                     <p class="info-label">Shipping Address</p>
//                     <p class="info-text-bold">${shippingAddress.name}</p>
//                     <p class="info-text">
//                         ${shippingAddress.line1}<br>
//                         ${shippingAddress.line2 ? shippingAddress.line2 + "<br>" : ""}
//                         ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.pincode}<br>
//                         ${shippingAddress.country}
//                     </p>
//                 </div>
//                 <div class="info-block">
//                     <p class="info-label">Estimated Delivery</p>
//                     <p class="info-text-bold">${estimatedDelivery}</p>
//                     <p class="info-text">${deliveryMethod}</p>
//                 </div>
//             </div>

//             <!-- CTA -->
//             <div class="cta-wrap">
//                 <a href="${trackingUrl}" class="cta-button" target="_blank" rel="noopener noreferrer">
//                     Track Your Order ↗
//                 </a>
//             </div>

//             <!-- Footer note -->
//             <div class="footer-note">
//                 <p>
//                     While you wait for your pantry essentials, why not explore our
//                     <a href="${recipesUrl}" target="_blank" rel="noopener noreferrer">curated recipes</a>
//                     for using your new ingredients?
//                 </p>
//             </div>
//         </div>

//         <!-- ── Footer ── -->
//         <div class="footer">
//             <p>Need assistance with your order?<br>
//             Reply to this email or <a href="https://naturecandy.vercel.app/" target="_blank" rel="noopener noreferrer">visit our help center</a>.</p>
//             <p>© ${new Date().getFullYear()} Nature's Candy. Ethically sourced, curated with care.</p>
//         </div>

//     </div>
// </body>
// </html>
// `;