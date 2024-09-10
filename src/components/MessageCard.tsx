'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import dayjs from 'dayjs';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"
import { Message } from "@/model/User"
import { toast, useToast } from "./ui/use-toast"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}
const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {

    const { toast } = useToast();
    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(
                `/api/delete-message/${message._id}`
            );
            toast({
                title: response.data.message,
            });
            if (typeof message._id === 'string') {
                onMessageDelete(message._id);
            } else {
                console.error('message._id is not a string');
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to delete message',
                variant: 'destructive',
            });
        }
    };

    return (
        <Card className="card-bordered z-10 dark:bg-black/40">
            <CardHeader >
                <div className="flex justify-between items-center">
                <CardDescription className="text-2xl dark:text-white text-black ">
                    {message.content
                        .split(' ')
                        .slice(0)
                        .map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
                        .join(' ')}
                </CardDescription>
                <AlertDialog  >
                    <AlertDialogTrigger asChild>
                        <Button className='bg-red-600' variant="destructive"><Trash2 className="h-4 w-4 "  /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </div>
            </CardHeader>
            {/* <CardContent>
                <p>{message.content}</p>
            </CardContent> */}
            <CardFooter className="text-gray-400">
                <p> {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</p>
            </CardFooter>
        </Card>

    )
}

export default MessageCard
