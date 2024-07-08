"use client"
import PageContainer from '@/components/PageContainer/PageContainer'
import styles from './user.module.css'
import { useState, useEffect } from 'react';
import CodeModal from '@/components/Modal/codeModal/CodeModal';
import { useTranslation } from 'react-i18next';
import i18n from "../../i18n";
import enDataRandom from "../../../public/locales/en/phrase-random.json"
import esDataRandom from "../../../public/locales/es/phrase-random.json"
import Link from 'next/link';

interface Phrase {
    quote: string;
    author: string;
}

const UserPage = () => {
    const { t } = useTranslation(['user'])
    const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null);
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

    useEffect(() => {
        const fetchQuote = async () => {
            const response = await fetch('/phrase-random.json');
            const data = await response.json();
            console.log({ data });

            const quotes: Phrase[] = data;
            const index = Math.floor(Math.random() * quotes.length)
            const randomQuote = quotes[index];
            setCurrentPhrase(randomQuote);
            setCurrentIndex(index);

        };

        fetchQuote();
    }, []);

    useEffect(() => {
        if (currentIndex !== null) {
            const dataRandom = i18n.language === 'es' ? esDataRandom : enDataRandom;
            setCurrentPhrase(dataRandom[currentIndex]);
        }
    }, [i18n.language, currentIndex]);


    return (
        <PageContainer>
            <h1 className={styles.title}>{t("welcome")} <span className={styles.flows}>BucksPay</span> 🫶🏻</h1>
            <div className={styles.container}>
                <p className={styles.quote}>{currentPhrase?.quote}</p>
                {currentPhrase?.author &&
                    <p className={styles.author}>- {currentPhrase?.author}</p>
                }
            </div>

            <div className={styles.containerButtons}>
                <Link className={`${styles.button} ${styles.buttonPay}`} href="/Pay">
                    {t("buttonPay")}
                </Link>
                <button className={`${styles.button} ${styles.buttonJoin}`} onClick={() => setIsCodeModalOpen(true)}>
                    {t("buttonJoin")}
                </button>
            </div>
            <CodeModal isOpen={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} />
        </PageContainer>
    )
}

export default UserPage