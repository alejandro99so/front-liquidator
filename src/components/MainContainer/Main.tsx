import React, { ReactNode } from "react";
import styles from "./mainContainer.module.css";
interface MainContainerProps {
    children: ReactNode;
}


const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
    return (
        <div className={styles.container}>
            {children}
        </div>
    );
}

export default MainContainer;