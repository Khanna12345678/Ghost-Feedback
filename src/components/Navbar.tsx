'use client'
import React from 'react'
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { space } from 'postcss/lib/list';
import { Button, buttonVariants } from "@/components/ui/button"
import { ThemeToggler } from './ThemeToggler';
import { Icons } from './Icons';
import { ButtonMoving } from './ui/moving-border';
const Navbar = () => {
    const { data: session } = useSession();
    const user: User = session?.user as User;
    const firstLetter = (user?.username || user?.email)?.charAt(0).toUpperCase();
    const lastName = (user?.username || user?.email)?.slice(1);
    const userName = `${firstLetter}${lastName}`;

    return (
        <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <Link className='text-xl font-bold mb-4 md:mb-0' href="">Ghost-Feedback</Link>
                {
                    session ? (
                        <>
                            <span className='mr-4'>Welcome, {userName}</span>
                        </>
                    ) : (
                        null
                    )
                }
                <div className='flex gap-1'>
                    <Link href={'https://github.com/ayushmehta292'}
                        target="_blank"
                        rel="noreferrer">
                        <div
                            className={` ${buttonVariants({ variant: "ghost" })}`}
                        >
                            <Icons.gitHub className="h-4 w-4" />
                            <span className="sr-only">GitHub</span>
                        </div>
                    </Link>
                    <Link href={'https://x.com/forAyushMehta'}
                        target="_blank"
                        rel="noreferrer">
                        <div
                            className={` ${buttonVariants({ variant: "ghost" })}`}
                        >
                            <Icons.twitter className="h-3 w-3 fill-current" />
                            <span className="sr-only">Twitter</span>
                        </div>
                    </Link>

                    <ThemeToggler />
                    <div className='ml-4'>
                    {session ? (
                        <Button onClick={() => signOut({ callbackUrl: '/' })} className="w-auto" >
                            Logout
                        </Button>
                    ) : (
                        <Link href="/sign-in"><Button>Login</Button></Link>

                    )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
