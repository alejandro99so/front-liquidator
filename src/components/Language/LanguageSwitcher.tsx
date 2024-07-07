"use client"
import React from 'react';
import i18n from "../../i18n";
import styles from "./languageSwitcher.module.css"
const LanguageSwitcher = () => {

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLanguage = event.target.value;
        i18n.changeLanguage(newLanguage);
        // localStorage.setItem('language', newLanguage);
    };

    return (
        <div className={styles.container}>
            <select onChange={handleLanguageChange} className={styles.select} >
                <option value="en">English</option>
                <option value="es">Spanish</option>
            </select>
        </div>
    );
};

export default LanguageSwitcher;