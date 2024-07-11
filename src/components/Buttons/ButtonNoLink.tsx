import styles from "./button.module.css";
type ButtonLinkProps = {
  title: string;
  color?: string;
  onClick?: () => void;
};

export const ButtonNoLink: React.FC<ButtonLinkProps> = ({
  title,
  color,
  onClick,
}) => {
  return (
    <div style={{ backgroundColor: color }} className={styles.container}>
      <div className={styles.link} onClick={onClick}>
        {title}
      </div>
    </div>
  );
};
