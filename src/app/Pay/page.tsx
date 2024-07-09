"use client"
import PageContainer from '@/components/PageContainer/PageContainer';
import styles from './pay.module.css';
import { useState, useEffect, useCallback, useRef } from 'react';
import SelectModal from '@/components/Modal/selectModal/SelectModal';
import InfoBankModal from '@/components/Modal/infoBankModal/InfoBankModal';
import Image from 'next/image';
import { ButtonLink } from '@/components/Buttons/ButtonLink';
import { ButtonAction } from '@/components/Buttons/ButtonAction';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { networks, tokens } from '@/utils/networks';
import useFormValidation from '@/hooks/useFormValidation';
import useExchangeRate from '@/hooks/useExchangeRate';
import fetchWithToken from '@/utils/fetchWithToken';
import { FormState, BankDetails } from '../types';

const PayPage = () => {
    const { t } = useTranslation(['pay']);

    const [form, setForm] = useState<FormState>({
        red: 'Base',
        token: 'USDC',
        total: '',
        totalToken: '',
        message: '',
        method: '',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(true);
    const [joinCode, setJoinCode] = useState<string | null>(null);
    const [idTrxReq, setIdTrxReq] = useState<string | null>(null);
    const [bankDetails, setBankDetails] = useState<BankDetails>({
        bankName: '',
        bankNumber: '',
        bankType: ''
    });

    const isFormValid = useFormValidation(form, bankDetails, qrCode);
    const rate = useExchangeRate(form);

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

    const handleRadioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            method: value,
        }));

        if (value === 'qr') {
            setQrCode(null);  // Reset qr code
            setQrCodeData(null);
        } else if (value === 'transfer') {
            setBankDetails({ bankName: '', bankType: '', bankNumber: '' });  // Reset bank details
        }

        setIsModalOpen(true);
    }, []);

    const handleModalClose = (data?: BankDetails) => {
        setIsModalOpen(false);
        if (form.method === 'transfer' && data) {
            setBankDetails(data);
        }
    };

    const handleImageSelect = (image: string) => {
        setQrCode(image);
        setIsModalOpen(false);
    };

    const handleQrCodeDetected = (data: string) => {
        setQrCodeData(data);
    };

    const paymentDetails = {
        network: form.red,
        contract: form.token,
        cop: parseInt(form.total),
        usd: parseInt(form.totalToken),
        type: form.method,
        message: form.message,
        ...(form.method === 'qr' ? { qr: qrCodeData } : { ...bankDetails })
    };

    const handleContinue = async () => {

        try {
            const { code, id } = await fetchWithToken('http://localhost:3000/room/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentDetails)
            });
            console.log({ paymentDetails });

            setJoinCode(code);
            setIdTrxReq(id);
            setIsEditing(false);
        } catch (error) {
            console.error('Payment failed:', error);
        }
    };

    const handleCancel = () => {
        setJoinCode(null);
        setIsEditing(true);
    };

    const handlePay = async () => {
        try {
            const result = await fetchWithToken('http://localhost:3000/room/request-confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: idTrxReq })
            });
            console.log('Payment successful:', result);
            setIsEditing(false);
        } catch (error) {
            console.error('Payment failed:', error);
        }
    };

    return (
        <PageContainer>
            <div className={styles.formContainer}>
                {joinCode && (
                    <div className={styles.confirmationCode}>
                        <div>
                            <label className={styles.code}> {t("code")}: {joinCode}</label>
                        </div>
                    </div>
                )}
                <div className={styles.inputGroup}>
                    <label>Red:</label>
                    <select className={styles.select} name="red" value={form.red} onChange={handleInputChange} disabled={!isEditing}>
                        {networks.map((network) => (
                            <option key={network} value={network}>{network}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.inputGroup}>
                    <label>Token:</label>
                    <select className={styles.select} name="token" value={form.token} onChange={handleInputChange} disabled={!isEditing}>
                        {tokens.map((token) => (
                            <option key={token} value={token}>{token}</option>
                        ))}
                    </select>
                </div>
                <div className={styles.inputGroup}>
                    <label>Total:</label>
                    <div className={`${styles.totalInputContainer} ${!isEditing ? styles.disabled : ''}`}>
                        <input
                            type="number"
                            name="total"
                            value={form.total}
                            onChange={handleInputChange}
                            className={styles.totalInput}
                            required
                            disabled={!isEditing}
                        />
                        <span className={`${styles.unit} ${!isEditing ? styles.disabled : ''}`}>COP</span>
                    </div>
                </div>
                <div>
                    <div className={styles.inputGroup}>
                        <label>Total Token:</label>
                        <div className={`${styles.totalInputContainer} ${!isEditing ? styles.disabled : ''}`}>
                            <input
                                type="number"
                                name="totalToken"
                                value={form.totalToken}
                                onChange={handleInputChange}
                                className={styles.totalInput}
                                required
                                disabled={!isEditing}
                            />
                            <span className={`${styles.unit} ${!isEditing ? styles.disabled : ''}`}>{form.token}</span>
                        </div>
                    </div>
                    {rate !== null && (
                        <div className={styles.rateInfoContainer}>
                            <span className={styles.rateLabel}>Rate:</span>
                            <span className={styles.rateValue}>{rate.toFixed(2)} COP</span>
                        </div>
                    )}
                </div>
                <div className={styles.inputGroup}>
                    <label>{t("method")}:</label>
                    <div className={styles.radioGroup}>
                        <label>
                            <input
                                type="radio"
                                className={styles.radio}
                                name="method"
                                value="qr"
                                checked={form.method === 'qr'}
                                onChange={handleRadioChange}
                                disabled={!isEditing}
                            /> {t("qr_code")}
                        </label>
                        <label>
                            <input
                                type="radio"
                                className={styles.radio}
                                name="method"
                                value="transfer"
                                checked={form.method === 'transfer'}
                                onChange={handleRadioChange}
                                disabled={!isEditing}
                            /> {t("account")}
                        </label>
                    </div>
                </div>
                {form.method === 'qr' && (
                    <div className={styles.details}>
                        <div className={styles.inputGroup}>
                            <label>{t("qr_code")}:</label>
                            {qrCode ? (
                                <Image src={qrCode} alt="qr Code" width={200} height={200} className={styles.qrImage} />
                            ) : (
                                <span>{t("qr_select")}</span>
                            )}
                        </div>
                    </div>
                )}
                {form.method === 'transfer' && (
                    <div className={styles.details}>
                        <div className={styles.inputGroup}>
                            <label>{t("bank")}:</label>
                            <input
                                type="text"
                                name="bankName"
                                value={bankDetails.bankName}
                                onChange={handleBankDetailsChange}
                                className={styles.totalInput}
                                required
                                disabled={!isEditing}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>{t("type")}:</label>
                            <input
                                type="text"
                                name="bankType"
                                value={bankDetails.bankType}
                                onChange={handleBankDetailsChange}
                                className={styles.totalInput}
                                required
                                disabled={!isEditing}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>{t("account")}:</label>
                            <input
                                type="text"
                                name="bankNumber"
                                value={bankDetails.bankNumber}
                                onChange={handleBankDetailsChange}
                                className={styles.totalInput}
                                required
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                )}
                <div className={styles.inputGroup}>
                    <label>{t("note")}:</label>
                    <textarea
                        rows={5}
                        name="message"
                        value={form.message}
                        onChange={handleInputChange}
                        className={styles.textarea}
                        disabled={!isEditing}>
                    </textarea>
                </div>
                {isEditing ? (
                    <button className={styles.payButton} disabled={!isFormValid} aria-disabled={!isFormValid} onClick={handleContinue}>{t("continue")}</button>
                ) : (
                    <>
                        <div className={styles.containerButtons}>
                            <ButtonAction onClick={handleCancel} title={t("cancel")} color='#313131' />
                            <ButtonLink href="/Building" title={t("pay")} color='#1F046B' onClick={handlePay} />
                        </div>
                    </>
                )}
                {isModalOpen && form.method === 'qr' && (
                    <SelectModal isOpen={isModalOpen} onClose={handleModalClose} onImageSelect={handleImageSelect} onQrCodeDetected={handleQrCodeDetected} />
                )}
                {isModalOpen && form.method === 'transfer' && (
                    <InfoBankModal isOpen={isModalOpen} onClose={handleModalClose} />
                )}
            </div>
        </PageContainer>
    );
};

export default PayPage;
