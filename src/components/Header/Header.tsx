"use client"
import styles from './header.module.css';
import Link from 'next/link';
import LanguageSwitcher from '../Language/LanguageSwitcher';
import Logo from '../Logo';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
export const Header = () => {
    const { t } = useTranslation(["header"])
    const pathname = usePathname()
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const toggleMenu = () => {
        setMenuOpen(!menuOpen)
        console.log(menuOpen)
    }
    return (
        <header className={styles.container}>
            <Link href={"/"} className={styles.logo}>
                <Logo />
            </Link>

            <div className={`${styles.menu} ${menuOpen ? styles.menuOpen : ""}`}>
                {pathname === "/" && (
                    <ul className={styles.menuList}>
                        <li>
                            <Link className={styles.link} href={"#services"}>
                                {t("services")}
                            </Link>
                        </li>
                        <li>
                            <Link className={styles.link} href={"#about"}>
                                {t("about")}
                            </Link>
                        </li>
                        <li>
                            <Link className={styles.link} href={"#contact"}>
                                {t("contact")}
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
            <div className={styles.containerButtons}>
                <div className={`${styles.button} ${menuOpen ? styles.menuOpen : ""}`}>
                    <div className={styles.botones}>
                        <LanguageSwitcher />
                    </div>
                </div>
                <w3m-button />
                <button className={styles.hamburger} onClick={toggleMenu}>X</button>
            </div>
        </header>
    );
}