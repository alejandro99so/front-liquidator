"use client"
import PageContainer from '@/components/PageContainer/PageContainer'
import styles from './user.module.css'
import { useState, useEffect } from 'react';
import { ButtonLink } from '@/components/Buttons/ButtonLink';
import { ButtonAction } from '@/components/Buttons/ButtonAction';
import CodeModal from '@/components/Modal/codeModal/CodeModal';

interface Phrase {
    quote: string;
    author: string;
}

const UserPage = () => {
    const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

    useEffect(() => {
        const fetchQuote = async () => {
            const response = await fetch('/phrase-random.json');
            const data = await response.json();
            console.log({ data });

            const quotes: Phrase[] = data;
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            setCurrentPhrase(randomQuote);
        };

        fetchQuote();
    }, []);
    return (
        <PageContainer>
            <h1>Welcome to <span className={styles.flows}>Flows.money</span> 🫶🏻</h1>
            <div className={styles.container}>
                <p className={styles.quote}>{currentPhrase?.quote}</p>
                {currentPhrase?.author &&
                    <p className={styles.author}>- {currentPhrase?.author}</p>
                }
            </div>
            <div className={styles.containerButtons}>
                <ButtonLink href="/Pay" title="Pay" />
                <ButtonAction onClick={() => setIsCodeModalOpen(true)} title="Join" />
            </div>
            <CodeModal isOpen={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} />
        </PageContainer>
    )
}

export default UserPage