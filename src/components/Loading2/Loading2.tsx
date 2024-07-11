import React from "react";
import styles from "./Loading.module.css";

interface LoadingProps {
  text: string;
}

const Loading: React.FC<LoadingProps> = ({ text }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.loading_container}>
        <div className={styles.loading}></div>
        <div className={styles.loading_text}>{text}</div>
      </div>
    </div>
  );
};

export default Loading;
