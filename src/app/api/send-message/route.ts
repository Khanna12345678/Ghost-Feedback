import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { use } from "react";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        //if user accepting messages
        if (!user.isAcceptingMessages) {
            return Response.json({ success: false, message: 'User is not accepting messages' }, { status: 403 });
        }

        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message);
        await user.save();
        return Response.json({ success: true, message: 'Message sent successfully' },
            { status: 200 });
    } catch (error) {
        console.log("Failed to send message:", error);
        
        return Response.json({ success: false, message: 'Failed to send message' }, { status: 500 });
    }
}