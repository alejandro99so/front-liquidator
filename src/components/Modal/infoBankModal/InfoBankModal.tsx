import React, { useState } from 'react';
import Modal from '../Modal';
import styles from './InfoBankModal.module.css'
import { ButtonAction } from '@/components/Buttons/ButtonAction';
import { useTranslation } from 'react-i18next';
interface InfoBankModalProps {
    isOpen: boolean;
    onClose: (data?: { bank: string; typeAccount: string; nAccount: string }) => void;
}

const InfoBankModal: React.FC<InfoBankModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation(['pay'])

    const [form, setForm] = useState({
        bank: '',
        typeAccount: '',
        nAccount: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleAccept = () => {
        onClose(form);
    };

    return (
        <Modal isOpen={isOpen} title="" onClose={onClose}>
            <div className={styles.content}>
                <div className={styles.inputGroup}>
                    <label>{t("bank")}:</label>
                    <select className={styles.select} name="bank" value={form.bank} onChange={handleInputChange}>
                        <option value="">{t("select_bank")}</option>
                        <option value="Bancolombia">Bancolombia</option>
                        <option value="Banco BBVA">Banco BBVA</option>
                        <option value="Banco Agrario">Banco Agrario</option>
                    </select>
                </div>
                <div className={styles.inputGroup}>
                    <label>{t("type")}:</label>
                    <select className={styles.select} name="typeAccount" value={form.typeAccount} onChange={handleTypeChange}>
                        <option value="">{t("select_type_account")}</option>
                        <option value="Ahorros">Ahorros</option>
                        <option value="Corriente">Corriente</option>
                    </select>
                </div>
                <div className={styles.inputGroup}>
                    <label>{t("account")}:</label>
                    <input
                        type="number"
                        name="nAccount"
                        value={form.nAccount}
                        onChange={handleInputChange}
                        className={styles.totalInput}
                        placeholder='1234567890'
                    />
                </div>
            </div>
            <div className={styles.containerButtons}>
                <ButtonAction onClick={onClose} title={t("cancel")} color='#313131' />
                <ButtonAction onClick={handleAccept} title={t("accept")} color='#1F046B' />
            </div>
        </Modal>
    );
};

export default InfoBankModal;
