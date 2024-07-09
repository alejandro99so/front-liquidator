import React from 'react';
import styles from './Hero.module.css';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const HeroSection: React.FC = () => {
    const { t } = useTranslation(["landing"])
    return (
        <section id='hero' className={styles.heroSection}>
            <div className={styles.background}>
                <div className={styles.circle} id={styles.circle1}></div>
                <div className={styles.circle} id={styles.circle2}></div>
                <div className={styles.circle} id={styles.circle3}></div> 
            </div>
            <div className={styles.content}>
                <h1 className="fade-in"> {t("heroSection.title")} <br /> {t("heroSection.start")}</h1>
                <div className={`${styles.paragraphContainer} fade-in`}>
                    <span></span>
                    <p>{t("heroSection.paragraph")}</p>
                </div>
                <div className={`${styles.buttonInfoContainer} fade-in`}>
                    <button className={styles.viewServicesButton}>{t("heroSection.viewServicesButton")}</button>
                    <div className={styles.infoBox}>
                        <div className={styles.popular}>
                            {/* <span>Popular</span> */}
                            <div className={styles.cryptoInfo}>
                                <div>BTC Bitcoin</div>
                                <div>$62,009.99</div>
                                <div>+1.57%</div>
                            </div>
                            <div className={styles.cryptoInfo}>
                                <div>ETH Ethereum</div>
                                <div>$3,424.57</div>
                                <div>+1.04%</div>
                            </div>
                            <div className={styles.cryptoInfo}>
                                <div>BNB BNB</div>
                                <div>$578.80</div>
                                <div>+1.22%</div>
                            </div>
                            <div className={styles.cryptoInfo}>
                                <div>XRP Ripple</div>
                                <div>$0.4739</div>
                                <div>-0.21%</div>
                            </div>
                        </div>
                        {/* <Link href="#">Ver las más de 350 monedas &gt;</Link> */}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default HeroSection;
