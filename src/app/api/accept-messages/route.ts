import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if(!session || !session.user){
        return Response.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }    
        );

        if(!updatedUser){
            return Response.json({ success: false, message: 'Failed to update user status to accept messages' }, { status: 401 });
        }

        return Response.json({ success: true, message: 'Message acceptance updated successfully', updatedUser }, { status: 200 }); 

    } catch (error) {
        console.log("Failed to update user status to accept messages");
        return Response.json({ success: false, message: 'Failed to update user status to accept messages' }, { status: 500 });
        
    }

}

//get post is only to query data from database and send status
export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if(!session || !session.user){
        return Response.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);
        if(!foundUser){
            return Response.json({ success: false, message: 'User not found' }, { status: 404 });
        }
    
        return Response.json(
            { success: true, isAcceptingMessages : foundUser.isAcceptingMessages }, 
            { status: 200 });
            
    } catch (error) {

        console.log("Failed to get user status to accept messages");
        return Response.json(
            { success: false, message: 'Failed to get user status to accept messages' }, 
            { status: 500 });
        
    }
}
