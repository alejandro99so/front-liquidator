import React, { useRef } from 'react';
import Modal from '../Modal';
import styles from './codeModal.module.css'
import { ButtonAction } from '@/components/Buttons/ButtonAction';

interface CodeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose }) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (value.length === 1) {
            if (inputRefs.current[index + 1]) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyUp = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && !event.currentTarget.value) {
            if (inputRefs.current[index - 1]) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const setRef = (index: number) => (element: HTMLInputElement | null) => {
        inputRefs.current[index] = element;
    };

    return (
        <Modal isOpen={isOpen} title="Enter Code" onClose={onClose}>
            <div className={styles.content}>
                {[0, 1, 2, 3].map((_, index) => (
                    <input
                        key={index}
                        ref={setRef(index)}
                        className={styles.codeInput}
                        type="text"
                        maxLength={1}
                        onChange={(e) => handleInputChange(index, e)}
                        onKeyUp={(e) => handleKeyUp(index, e)}
                    />
                ))}
            </div>
            <div className={styles.containerButtons}>
                <ButtonAction onClick={onClose} title='Cancel' color='blue' />
                <ButtonAction onClick={onClose} title='Accept' color='red' />
            </div>
        </Modal>
    );
};

export default CodeModal;
