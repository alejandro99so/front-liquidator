import React, { ReactNode } from "react";
import styles from "./pageContainer.module.css";
import MainContainer from "../MainContainer/Main";
interface PageContainerProps {
    children: ReactNode;
}


const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
    return (
        <MainContainer>
            <div className={styles.container}>
                {children}
            </div>
        </MainContainer>
    );
}

export default PageContainer;