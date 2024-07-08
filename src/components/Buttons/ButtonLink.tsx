import Link from 'next/link';
import styles from './button.module.css'
type ButtonLinkProps = {
    href: string;
    title: string;
    color?: string;
    onClick?: () => void;
}

export const ButtonLink: React.FC<ButtonLinkProps> = ({ href, title, color, onClick }) => {

    return (
        <div style={{ backgroundColor: color }} className={styles.container}>
            <Link className={styles.link} href={href} onClick={onClick}>{title}</Link>
        </div>
    );
}