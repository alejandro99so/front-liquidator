import Link from 'next/link';
import styles from './button.module.css'
type ButtonLinkProps = {
    href: string;
    title: string;
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({ href, title }) => {
    return (
        <div className={styles.container}>
            <Link className={styles.link} href={href}>{title}</Link>
        </div>
    );
}