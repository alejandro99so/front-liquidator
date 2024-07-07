"use client"

import styles from './header.module.css';
import Link from 'next/link';
import LanguageSwitcher from '../Language/LanguageSwitcher';
import Logo from '../Logo';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';

export const Header = () => {
    const { t } = useTranslation(["header"])
    const pathname = usePathname()

    return (
        <header className={styles.container}>
            <Link href={"/"} className={styles.logo}>
                <Logo />
            </Link>
            {pathname === "/" ? <div className={styles.contaimerMenu}>
                <ul className={styles.menu}>
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
            </div> : <div></div>}
            <div className={styles.button}>
                <LanguageSwitcher />
                <w3m-button />
            </div>
        </header>
    );
}

// export default Header;