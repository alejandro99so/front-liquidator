"use client"
import PageContainer from '@/components/PageContainer/PageContainer';
import styles from './details.module.css';
import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ButtonLink } from '@/components/Buttons/ButtonLink';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';

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

const DetailsPage = () => {
    const { t } = useTranslation(['pay'])

    const [form, setForm] = useState<FormState>({
        red: 'Base',
        token: 'USDC',
        total: '160000',
        totalToken: '4000',
        note: '',
        method: 'QR',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [rate, setRate] = useState<number | null>(null);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
    const [bankDetails, setBankDetails] = useState<BankDetails>({
        bank: 'Bancolombia',
        typeAccount: 'Ahorros',
        nAccount: '1234567890'
    });

    const qrData = "h/Z4+HZGpqPc33a9iwQxfnWPpbw3KFvQv1F7fXzU1Oe5L1yjs7z47BtdR+npU4njSO9qSk5c2DoLlr4S2kPOlIQD3xY5wDXrWPNmOf5Rh/vE3Nur5p/rmoIaxjyocbzaAOX6QxKiQ2pMDI9GwDgUEupS2QVzyj/Q4iVLjoBk4y+ZnBp14MitCtcL4Jt6JvQ2GaNfqe7po09whACNBP4f/7Su7/ul5T2V408UAHtSedXBq5FgT3N/e7V6PAd9keFafi25QpOjyzuLhp2LN6CB8KX19OLfs+SkfNbE66I5YukwM3ycqUJRHUEPl9hwB7U0zvVAkOHtyfIuwdE/9L8Hbw=="

    const generateQRCode = useCallback((text: string) => {
        QRCode.toDataURL(text, (err, url) => {
            if (err) {
                console.error(err);
                return;
            }
            setQrCode(url);
        });
    }, []);

    useEffect(() => {
        if (form.method === 'QR') {
            generateQRCode(qrData);
        }
    }, [form.method, generateQRCode]);

    const handleRadioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            method: value,
        }));

        if (value === 'QR') {
            generateQRCode(qrData);
        } else if (value === 'Account') {
            setBankDetails({
                bank: 'Sample Bank',
                typeAccount: 'Saving',
                nAccount: '1234567890'
            });
            setQrCode(null);
        }

        setIsModalOpen(true);
    }, [generateQRCode]);

    console.log({ qrCode });

    const handleTotalTokenClick = () => {
        setIsModalOpen(true);
    };

    const handlePay = async () => {
        const paymentDetails = {
            totalToken: form.totalToken,
        };
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
                    <select className={styles.select} name="red" value={form.red} disabled={!isEditing}>
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
                    <select className={styles.select} name="token" value={form.token} disabled={!isEditing}>
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
                        <div className={`${styles.totalInputContainer}`}>
                            <input
                                type="number"
                                name="totalToken"
                                value={form.totalToken}
                                className={styles.totalInput}
                                required
                                onClick={handleTotalTokenClick}
                            />
                            <span className={`${styles.unit}`}>{form.token}</span>
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
                                value="QR"
                                checked={form.method === 'QR'}
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
                {form.method === 'QR' && qrCode && (
                    <div className={styles.details}>
                        <div className={styles.inputGroup}>
                            <label>{t("qr_code")}:</label>
                            {qrCode ? (
                                <Image src={qrCode} alt="QR Code" width={200} height={200} className={styles.qrImage} />
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
                        className={styles.textarea}
                        disabled={!isEditing}>
                    </textarea>
                </div>
                <div className={styles.containerButtons}>
                    <ButtonLink href="/Building" title={t("pay")} color='#1F046B' onClick={handlePay} />
                </div>
                {/* {isModalOpen && (
                    <SelectModal onClose={() => setIsModalOpen(false)} />
                )} */}
            </div>
        </PageContainer>
    );
};

export default DetailsPage;
