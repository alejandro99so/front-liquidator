import React from 'react';
import styles from './modal.module.css';

interface ModalProps {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, children, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button onClick={onClose} className={styles.closeButton}>X</button>
                <h2>{title}</h2>
                <div>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
