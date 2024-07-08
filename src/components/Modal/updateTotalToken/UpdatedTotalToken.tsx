import React, { useState } from 'react';
import Modal from '../Modal';
import styles from './UpdatedTotalToken.module.css'
import { ButtonAction } from '@/components/Buttons/ButtonAction';
import { useTranslation } from 'react-i18next';
interface InfoBankModalProps {
    isOpen: boolean;
    onClose: (data?: { bank: string; typeAccount: string; nAccount: string }) => void;
}

const UpdatedTotalToken: React.FC<InfoBankModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation(['details'])
    const [rate, setRate] = useState(0);

    const increaseTotalToken = () => {
        setRate((prev) => prev + 10);
    }

    const decreaseTotalToken = () => {
        setRate((prev) => prev - 10);
    }

    return (
        <Modal isOpen={isOpen} title="" onClose={onClose}>
            <div className={styles.content}>
                <div className={styles.inputGroup}>
                    <label>{t("totalToken")}:</label>
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
                    <button onClick={decreaseTotalToken} className={styles.changeButton}>-</button>
                </div>
            </div>
            <div className={styles.containerButtons}>
                <ButtonAction onClick={onClose} title={t("cancel")} color='#313131' />
                <ButtonAction onClick={onClose} title={t("accept")} color='#1F046B' />
            </div>
        </Modal>
    );
};

export default UpdatedTotalToken;
