"use client";
import PageContainer from "@/components/PageContainer/PageContainer";
import styles from "./pay.module.css";
import { useState, useEffect, useCallback, lazy } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/Buttons/ButtonLink";
import { ButtonAction } from "@/components/Buttons/ButtonAction";
import { useTranslation } from "react-i18next";
import { networks, tokens } from "@/utils/networks";
import useFormValidation from "@/hooks/useFormValidation";
import useExchangeRate from "@/hooks/useExchangeRate";
import { bucksPost } from "@/utils/fetchWithToken";
import { FormState, BankDetails } from "../types";
import { useRouter } from "next/navigation";
import Pusher from "pusher-js";
import { useWriteContract } from "wagmi";
import contract from "../../../constants.json";
import { useAccount } from "wagmi";

// import Spinner from "@/components/Loading/Spinner";
// import LoadingText from "@/components/Loading/LoadingSText/LoadingText";
import Loading from "@/components/Loading2/Loading2";
import { ButtonNoLink } from "@/components/Buttons/ButtonNoLink";
import { avalancheFuji } from "viem/chains";
const SelectModal = lazy(
  () => import("@/components/Modal/selectModal/SelectModal")
);
const InfoBankModal = lazy(
  () => import("@/components/Modal/infoBankModal/InfoBankModal")
);
const PayPage = () => {
  const router = useRouter();
  const { t } = useTranslation(["pay"]);
  const [isLoading, setIsLoading] = useState(false);
  const [textLoading, setTextLoading] = useState("false");
  const [liquidatorAdress, setLiquidatorAdress] = useState("");
  const [stateContract, setStateContract] = useState(0);
  const account = useAccount();
  const {
    writeContract,
    data: dataWrite,
    error: errorWrite,
    isSuccess: isSuccessWrite,
  } = useWriteContract();
  const [form, setForm] = useState<FormState>({
    red: "Base",
    token: "USDC",
    total: "",
    totalToken: "",
    message: "",
    method: "",
  });
  const decimals = 1000000000000000000;
  const Alerts = {
    Offer: "offer",
    Confirm: "confirm",
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [newTrxId, setNewTrxId] = useState("");
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [idTrxReq, setIdTrxReq] = useState<string | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bankName: "",
    bankNumber: "",
    bankType: "",
  });

  useEffect(() => {
    if (errorWrite) {
      console.log({ errorWrite });
      if (stateContract == 1) {
        console.log("Fallo el contrato USDC");
        setTextLoading("Debes firmar la transacción para continuar ...");
        // Colocar cancelar para revertir la transacción y liberar al liquidador
      } else if (stateContract == 2) {
        console.log("Fallo el contrato Liquidator");
        setTextLoading(
          "Debes firmar el deposito para mover tus fondos al contrato para continuar ..."
        );
        // Colocar cancelar para revertir la transacción y liberar al liquidador
      }
    }
  }, [errorWrite]);

  useEffect(() => {
    if (isSuccessWrite) {
      console.log(dataWrite);
      if (stateContract == 1) {
        console.log("Llamando contrato liquidator");
        setStateContract(2);
        setTimeout(() => {
          writeContract({
            abi: contract.abiLiquidator,
            address: contract.addressLiquidator as `0x${string}`,
            functionName: "deposit",
            gas: BigInt(200000),
            args: [
              Number(form.totalToken) * decimals,
              liquidatorAdress,
              [account.address],
            ],
          });
        }, 15000);
      } else if (stateContract == 2) {
        updateLiquidator();
      }
    }
  }, [isSuccessWrite]);

  const updateLiquidator = async () => {
    const dataToSend = {
      message: "payed",
      trxId: idTrxReq,
      trxIdNew: newTrxId,
      step: "eventLiquidator",
      role: "USER",
    };
    try {
      const messageSent = await bucksPost("chat/create-message", dataToSend);
      if (messageSent) {
        console.log({ messageSent });
      }
    } catch (ex: any) {
      console.log("Error Enviando mensaje: ", ex.message);
      return;
    }
    setTimeout(() => {
      router.push("/Room");
    }, 5000);
  };

  const isFormValid = useFormValidation(form, bankDetails, qrCode);
  const rate = useExchangeRate(form);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    },
    []
  );

  const handleBankDetailsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setBankDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    },
    []
  );

  const handleRadioChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setForm((prevForm) => ({
        ...prevForm,
        method: value,
      }));

      if (value === "qr") {
        setQrCode(null); // Reset qr code
        setQrCodeData(null);
      } else if (value === "transfer") {
        setBankDetails({
          bankName: "Bancolombia",
          bankType: "Ahorros",
          bankNumber: "",
        }); // Reset bank details
      }

      setIsModalOpen(true);
    },
    []
  );

  const handleModalClose = (data?: BankDetails) => {
    setIsModalOpen(false);
    if (form.method === "transfer" && data) {
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
    ...(form.method === "qr" ? { qr: qrCodeData } : { ...bankDetails }),
  };

  const handleContinue = async () => {
    console.log("Loading");
    setTextLoading("Creando Servidor Temporal ...");
    setIsLoading(true);
    try {
      const { code, id } = await bucksPost("room/request", paymentDetails);
      setJoinCode(code);
      setIdTrxReq(id);
      setIsEditing(false);
    } catch (error) {
      console.error("Payment failed:", error);
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    setJoinCode(null);
    setIsEditing(true);
  };

  const handlePay = async () => {
    setTextLoading("Esperando por Liquidador ...");
    setIsLoading(true);
    try {
      const result = await bucksPost("room/request-confirm", {
        id: idTrxReq,
      });
      console.log("Payment successful:", result);
      setIsEditing(false);

      var _pusher = new Pusher(String(process.env.NEXT_PUBLIC_PUSHER_API_KEY), {
        cluster: String(process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
      });
      var channel = _pusher.subscribe(`${joinCode}_liquidator`);
      channel.bind(String(idTrxReq), (data: any) => {
        console.log({ data });
        const { alert, from, trxId } = data;
        setNewTrxId(trxId);
        if (alert == Alerts.Confirm) {
          console.log(from);
          setLiquidatorAdress(from);
          setStateContract(1);
          setTextLoading(
            "Por favor acepta el permiso para transferir tokens al contrato ..."
          );
          writeContract({
            abi: contract.abiUsdc,
            address: contract.addressUsdc as `0x${string}`,
            functionName: "approve",
            args: [
              contract.addressLiquidator,
              Number(form.totalToken) * decimals,
            ],
          });
        }
      });
    } catch (error) {
      console.error("Payment failed:", error);
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
      console.log({ dollarP, valueSubs, copInput: copInput.value });
      if (usdInput && copInput) {
        value = Number((copInput.value / (dollarP - valueSubs)).toFixed(1));
      }
    }
    return value;
  };

  const convertCurrency = () => {
    const usdInput = document.getElementById("usdAmount");
    if (usdInput) {
      assignValue(getAmountToConvert(150));
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
      let _form = { ...form };
      _form.totalToken = String(value);
      console.log(_form);
      setForm(_form);
      usdInput.value = value;
    }
  };

  const inputBank = (labelName: string, name: string, value: string) => {
    return (
      <div className={styles.inputGroup}>
        <label>{t(labelName)}:</label>
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleBankDetailsChange}
          className={styles.totalInput}
          required
          disabled={!isEditing}
        />
      </div>
    );
  };

  const selectItem = (label: string, value: string, data: string[]) => {
    return (
      <div className={styles.inputGroup}>
        <label>{label}:</label>
        <select
          className={styles.select}
          name={label.toLowerCase()}
          value={value}
          onChange={handleInputChange}
          disabled={!isEditing}
        >
          {data.map((el: string) => (
            <option key={el} value={el}>
              {el}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const totalInput = (
    label: string,
    nameInput: string,
    idInput: string,
    value: string,
    currency: string,
    min: number = 0,
    onInput: any = () => {
      console.log("");
    }
  ) => {
    return (
      <div className={styles.inputGroup}>
        <label>{label}:</label>
        <div
          className={`${styles.totalInputContainer} ${
            !isEditing ? styles.disabled : ""
          }`}
        >
          <input
            type="number"
            name={nameInput}
            id={idInput}
            value={value}
            onChange={handleInputChange}
            className={styles.totalInput}
            required
            disabled={!isEditing}
            min={min}
            onInput={onInput}
          />
          <span
            className={`${styles.unit} ${!isEditing ? styles.disabled : ""}`}
          >
            {currency}
          </span>
        </div>
      </div>
    );
  };

  return (
    <PageContainer>
      {isLoading && <Loading text={textLoading} />}
      <div className={styles.formContainer}>
        {joinCode && (
          <div className={styles.confirmationCode}>
            <div>
              <label className={styles.code}>
                {" "}
                {t("code")}: {joinCode}
              </label>
            </div>
          </div>
        )}
        {selectItem("Red", form.red, networks)}
        {selectItem("Token", form.token, tokens)}
        {totalInput(
          "Total",
          "total",
          "copAmount",
          form.total,
          "COP",
          20000,
          () => convertCurrency()
        )}
        <div className={styles.trx_form_content}>
          {["Poco probable", "Tárifa estándar", "Recomendado"].map(
            (el: string, index: number) => (
              <div
                key={index}
                className={styles.button_option_container}
                onClick={() => assignValue(dollarRange[index])}
              >
                <span>{el}</span>
                <div className={styles.button_option}>{dollarRange[index]}</div>
              </div>
            )
          )}
        </div>

        <div>
          {totalInput(
            "Total Token",
            "totalToken",
            "usdAmount",
            form.totalToken,
            form.token
          )}

          {rate !== null && (
            <div className={styles.rateInfoContainer}>
              <span className={styles.rateLabel}>Rate:</span>
              <span className={styles.rateValue}>{rate.toFixed(2)} COP</span>
            </div>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label>{t("method")}:</label>
          <div className={styles.radioGroup}>
            {[
              { value: "qr", t: "qr_code" },
              { value: "transfer", t: "account" },
            ].map((el: { value: string; t: string }, index: number) => (
              <label key={index}>
                <input
                  type="radio"
                  className={styles.radio}
                  name="method"
                  value={el.value}
                  checked={form.method === el.value}
                  onChange={handleRadioChange}
                  disabled={!isEditing}
                />{" "}
                {t(el.t)}
              </label>
            ))}
          </div>
        </div>
        {form.method === "qr" && (
          <div className={styles.details}>
            <div className={styles.inputGroup}>
              <label>{t("qr_code")}:</label>
              {qrCode ? (
                <Image
                  src={qrCode}
                  alt="qr Code"
                  width={200}
                  height={200}
                  className={styles.qrImage}
                />
              ) : (
                <span>{t("qr_select")}</span>
              )}
            </div>
          </div>
        )}
        {form.method === "transfer" && (
          <div className={styles.details}>
            {inputBank("bank", "bankName", bankDetails.bankName)}
            {inputBank("type", "bankType", bankDetails.bankType)}
            {inputBank("account", "bankNumber", bankDetails.bankNumber)}
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
            disabled={!isEditing}
          ></textarea>
        </div>
        {isEditing ? (
          <button
            className={styles.payButton}
            disabled={!isFormValid}
            aria-disabled={!isFormValid}
            onClick={handleContinue}
          >
            {t("continue")}
          </button>
        ) : (
          <>
            <div className={styles.containerButtons}>
              <ButtonAction
                onClick={handleCancel}
                title={t("cancel")}
                color="#313131"
              />
              <ButtonNoLink
                title={t("pay")}
                color="#1F046B"
                onClick={handlePay}
              />
            </div>
          </>
        )}
        {isModalOpen && form.method === "qr" && (
          <SelectModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onImageSelect={handleImageSelect}
            onQrCodeDetected={handleQrCodeDetected}
          />
        )}
        {isModalOpen && form.method === "transfer" && (
          <InfoBankModal isOpen={isModalOpen} onClose={handleModalClose} />
        )}
      </div>
    </PageContainer>
  );
};

export default PayPage;
