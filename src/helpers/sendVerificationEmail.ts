import nodemailer from 'nodemailer';
import { ApiResponse } from "@/types/ApiResponse";
import { render } from '@react-email/components';
import VerificationEmail from '../../emails/VerificationEmail';
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
    },
});

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        console.log("Sending email to:", email);

        const emailHtml = render(VerificationEmail({ username, otp: verifyCode }));

        const info = await transporter.sendMail({
            from: "Ghost-Feedback", 
            to: email,
            subject: 'PGhost-Feedback Verification Code',
            html: emailHtml,
        });

        console.log("Email sent successfully:", email);
        return { success: true, message: "Verification email sent successfully" };
    } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        return { success: false, message: "Failed to send verification email" };
    }
}
