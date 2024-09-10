"use client"
import { Form, FormControl, FormField, FormItem, FormLabel,FormMessage } from '@/components/ui/form'
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { messageSchema } from '@/schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { toast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { useCompletion } from 'ai/react'
import { Separator } from '@/components/ui/separator';
import { Link } from '@react-email/components';

const parseMessagesString = (messageString: string): string[] => {
  return messageString.split('||');
}
const initialMessagesString = "What's your favorite movie?||Which city have you traveled to so far?||What do you want to achieve in life?";
const Page = () => {

  const params = useParams<{ username: string }>();
  const username = params.username;
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  })
  //suggest message starts
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        content: data.content,
        username
      });
      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message
        });
        reset({ ...getValues(), content: '' });

      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const { complete, completion, isLoading: isSuggestLoading, error } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessagesString
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch suggestions',
        variant: 'destructive'
      });
    }
  }, [error]);

  const { register, watch, setValue, reset, getValues, handleSubmit, control } = form;
  const messageContent = watch('content');
  const handleMessageClick = (message: string) => {
    setValue('content', message);
  }

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch messages',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className='min-h-screen relative'>
      <div className='container mx-auto my-8 p-6 max-w-4xl mt-5'>
        <h1 className='text-4xl font-bold text-center mb-6'>Public Profile Link</h1>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="content"

              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <div className='flex justify-center'>
              {isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please Wait
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || !messageContent}>Send</Button>
              )}
            </div>
          </form>
        </Form>

        <div className='space-y-4 my-8'>
          <div className='space-y-2'>
            <Button onClick={fetchSuggestedMessages} disabled={false}>Suggest Messages</Button>
            <p>Click on any message below to select it.</p>
          </div>
          <Card>
            <CardHeader>
              <h3 className='text-xl font-semibold'>Messages</h3>
            </CardHeader>
            <CardContent className='flex flex-col space-y-4'>
              {error ? (
                parseMessagesString(initialMessagesString).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleMessageClick(message)}>
                    {message}
                  </Button>
                ))
              ) : (
                parseMessagesString(completion).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handleMessageClick(message)}>
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>
        <Separator className="my-6" />
        <div className="text-center">
          <div className="mb-4">Get Your Message Board</div>
          <Link href={'/sign-up'}>
            <Button>Create Your Account</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Page
