import React, { useState } from 'react';
import Modal from '../Modal';
import styles from './InfoBankModal.module.css'
import { ButtonAction } from '@/components/Buttons/ButtonAction';
interface InfoBankModalProps {
    isOpen: boolean;
    onClose: (data?: { bank: string; typeAccount: string; nAccount: string }) => void;
}

const InfoBankModal: React.FC<InfoBankModalProps> = ({ isOpen, onClose }) => {
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
        console.log({ form });
    };

    return (
        <Modal isOpen={isOpen} title="" onClose={onClose}>
            <div className={styles.content}>
                <div className={styles.inputGroup}>
                    <label>Bank:</label>
                    <select className={styles.select} name="bank" value={form.bank} onChange={handleInputChange}>
                        <option value="">Select bank</option>
                        <option value="Bancolombia">Bancolombia</option>
                        <option value="Banco BBVA">Banco BBVA</option>
                        <option value="Banco Agrario">Banco Agrario</option>
                    </select>
                </div>
                <div className={styles.inputGroup}>
                    <label>Type Account:</label>
                    <select className={styles.select} name="typeAccount" value={form.typeAccount} onChange={handleTypeChange}>
                        <option value="">Select type account</option>
                        <option value="Ahorros">Ahorros</option>
                        <option value="Corriente">Corriente</option>
                    </select>
                </div>
                <div className={styles.inputGroup}>
                    <label>N° Account:</label>
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
                <ButtonAction onClick={onClose} title='Cancel' color='red' />
                <ButtonAction onClick={handleAccept} title='Accept' color='#f28c1f' />
            </div>
        </Modal>
    );
};

export default InfoBankModal;
