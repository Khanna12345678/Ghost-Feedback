import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { userNameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: userNameValidation
});
export async function GET(request: Request) {
    
    await dbConnect();

    try {
        
        const { searchParams} = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username'),
        };

        const result = UsernameQuerySchema.safeParse(queryParams);
        if(!result.success){
            const usernameErrors = result.error.format()._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 
                'invalid query parameters',
            },
            { status: 400  }
        )
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: 'username already exists',
            },{status: 400});
        }

        return Response.json({ success: true, message: 'username available' },{status: 200});



    } catch (error) {
        console.log('error checking username', error);
        return Response.json({ success: false, message: 'Error checking username' }, { status: 500 });
    }

}
