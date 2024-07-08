"use client"
import { createContext, useEffect, useState, ReactNode } from "react";

type ThemeContextType = {
    theme: string;
    toggle: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getFromLocalStorage = (): string => {
    if (typeof window !== "undefined") {
        const value = localStorage.getItem("theme");
        return value || "light";
    }
    return "light";
};

type ThemeContextProviderProps = {
    children: ReactNode;
};

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<string>(() => {
        return getFromLocalStorage();
    });

    const toggle = () => {
        setTheme(currentTheme => (currentTheme === "light" ? "dark" : "light"));
    };

    useEffect(() => {
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
};
