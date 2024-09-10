"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { Button } from "./ui/button"

export function ThemeToggler() {
    const { theme, setTheme } = useTheme()
    const isDark = theme === "dark"

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <Button variant="ghost" className="w-9 px-0" onClick={toggleTheme}>
            {isDark ? (
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            ) : (
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}