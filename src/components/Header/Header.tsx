import Image from 'next/image';
import styles from './header.module.css';
import Link from 'next/link';
import LanguageSwitcher from '../Language/LanguageSwitcher';
import Logo from '../Logo';
export const Header = () => {
    return (
        <header className={styles.container}>
            <Link href={"/"} className={styles.logo}>
                <Logo />
            </Link>
            <div className={styles.button}>
                <LanguageSwitcher />
                <w3m-button />
            </div>
        </header>
    );
}