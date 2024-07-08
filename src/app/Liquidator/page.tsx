"use client"
import PageContainer from '@/components/PageContainer/PageContainer'
import styles from './liquidator.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Loading from '@/components/Loading/Loading'

type Room = {
    id: string;
    name: string;
    usd: string;
    cop: string;
    userAddress: string;
    cryptoCurrency: string[];
}

const LiquidatorPage = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [rate, setRate] = useState<number | null>()

    function formatWalletAddress(address: string) {
        const start = address.slice(0, 4);
        const end = address.slice(-4);
        return `${start}...${end}`;
    }
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
                const data: Room[] = await response.json();
                console.log({ data });
                const totalValue = parseFloat(data[0].cop);
                const totalTokenValue = parseFloat(data[0].usd);
                setRate(totalValue / totalTokenValue)

                if (data === null || data.length === 0) {
                    setError('No hay solicitudes en el momento.');
                    setRooms([]);
                }
                else {
                    setRooms(data);
                }
                setLoading(false);

            } catch (error) {
                setError('Failed to fetch rooms');
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
            {rooms.length === 0 || rooms === null ? (
                <p>No hay solicitudes en el momento.</p>
            ) : (
                rooms.map((room) => (
                    <div key={room.id} className={styles.container}>
                        <div className={styles.info}>
                            <div className={styles.user}>
                                <Image src={"/icons/user.svg"} alt='user.svg' width={30} height={30} />
                                <span className={styles.address}>{formatWalletAddress(room.userAddress)}</span>
                            </div>
                            <span className={styles.rate}>rate: {rate}.00 / {room.usd} USD</span>
                            <span className={styles.amount}>{room.cop}.00 COP </span>
                        </div>
                        <div className={styles.details}>
                            <div className={styles.containerButtonDetails}>
                                <Link href={`/details/${room.id}`} className={styles.link}>Details</Link>
                            </div>
                            {/* <div className={styles.logos}>
                                {room.cryptoCurrency.map((logo, index) => (
                                    <span key={index} className={styles.border}>
                                        <Image src={`/icons/${logo}.svg`} alt={`${logo}.svg`} width={20} height={20} />
                                    </span>
                                ))}
                            </div> */}
                        </div>
                    </div>
                ))
            )}

        </PageContainer>
    )
}

export default LiquidatorPage