"use client"
import PageContainer from '@/components/PageContainer/PageContainer'
import styles from './liquidator.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Loading from '@/components/Loading/Loading'
import { networks } from '@/utils/networks'
import { TrxRequest } from "@/app/types"
import { formatWalletAddress } from "@/utils/formatWalletAddress"

const LiquidatorPage = () => {
    const [trxs, setTrxs] = useState<TrxRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [rate, setRate] = useState<number | null>()

    useEffect(() => {
        const fetchRooms = async () => {
            const jwt = sessionStorage.getItem('jwt');
            console.log({ jwt });

            if (!jwt) {
                console.error('Token is missing');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/room/request?active=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${jwt}`
                    },
                });
                const data: TrxRequest[] = await response.json();
                console.log({ data });
                const totalValue = parseFloat(data[0].cop);
                const totalTokenValue = parseFloat(data[0].usd);
                setRate(totalValue / totalTokenValue)

                if (data === null || data.length === 0) {
                    setError('No hay solicitudes en el momento.');
                    setTrxs([]);
                }
                else {
                    setTrxs(data);
                }
                setLoading(false);

            } catch (error) {
                setError('Failed to fetch trxs');
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <PageContainer>
            {trxs.length === 0 || trxs === null ? (
                <p>No hay solicitudes en el momento.</p>
            ) : (
                trxs.map((trx) => (
                    <div key={trx._id} className={styles.container}>
                        <div className={styles.info}>
                            <div className={styles.user}>
                                <Image src={"/icons/user.svg"} alt='user.svg' width={30} height={30} />
                                <span className={styles.address}>{formatWalletAddress(trx.userAddress)}</span>
                            </div>
                            <span className={styles.rate}>rate: {rate}.00 / {trx.usd} USD</span>
                            <span className={styles.amount}>{trx.cop}.00 COP </span>
                        </div>
                        <div className={styles.details}>
                            <div className={styles.containerButtonDetails}>
                                <Link href={`/Details/${trx._id}`} className={styles.link}>Details</Link>
                            </div>
                            <div className={styles.logos}>
                                <span className={styles.border}>
                                    <Image src={`/icons/${trx.cryptoCurrency}.svg`} alt={`${trx.cryptoCurrency}.svg`} width={20} height={20} />
                                </span>
                                <span className={styles.border}>
                                    <Image src={`/icons/${networks[trx.network]}.png`} alt={`${networks[trx.network]}.png`} width={20} height={20} />
                                </span>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </PageContainer>
    )
}

export default LiquidatorPage