import Image from "next/image"
import styles from "./About.module.css"
import { useTranslation } from "react-i18next"
const AboutSection: React.FC = () => {
    const { t } = useTranslation(["landing"])
    return (
        <section id="about" className={styles.aboutUsSection}>
            <div className={`${styles.bubble} ${styles.bubble1}`}></div>
            <div className={`${styles.bubble} ${styles.bubble2}`}></div>
            <div className={`${styles.bubble} ${styles.bubble3}`}></div>
            <div className={`${styles.bubble} ${styles.bubble4}`}></div>
            <h2>{t("aboutSection.title")}</h2>
            <p>{t("aboutSection.description")}</p>
            <div className={styles.imagesContainer}>
                <div className={styles.imageBox}>
                    <Image className={styles.img} src="/background/Security.png" alt="Security" width={280} height={490} />
                    <span className={styles.imageLabel}>{t("aboutSection.imageDescriptions.security")}</span>
                </div>
                <div className={styles.imageBox}>
                    <Image className={styles.img} src="/background/Speed.png" alt="Speed" width={280} height={490} />
                    <span className={styles.imageLabel}>{t("aboutSection.imageDescriptions.speed")}</span>
                </div>
                <div className={styles.imageBox}>
                    <Image className={styles.img} src="/background/Efficiency.png" alt="Efficiency" width={280} height={490} />
                    <span className={styles.imageLabel}>{t("aboutSection.imageDescriptions.efficiency")}</span>
                </div>
            </div>

        </section>
    )
}
export default AboutSection