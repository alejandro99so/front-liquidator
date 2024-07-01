import Image from 'next/image';
import styles from './header.module.css';
import Link from 'next/link';
export const Header = () => {
    return (
        <header className={styles.container}>
            <Link href={"/"} className={styles.logo}>
                <Image src={"/logo.svg"} alt='logo.svg' width={190} height={80} />
            </Link>
            <div className={styles.button}>
                <w3m-button />
            </div>
        </header>
    );
}