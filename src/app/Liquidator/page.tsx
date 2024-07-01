import PageContainer from '@/components/PageContainer/PageContainer'
import styles from './liquidator.module.css'
import Image from 'next/image'
import { ButtonLink } from '@/components/Buttons/ButtonLink'
const LiquidatorPage = () => {
    return (
        <PageContainer>
            <div className={styles.container}>
                <div className={styles.info}>
                    <div className={styles.user}>
                        <Image src={"/user.svg"} alt='user.svg' width={30} height={30} />
                        <span className={styles.address}>0x42...Fb8a</span>
                    </div>
                    <span className={styles.rate}>rate: 4,000 COP</span>
                    <span className={styles.amount}>160,000.00 COP</span>
                </div>
                <div className={styles.details}>
                    <ButtonLink href='/Details' title='Details' />
                    <div className={styles.logos}>
                        <span className={styles.border}>
                            <Image src={"/USDC.svg"} alt='USDC.svg' width={20} height={20} />
                        </span>
                        <span className={styles.border}>
                            <Image src={"/base.svg"} alt='base.svg' width={20} height={20} />
                        </span>
                    </div>
                </div>
            </div>

        </PageContainer>
    )
}

export default LiquidatorPage