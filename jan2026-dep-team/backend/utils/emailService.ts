import nodemailer from "nodemailer";

const createTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

export const sendOtpEmail = async (to: string, otp: string): Promise<void> => {
    const transporter = createTransporter();

    await transporter.sendMail({
        from: `"ShopEase" <${process.env.SMTP_USER}>`,
        to,
        subject: "Your Password Reset OTP",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 8px;">
                <h2 style="color: #4f46e5; margin-bottom: 8px;">Password Reset Request</h2>
                <p style="color: #374151;">Use the OTP below to reset your ShopEase account password. It is valid for <strong>10 minutes</strong>.</p>
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; text-align: center; margin: 24px 0; padding: 16px; background: #eef2ff; border-radius: 8px;">
                    ${otp}
                </div>
                <p style="color: #6b7280; font-size: 13px;">If you did not request this, please ignore this email. Your password will not change.</p>
            </div>
        `,
    });
};
