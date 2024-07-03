"use client"
import { useContext } from "react";
import Image from "next/image";
import { ThemeContext } from "@/context/ThemeContext";

const Logo = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('ThemeToggle must be used within a ThemeContextProvider');
    }

    const { theme } = context;

    const icon = theme === "dark"
        ? <Image src="/logo-light.svg" alt="logo-light.svg" width={190} height={80} />
        : <Image src="/logo-dark.svg" alt="logo-dark.svg" width={190} height={80} />

    return icon;
};

export default Logo;