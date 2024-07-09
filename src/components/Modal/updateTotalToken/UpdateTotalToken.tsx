import React, { useEffect, useState } from 'react';
import Modal from '../Modal';
import styles from './UpdateTotalToken.module.css'
import { ButtonAction } from '@/components/Buttons/ButtonAction';
import { useTranslation } from 'react-i18next';
interface UpdateTotalTokenModalProps {
    isOpen: boolean;
    initialTotalToken: number;
    onClose: (updatedRate?: number) => void;
}

const UpdateTotalToken: React.FC<UpdateTotalTokenModalProps> = ({ isOpen, initialTotalToken, onClose }) => {
    const { t } = useTranslation(['details'])
    const [rate, setRate] = useState(0);

    const increaseTotalToken = () => {
        setRate((prev) => prev + 10);
    }

    const decreaseTotalToken = () => {
        setRate((prev) => prev - 10);
    }

    useEffect(() => {
        setRate(initialTotalToken);
    }, [initialTotalToken]);


    return (
        <Modal isOpen={isOpen} title={t("counteroffer")} onClose={onClose}>
            <div className={styles.content}>
                <div className={styles.inputGroup}>
                    <div className={styles.inputGroup}>
                        <label>Total Token:</label>
                        <input
                            type="text"
                            name="totalToken"
                            value={rate.toFixed(2)}
                            readOnly
                            className={styles.totalInput}
                        />
                        <span>COP</span>
                    </div>
                    <div className={styles.buttonsGroup}>
                        <button onClick={increaseTotalToken} className={styles.changeButton}>+</button>
                        <span>10.00</span>
                        <button onClick={decreaseTotalToken} className={styles.changeButton}>-</button>
                    </div>
                </div>
            </div>
            <div className={styles.containerButtons}>
                <ButtonAction onClick={onClose} title={t("cancel")} color='#313131' />
                <ButtonAction onClick={() => onClose(rate)} title={t("accept")} color='#1F046B' />
            </div>
        </Modal>
    );
};

export default UpdateTotalToken;
