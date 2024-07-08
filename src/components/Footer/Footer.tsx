"use client"

import Image from 'next/image';
import styles from './footer.module.css';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { usePathname } from 'next/navigation';
import Logo from '../Logo';

export const Footer = () => {
    const { t } = useTranslation(["header"])
    const path = usePathname();
    return (
        <footer className={styles.container}>
            <Link href={"/"} className={styles.logo}>
                <Logo />
            </Link>
            <div></div>
            <div className={styles.containerSocial}>
                {path === "/" && <div className={styles.contaimerMenu}>

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
                </div>}
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
