import React, { useState } from "react";
import Modal from "../Modal";
import styles from "./InfoBankModal.module.css";
import { ButtonAction } from "@/components/Buttons/ButtonAction";
import { useTranslation } from "react-i18next";
import { BankDetails } from "@/app/types";
interface InfoBankModalProps {
  isOpen: boolean;
  onClose: (data?: BankDetails) => void;
}

const InfoBankModal: React.FC<InfoBankModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation(["pay"]);

  const [form, setForm] = useState<BankDetails>({
    bankName: "Bancolombia",
    bankType: "Ahorros",
    bankNumber: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleAccept = () => {
    onClose(form);
  };

  return (
    <Modal isOpen={isOpen} title="" onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.inputGroup}>
          <label>{t("bank")}:</label>
          <select
            className={styles.select}
            name="bankName"
            value={form.bankName}
            onChange={handleInputChange}
          >
            <option value="Bancolombia">Bancolombia</option>
            <option value="Banco BBVA">Banco BBVA</option>
            <option value="Banco Agrario">Banco Agrario</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label>{t("type")}:</label>
          <select
            className={styles.select}
            name="bankType"
            value={form.bankNumber}
            onChange={handleTypeChange}
          >
            <option value="Ahorros">Ahorros</option>
            <option value="Corriente">Corriente</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label>{t("account")}:</label>
          <input
            type="number"
            name="bankNumber"
            value={form.bankNumber}
            onChange={handleInputChange}
            className={styles.totalInput}
            placeholder="1234567890"
          />
        </div>
      </div>
      <div className={styles.containerButtons}>
        <ButtonAction onClick={onClose} title={t("cancel")} color="#313131" />
        <ButtonAction
          onClick={handleAccept}
          title={t("accept")}
          color="#1F046B"
        />
      </div>
    </Modal>
  );
};

export default InfoBankModal;
