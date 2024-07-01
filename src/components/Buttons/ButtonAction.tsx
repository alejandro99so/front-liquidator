import styles from './button.module.css'
type ButtonActionProps = {
    title: string;
    onClick?: () => void;
    color?: string;
}

export const ButtonAction: React.FC<ButtonActionProps> = ({ title, onClick, color }) => {
    return (
        <div style={{ backgroundColor: color }} className={styles.container}>
            <button className={styles.link} onClick={onClick}>{title}</button>
        </div>
    );
}