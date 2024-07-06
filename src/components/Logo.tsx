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
        ? <Image src="/buckspay-text-light.png" alt="buckspay-text-light.png" width={190} height={60} />
        : <Image src="/buckspay-text-dark.png" alt="buckspay-text-dark.png" width={190} height={60} />

    return icon;
};

export default Logo;