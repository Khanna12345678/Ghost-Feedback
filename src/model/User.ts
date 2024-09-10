import mongoose,{Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string;//string in typescript is in small
    createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
    content:{
        type: String,//String is in capital in mongoose
        required: true
    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now
    }
})//When you create such a schema in a document, it's not just messages that are going into the array; entire documents are going into the array. Therefore, it is very important to visualize this in MongoDB, showing that entire documents are going into the array, not just values. In our case, entire documents are being inserted.




export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const userSchema: Schema<User> = new Schema({
    username:{
        type: String,
        required: [true, "username is required"],
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: [true, "email is required"],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address']
    },
    password:{
        type: String,
        required: [true, "password is required"]
    },
    verifyCode:{
        type: String,
        required: [true, "verify code is required"]
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true, "verify code expiry is required"]
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAcceptingMessages:{
        type: Boolean,
        default: true
    },
    messages: [messageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);

export default UserModel;