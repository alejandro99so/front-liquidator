"use client"
import PageContainer from '@/components/PageContainer/PageContainer';
import styles from './details.module.css';
import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ButtonLink } from '@/components/Buttons/ButtonLink';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import UpdateTotalToken from '@/components/Modal/updateTotalToken/UpdateTotalToken';
import { BankDetails, Details, FormState } from '@/app/types';
import { headers } from 'next/headers';
import { usePathname, useSearchParams } from 'next/navigation';
import { networks } from '@/utils/networks';
import { formatWalletAddress } from '@/utils/formatWalletAddress';

const Page = () => {
    const { t } = useTranslation(['pay'])

    const pathname = usePathname()
    const pathParts = pathname.split('/');
    const id = pathParts[pathParts.length - 1];

    const [data, setData] = useState<Details>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalToken, setTotalToken] = useState<number>(0);
    const [qrCode, setQrCode] = useState<string | null>(null);
    // const [bankDetails, setBankDetails] = useState<BankDetails>({
    //     bank: '',
    //     typeAccount: '',
    //     nAccount: ''
    // });

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
        const fetchRoomDetails = async () => {
            const jwt = sessionStorage.getItem('jwt');

            if (!jwt || !id) {
                console.error('Token or Id is missing');
                return;
            }
            try {
                const response = await fetch(`http://localhost:3000/room/request/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwt}`
                    },
                });
                const data: Details | null = await response.json();
                if (data !== null) {
                    setData(data);
                    if (data.typeAccount === 'qr') {
                        generateQRCode(data.qr);
                    } else {
                        // setBankDetails(data.bankDetails);
                    }

                    const cop = parseFloat(data?.cop!)
                    const usd = parseFloat(data?.usd!)
                    const total = cop / usd;
                    setTotalToken(total)

                } else {
                    console.log({ data, response });
                }
            } catch (error) {
                console.error('Failed to fetch room details:', error);
            }
        };
        fetchRoomDetails();
    }, [id]);

    const handleTotalTokenClick = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = (updatedRate?: number) => {
        setIsModalOpen(false);
        if (typeof updatedRate === 'number') {
            setTotalToken(updatedRate);
        }
    };

    const handlePay = async () => {
        const paymentDetails = {
            totalToken: "",
        };
        console.log("Payment Details:", paymentDetails);
    };
    console.log({ data });
    return (
        <PageContainer>
            <div className={styles.formContainer}>
                <div className={styles.inputGroup}>
                    <div className={styles.user}>
                        <Image src={"/icons/user.svg"} alt='user.svg' width={30} height={30} />
                        <span className={styles.address}>{formatWalletAddress(data?.userAddress!)}</span>
                        {/* <Image src={"/icons/message.svg"} alt='' width={20} height={20} /> */}
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <label>Red:</label>
                    <div className={styles.totalInputContainer}>
                        <span className={styles.totalInput}>{networks[data?.network!]}</span>
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <label>Token:</label>
                    <div className={`${styles.totalInputContainer}`}>
                        <span className={`${styles.totalInput} ${styles.upper}`}>{data?.cryptoCurrency}</span>
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <label>Total:</label>
                    <div className={`${styles.totalInputContainer}`}>
                        <span className={styles.totalInput}>{data?.cop}</span>
                        <span className={styles.unit}>COP</span>
                    </div>
                </div>
                <div>
                    <div className={styles.inputGroup}>
                        <label>Total Token:</label>
                        <div className={`${styles.totalInputToken}`}>
                            <input
                                type="number"
                                name="totalToken"
                                value={totalToken}
                                onClick={handleTotalTokenClick}
                                readOnly
                                className={styles.totalInput}
                            />
                            <span className={`${styles.unit} ${styles.upper}`}>{data?.cryptoCurrency}</span>
                        </div>
                    </div>
                    <div className={styles.rateInfoContainer}>
                        <span className={styles.rateLabel}>Rate:</span>
                        <span className={styles.rateValue}>{data?.usd}.00 USD</span>
                    </div>
                </div>

                {data?.typeAccount === 'qr' && qrCode && (
                    <div className={styles.details}>
                        <div className={styles.inputGroup}>
                            <label>{t("method")}:</label>
                            {qrCode ? (
                                <Image src={qrCode} alt="QR Code" width={200} height={200} className={styles.qrImage} />
                            ) : (
                                <span>{t("qr_select")}</span>
                            )}
                        </div>
                    </div>
                )}
                {data?.typeAccount === 'transfer' && (
                    <div className={styles.details}>
                        <div className={styles.inputGroup}>
                            <label>{t("bank")}:</label>
                            <div className={`${styles.totalInputContainer}`}>
                                <span className={styles.totalInput}>{data?.bankName}</span>
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>{t("type")}:</label>
                            <div className={`${styles.totalInputContainer}`}>
                                <span className={styles.totalInput}>{data?.bankType}</span>
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>{t("account")}:</label>
                            <div className={`${styles.totalInputContainer}`}>
                                <span className={styles.totalInput}>{data?.bankNumber}</span>
                            </div>
                        </div>
                    </div>
                )}
                <div className={styles.inputGroup}>
                    <label>{t("note")}:</label>
                    <textarea
                        rows={5}
                        name="note"
                        value={data?.message}
                        className={styles.textarea}
                        disabled={true}
                    >
                    </textarea>
                </div>
                <div className={styles.containerButtons}>
                    <ButtonLink href="/Building" title={t("pay")} color='#1F046B' onClick={handlePay} />
                </div>
                {isModalOpen && (
                    <UpdateTotalToken isOpen={isModalOpen} initialTotalToken={totalToken} onClose={handleModalClose} />
                )}
            </div>
        </PageContainer>
    );
};

export default Page;
