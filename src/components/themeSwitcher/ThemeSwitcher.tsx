"use client"
import { useContext } from "react";
import styles from "./themeSwitcher.module.css";
import Image from "next/image";
import { ThemeContext } from "@/context/ThemeContext";

const ThemeToggle = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('ThemeToggle must be used within a ThemeContextProvider');
    }

    const { theme, toggle } = context;

    const icon = theme === "dark"
        ? <Image className={styles.icon} src="/sun.svg" alt="sun.svg" width={30} height={30} />
        : <Image className={styles.icon} src="/moon.svg" alt="moon.svg" width={30} height={30} />

    return (
        <button className={styles.container} onClick={toggle}>
            {icon}
        </button>
    );
};

export default ThemeToggle;