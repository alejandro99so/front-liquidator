"use client"
import PageContainer from '@/components/PageContainer/PageContainer';
import styles from './pay.module.css';
import { useState, useEffect, useCallback } from 'react';
import SelectModal from '@/components/Modal/selectModal/SelectModal';
import InfoBankModal from '@/components/Modal/infoBankModal/InfoBankModal';
import Image from 'next/image';
import { ButtonLink } from '@/components/Buttons/ButtonLink';
import { ButtonAction } from '@/components/Buttons/ButtonAction';
import Link from 'next/link';

interface FormState {
    red: string;
    token: string;
    total: string;
    totalToken: string;
    note: string;
    method: string;
}

interface BankDetails {
    bank: string;
    typeAccount: string;
    nAccount: string;
}

const PayPage = () => {
    const [form, setForm] = useState<FormState>({
        red: 'Base',
        token: 'USDC',
        total: '',
        totalToken: '',
        note: '',
        method: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [rate, setRate] = useState<number | null>(null);

    const [bankDetails, setBankDetails] = useState<BankDetails>({
        bank: '',
        typeAccount: '',
        nAccount: ''
    });

    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(true);
    const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

    useEffect(() => {
        const { total, totalToken, method } = form;
        const isValid = total !== '' && totalToken !== '' && method !== '' &&
            ((method === 'QR' && qrCode !== null) ||
                (method === 'Account' && bankDetails.bank !== '' && bankDetails.typeAccount !== '' && bankDetails.nAccount !== ''));
        setIsFormValid(isValid);
    }, [form, bankDetails, qrCode]);

    useEffect(() => {
        const { total, totalToken } = form;
        const totalValue = parseFloat(total.replace(/,/g, ''));
        const totalTokenValue = parseFloat(totalToken);

        if (!isNaN(totalValue) && !isNaN(totalTokenValue) && totalTokenValue !== 0) {
            setRate(totalValue / totalTokenValue);
        } else {
            setRate(null);
        }
    }, [form.total, form.totalToken]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    }, []);

    const handleBankDetailsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBankDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    }, []);

    const handleTokenChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value,
            totalToken: '',
        }));
    }, []);

    const handleRadioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            method: value,
        }));

        if (value === 'QR') {
            setQrCode(null);  // Reset QR code
        } else if (value === 'Account') {
            setBankDetails({ bank: '', typeAccount: '', nAccount: '' });  // Reset bank details
        }

        setIsModalOpen(true);
    }, []);

    const handleModalClose = (data?: BankDetails) => {
        setIsModalOpen(false);
        if (form.method === 'QR') {
            setQrCode(data?.bank || null);
        } else if (form.method === 'Account' && data) {
            setBankDetails(data);
        }
    };

    const handleImageSelect = (image: string) => {
        setQrCode(image);
        setIsModalOpen(false);
    };

    const handleContinue = () => {
        const generateConfirmationCode = () => {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let code = '';
            for (let i = 0; i < 4; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                code += characters[randomIndex];
            }
            return code;
        };

        setConfirmationCode(generateConfirmationCode());
        setIsEditing(false);
    };

    const handleCancel = () => {
        setConfirmationCode(null);
        setIsEditing(true);
    };

    return (
        <PageContainer>
            <div className={styles.formContainer}>
                {confirmationCode && (
                    <div className={styles.confirmationCode}>
                        <div>
                            <label className={styles.code}> Code: {confirmationCode}</label>
                        </div>
                        <div style={{ marginTop: "10px", display: "flex", gap: "30px" }}>
                            <span>Message:</span>
                            <Link href={"/Room"}>
                                <Image src={"/message.svg"} alt='' width={20} height={20} />
                            </Link>
                        </div>
                    </div>
                )}
                <div className={styles.inputGroup}>
                    <label>Red:</label>
                    <select className={styles.select} name="red" value={form.red} onChange={handleInputChange} disabled={!isEditing}>
                        <option value="Base">Base</option>
                        <option value="Avalanche">Avalanche</option>
                        <option value="Ethereum">Ethereum</option>
                        <option value="Arbitrum">Arbitrum</option>
                        <option value="Polygon">Polygon</option>
                        <option value="Optimism">Optimism</option>
                    </select>
                </div>
                <div className={styles.inputGroup}>
                    <label>Token:</label>
                    <select className={styles.select} name="token" value={form.token} onChange={handleTokenChange} disabled={!isEditing}>
                        <option value="DAI">DAI</option>
                        <option value="USDC">USDC</option>
                        <option value="USDT">USDT</option>
                    </select>
                </div>
                <div className={styles.inputGroup}>
                    <label>Total:</label>
                    <div className={styles.totalInputContainer}>
                        <input
                            type="number"
                            name="total"
                            value={form.total}
                            onChange={handleInputChange}
                            className={styles.totalInput}
                            required
                            disabled={!isEditing}
                        />
                        <span className={styles.unit}>COP</span>
                    </div>
                </div>
                <div>
                    <div className={styles.inputGroup}>
                        <label>Total Token:</label>
                        <div className={styles.totalInputContainer}>
                            <input
                                type="number"
                                name="totalToken"
                                value={form.totalToken}
                                onChange={handleInputChange}
                                className={styles.totalInput}
                                required
                                disabled={!isEditing}
                            />
                            <span className={styles.unit}>{form.token}</span>
                        </div>
                    </div>
                    {rate !== null && (
                        <span className={styles.rateInfo}>
                            Rate: {rate.toFixed(2)} COP
                        </span>
                    )}
                </div>
                <div className={styles.inputGroup}>
                    <label>Method:</label>
                    <div className={styles.radioGroup}>
                        <label>
                            <input
                                type="radio"
                                className={styles.radio}
                                name="method"
                                value="QR"
                                checked={form.method === 'QR'}
                                onChange={handleRadioChange}
                                disabled={!isEditing}
                            /> QR
                        </label>
                        <label>
                            <input
                                type="radio"
                                className={styles.radio}
                                name="method"
                                value="Account"
                                checked={form.method === 'Account'}
                                onChange={handleRadioChange}
                                disabled={!isEditing}
                            /> N° Account
                        </label>
                    </div>
                </div>
                {form.method === 'QR' && (
                    <div className={styles.details}>
                        <div className={styles.inputGroup}>
                            <label>QR Code:</label>
                            {qrCode ? (
                                <Image src={qrCode} alt="QR Code" width={200} height={200} className={styles.qrImage} />
                            ) : (
                                <span>No QR code selected</span>
                            )}
                        </div>
                    </div>
                )}
                {form.method === 'Account' && (
                    <div className={styles.details}>
                        <div className={styles.inputGroup}>
                            <label>Bank:</label>
                            <input
                                type="text"
                                name="bank"
                                value={bankDetails.bank}
                                onChange={handleBankDetailsChange}
                                className={styles.totalInput}
                                required
                                disabled={!isEditing}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Type Account:</label>
                            <input
                                type="text"
                                name="typeAccount"
                                value={bankDetails.typeAccount}
                                onChange={handleBankDetailsChange}
                                className={styles.totalInput}
                                required
                                disabled={!isEditing}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>N° Account:</label>
                            <input
                                type="text"
                                name="nAccount"
                                value={bankDetails.nAccount}
                                onChange={handleBankDetailsChange}
                                className={styles.totalInput}
                                required
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                )}
                <div className={styles.inputGroup}>
                    <label>Note:</label>
                    <textarea
                        rows={5}
                        name="note"
                        value={form.note}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        disabled={!isEditing}>
                    </textarea>
                </div>
                {isEditing ? (
                    <button className={styles.payButton} disabled={!isFormValid} aria-disabled={!isFormValid} onClick={handleContinue}>Continue</button>
                ) : (
                    <>
                        <div className={styles.containerButtons}>
                            <ButtonAction onClick={handleCancel} title="Cancel" color='red' />
                            <ButtonLink href="/Pay" title="Pay" />
                        </div>
                    </>
                )}
                {isModalOpen && form.method === 'QR' && (
                    <SelectModal isOpen={isModalOpen} onClose={handleModalClose} onImageSelect={handleImageSelect} />
                )}
                {isModalOpen && form.method === 'Account' && (
                    <InfoBankModal isOpen={isModalOpen} onClose={handleModalClose} />
                )}
            </div>
        </PageContainer>
    );
};

export default PayPage;
