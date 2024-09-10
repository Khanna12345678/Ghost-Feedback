import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {

    await dbConnect();
    try {

        const { username, code } = await request.json();
        const decodeUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodeUsername });

        if (!user) {
            return Response.json({ success: false, message: 'user not found' }, { status: 400 });
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = Date.now() < user.verifyCodeExpiry.getTime();
        if (!user.isVerified && isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({ success: true, message: 'user verified successfully' }, { status: 200 });
        }
        else if (!isCodeNotExpired) {
            return Response.json({ success: false, message: 'code expired please signup again to get a new code' }, { status: 400 });
        }
        else if (!isCodeValid) {
            return Response.json({ success: false, message: 'code invalid' }, { status: 400 });
        }
        else {
            return Response.json({ success: false, message: 'user is already verified' }, { status: 400 });
        }

    } catch (error) {
        console.log('error verifying user', error);
        return Response.json({ success: false, message: 'Error verifying user' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    return Response.json(
        { success: false, message: 'GET method is not allowed on this endpoint' },
        { status: 405 }
    );
}