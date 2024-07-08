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
    const { t } = useTranslation(['pay'])

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
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(true);
    const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
    const [bankDetails, setBankDetails] = useState<BankDetails>({
        bank: '',
        typeAccount: '',
        nAccount: ''
    });

    useEffect(() => {
        const { total, totalToken, method } = form;
        const isValid = total !== '' && totalToken !== '' && method !== '' &&
            ((method === 'qr' && qrCode !== null) ||
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

        if (value === 'qr') {
            setQrCode(null);  // Reset qr code
            setQrCodeData(null);
        } else if (value === 'Account') {
            setBankDetails({ bank: '', typeAccount: '', nAccount: '' });  // Reset bank details
        }

        setIsModalOpen(true);
    }, []);


    const handleModalClose = (data?: BankDetails) => {
        setIsModalOpen(false);
        if (form.method === 'Account' && data) {
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
        cop: form.total,
        usd: form.totalToken,
        type: form.method,
        message: form.note,
        ...(form.method === 'qr' ? { qr: qrCodeData } : bankDetails)
    };

    const handleContinue = async () => {
        const paymentDetails = {
            network: form.red,
            contract: form.token,
            cop: parseInt(form.total),
            usd: parseInt(form.totalToken),
            type: form.method,
            message: form.note,
            ...(form.method === 'qr' ? { qr: qrCodeData } : bankDetails)
        };

        console.log("Payment Details:", paymentDetails);

        const jwt = sessionStorage.getItem('jwt');
        console.log({ jwt });

        if (!jwt) {
            console.error('Token is missing');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/room/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`
                },
                body: JSON.stringify(paymentDetails)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Payment successful:', result);
        } catch (error) {
            console.error('Payment failed:', error);
        }

        // const generateConfirmationCode = () => {
        //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        //     let code = '';
        //     for (let i = 0; i < 4; i++) {
        //         const randomIndex = Math.floor(Math.random() * characters.length);
        //         code += characters[randomIndex];
        //     }
        //     return code;
        // };

        // setConfirmationCode(generateConfirmationCode());
        // setIsEditing(false);
    };



    const handleCancel = () => {
        setConfirmationCode(null);
        setIsEditing(true);
    };

    const handlePay = async () => {

        console.log("Payment Details:", paymentDetails);

    };

    return (
        <PageContainer>
            <div className={styles.formContainer}>
                {confirmationCode && (
                    <div className={styles.confirmationCode}>
                        <div>
                            <label className={styles.code}> {t("code")}: {confirmationCode}</label>
                        </div>
                        <div style={{ marginTop: "10px", display: "flex", gap: "30px" }}>
                            <span>Message:</span>
                            <Link href={"/Room"}>
                                <Image src={"/icons/message.svg"} alt='' width={20} height={20} />
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
                        <option value="USDC">USDC</option>
                        <option value="DAI">DAI</option>
                        <option value="USDT">USDT</option>
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
                                value="Account"
                                checked={form.method === 'Account'}
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
                                // <span>{qrCodeData}</span>
                            ) : (
                                <span>{t("qr_select")}</span>
                            )}
                        </div>
                    </div>
                )}
                {form.method === 'Account' && (
                    <div className={styles.details}>
                        <div className={styles.inputGroup}>
                            <label>{t("bank")}:</label>
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
                            <label>{t("type")}:</label>
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
                            <label>{t("account")}:</label>
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
                    <label>{t("note")}:</label>
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
                {isModalOpen && form.method === 'Account' && (
                    <InfoBankModal isOpen={isModalOpen} onClose={handleModalClose} />
                )}
            </div>
        </PageContainer>
    );
};

export default PayPage;
