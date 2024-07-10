
import React from 'react';
import styles from './LoadingText.module.css';
import Image from 'next/image';

const LoadingText: React.FC = () => {
    return (
        <div className={styles.loadingContainer}>
            <div className={styles.pigContainer}>
                {/* <Image src="/cerdo.webp" alt="Pig" width={100} height={100} className={styles.pig} /> */}
            </div>
            <p className={styles.loadingText}>
                Esperando Tokens del Usuario
                <span className={styles.dots}>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </span>
            </p>
        </div>
    );
};

export default LoadingText;
