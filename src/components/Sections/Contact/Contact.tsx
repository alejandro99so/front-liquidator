import Image from 'next/image';
import styles from './Contact.module.css';
import { useTranslation } from 'react-i18next';

const ContactSection: React.FC = () => {
    const { t } = useTranslation(["landing"])
    return (
        <section id='contact' className={styles.contactSection}>
            <h2>{t("contactSection.title")}</h2>
            <p>
                {t("contactSection.titleFirst")}
                <span className={styles.liquidator}> {t("contactSection.liquidator")} </span>
                {t("contactSection.or")} <span className={styles.user}>{t("contactSection.user")} </span>
                {t("contactSection.titleSecond")}
            </p>
            <form action="" method="post" className={styles.contactForm}>
                <div className={styles.leftPanel}>
                    <div className={styles.iconContainer}>
                        <Image src="/pig_contact_us.png" alt="Security" width={200} height={300} />
                    </div>
                </div>
                <div className={styles.rightPanel}>
                    <div className={styles.formHeader}>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="fullName">{t("contactSection.form.fullName")}</label>
                        <input type="text" id="fullName" name="fullName" placeholder={t("contactSection.form.fullNamePlaceholder")} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="phone">{t("contactSection.form.phone")}</label>
                        <input type="text" id="phone" name="phone" placeholder={t("contactSection.form.phonePlaceholder")} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">{t("contactSection.form.email")}</label>
                        <input type="email" id="email" name="email" placeholder={t("contactSection.form.emailPlaceholder")} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="message">{t("contactSection.form.message")}</label>
                        <textarea
                            rows={5} id="message" name="message" placeholder={t("contactSection.form.messagePlaceholder")} />
                    </div>
                    <div className={styles.term}>
                        <input type="checkbox" id="agree" name="agree" />
                        <label htmlFor="agree">{t("contactSection.form.agree")}</label>
                    </div>
                    <div className={styles.formGroup}>
                        <button type="submit" className={styles.submitButton}>{t("contactSection.form.submit")}</button>
                    </div>
                </div>
            </form>
        </section>
    );
}

export default ContactSection;
