"use client"
import PageContainer from '@/components/PageContainer/PageContainer';
import styles from './details.module.css';
import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ButtonLink } from '@/components/Buttons/ButtonLink';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import { useRouter, useSearchParams } from 'next/navigation';

type FormState = {
    red: string;
    token: string;
    total: string;
    totalToken: string;
    note: string;
    method: string;
}

type BankDetails = {
    bank: string;
    typeAccount: string;
    nAccount: string;
}

type Room = {
    red: string;
    token: string;
    total: string;
    totalToken: string;
    note: string;
    method: string;
    qr: string;
    bankDetails: BankDetails;
}
const DetailsPage = () => {
    const { t } = useTranslation(['pay'])
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const router = useRouter();

    const [form, setForm] = useState<FormState>({
        red: '',
        token: '',
        total: '',
        totalToken: '',
        note: '',
        method: 'qr',
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [rate, setRate] = useState<number | null>(null);
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
    const [bankDetails, setBankDetails] = useState<BankDetails>({
        bank: '',
        typeAccount: '',
        nAccount: ''
    });

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
        if (id) {
            const fetchRoomDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/room/${id}`);
                    const data: Room | null = await response.json();

                    if (data) {
                        setForm({
                            red: data.red,
                            token: data.token,
                            total: data.total,
                            totalToken: data.totalToken,
                            note: data.note,
                            method: data.method,
                        });
                        if (form.method === 'qr') {
                            generateQRCode(data.qr);
                        } else {
                            setBankDetails(data.bankDetails);
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch room details:', error);
                }
            };

            fetchRoomDetails();
        }
    }, [form.method, generateQRCode, id]);

    // const handleRadioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { value } = e.target;
    //     setForm(prevForm => ({
    //         ...prevForm,
    //         method: value,
    //     }));

    //     if (value === 'QR') {
    //         generateQRCode(qrData);
    //     } else if (value === 'Account') {
    //         setBankDetails({
    //             bank: '',
    //             typeAccount: '',
    //             nAccount: ''
    //         });
    //         setQrCode(null);
    //     }

    //     setIsModalOpen(true);
    // }, [generateQRCode]);

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
                        <div style={{ marginTop: "10px", display: "flex", gap: "30px" }}>
                            <Link href={"/Room"}>
                                <Image src={"/icons/message.svg"} alt='' width={20} height={20} />
                            </Link>
                        </div>
                    </div>
                )}
                <div className={styles.inputGroup}>
                    <label>Red:</label>
                    <div className={styles.value}>{form.red}</div>
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
