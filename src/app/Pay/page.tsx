"use client"
import PageContainer from '@/components/PageContainer/PageContainer';
import styles from './pay.module.css';
import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import Image from 'next/image';
import { ButtonLink } from '@/components/Buttons/ButtonLink';
import { ButtonAction } from '@/components/Buttons/ButtonAction';
import { useTranslation } from 'react-i18next';
import { networks, tokens } from '@/utils/networks';
import useFormValidation from '@/hooks/useFormValidation';
import useExchangeRate from '@/hooks/useExchangeRate';
import fetchWithToken from '@/utils/fetchWithToken';
import { FormState, BankDetails } from '../types';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Loading/Spinner';
import LoadingText from '@/components/Loading/LoadingSText/LoadingText';

const SelectModal = lazy(() => import('@/components/Modal/selectModal/SelectModal'));
const InfoBankModal = lazy(() => import('@/components/Modal/infoBankModal/InfoBankModal'));

const PayPage = () => {
    const router = useRouter();
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
    const [loading, setLoading] = useState<boolean>(false);
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

            setJoinCode(code);
            setIdTrxReq(id);
            setIsEditing(false);
        } catch (error) {
            console.error('Payment failed:', error);
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setJoinCode(null);
        setIsEditing(true);
    };

    const handlePay = async () => {
        try {
            setLoading(true);
            const result = await fetchWithToken('http://localhost:3000/room/request-confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: idTrxReq })
            });
            console.log('Payment successful:', result);
            setIsEditing(false);
            setLoading(false);
            router.push('/Building')
        } catch (error) {
            console.error('Payment failed:', error);
        }
    };


    const [dollarP, setDollarP] = useState(0);
    const [dollarRange, setDollarRange] = useState([0, 0, 0]);

    const getPriceUsd = async () => {
        console.log("here");
        const request = await fetch(
            "https://api.investing.com/api/financialdata/2112/historical/chart/?interval=PT5M&pointscount=60"
        );
        const prices = await request.json();
        const latest = prices.data.slice(-10);
        let sumPrice = 0;
        for (let i = 0; i < 10; i++) {
            for (let j = 1; j < 5; j++) {
                sumPrice += latest[i][j];
            }
        }
        const conversionRate = Math.floor(sumPrice / 400) * 10;
        setDollarP(conversionRate);
    };

    useEffect(() => {
        console.log("before here");
        getPriceUsd();
    }, []);

    const getAmountToConvert = (valueSubs: number) => {
        let value = 0;
        if (dollarP) {
            const copInput = document.getElementById("copAmount");
            const usdInput = document.getElementById("usdAmount");
            if (usdInput && copInput) {
                value = Number((copInput.value / (dollarP - valueSubs)).toFixed(1));
            }
        }
        return value;
    };

    const convertCurrency = () => {
        const usdInput = document.getElementById("usdAmount");
        if (usdInput) {
            usdInput.value = getAmountToConvert(100);
            setDollarRange([
                getAmountToConvert(50),
                getAmountToConvert(100),
                getAmountToConvert(150),
            ]);
        }
    };

    const assignValue = (value: number) => {
        const usdInput = document.getElementById("usdAmount");
        if (usdInput) {
            usdInput.value = value;
        }
    };

    if (loading) {
        return <LoadingText />
    }


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
                            id="copAmount"
                            value={form.total}
                            onChange={handleInputChange}
                            className={styles.totalInput}
                            required
                            disabled={!isEditing}
                            min="20000"
                            onInput={() => convertCurrency()}
                        />
                        <span className={`${styles.unit} ${!isEditing ? styles.disabled : ''}`}>COP</span>
                    </div>
                </div>
                <div className={styles.trx_form_content}>
                    <div
                        className={styles.button_option_container}
                        onClick={() => assignValue(dollarRange[0])}
                    >
                        <span>Poco probable</span>
                        <div className={styles.button_option}>{dollarRange[0]}</div>
                    </div>
                    <div
                        className={styles.button_option_container}
                        onClick={() => assignValue(dollarRange[1])}
                    >
                        <span>Tárifa estándar</span>
                        <div className={styles.button_option}>{dollarRange[1]}</div>
                    </div>
                    <div
                        className={styles.button_option_container}
                        onClick={() => assignValue(dollarRange[2])}
                    >
                        <span>Recomendado</span>
                        <div className={styles.button_option}>{dollarRange[2]}</div>
                    </div>
                </div>
                <div>
                    <div className={styles.inputGroup}>
                        <label>Total Token:</label>
                        <div className={`${styles.totalInputContainer} ${!isEditing ? styles.disabled : ''}`}>
                            <input
                                id='usdAmount'
                                type="number"
                                name="totalToken"
                                value={dollarP}
                                onChange={handleInputChange}
                                className={styles.totalInput}
                                required
                                disabled={!isEditing}
                            />
                            <span className={`${styles.unit} ${!isEditing ? styles.disabled : ''}`}>{form.token}</span>
                        </div>
                    </div>
                    {/* {rate !== null && (
                        <div className={styles.rateInfoContainer}>
                            <span className={styles.rateLabel}>Rate:</span>
                            <span className={styles.rateValue}>{rate.toFixed(2)} COP / USD</span>
                        </div>
                    )} */}
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
                            <button onClick={handlePay} >{t("pay")}</button>
                            <ButtonLink href="/Building" title={t("pay")} color='#1F046B' onClick={handlePay} />
                        </div>
                    </>
                )}
                {isModalOpen && form.method === 'qr' && (
                    <Suspense fallback={<Spinner />}>
                        <SelectModal isOpen={isModalOpen} onClose={handleModalClose} onImageSelect={handleImageSelect} onQrCodeDetected={handleQrCodeDetected} />
                    </Suspense>
                )}
                {isModalOpen && form.method === 'transfer' && (
                    <Suspense fallback={<Spinner />}>
                        <InfoBankModal isOpen={isModalOpen} onClose={handleModalClose} />
                    </Suspense>
                )}
            </div>
        </PageContainer>
    );
};

export default PayPage;
