"use client"

import Image from 'next/image';
import styles from './footer.module.css';
import Link from 'next/link';
import LanguageSwitcher from '../Language/LanguageSwitcher';
import Logo from '../Logo';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation(["header"])
    return (
        <footer className={styles.container}>
            <Link href={"/"} className={styles.logo}>
                <Image src={"/logo-light.svg"} alt='logo' width={190} height={80} />
            </Link>
            <div></div>
            <div className={styles.containerSocial}>
                <div className={styles.contaimerMenu}>

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
                </div>
                <div className={styles.button}>
                    <Link href={"/"} className={styles.logo}>
                        <Image src={"/social/x.png"} alt="logo" width={25} height={25} />
                    </Link>
                    <Link href={"/"} className={styles.logo}>
                        <Image src={"/social/instagram.png"} alt="logo" width={25} height={25} />
                    </Link>
                    <Link href={"/"} className={styles.logo}>
                        <Image src={"/social/warpcast.png"} alt="logo" width={25} height={25} />
                    </Link>
                    <Link href={"/"} className={styles.logo}>
                        <Image src={"/social/telegram.png"} alt="logo" width={25} height={25} />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
