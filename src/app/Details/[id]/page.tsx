"use client";
import PageContainer from "@/components/PageContainer/PageContainer";
import styles from "./details.module.css";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/Buttons/ButtonLink";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";
import UpdateTotalToken from "@/components/Modal/updateTotalToken/UpdateTotalToken";
import { BankDetails, Details, FormState } from "@/app/types";
import { headers } from "next/headers";
import { usePathname, useSearchParams } from "next/navigation";
import { networks } from "@/utils/networks";
import { formatWalletAddress } from "@/utils/formatWalletAddress";
import { bucksGet, bucksPatch, bucksPost } from "../../../utils/fetchWithToken";
import { ButtonNoLink } from "@/components/Buttons/ButtonNoLink";
import Pusher from "pusher-js";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading2/Loading2";

const Page = () => {
  const { t } = useTranslation(["pay"]);
  const Alerts = {
    Payed: "payed",
    Rejected: "rejected",
  };
  const router = useRouter();

  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const id = pathParts[pathParts.length - 1];
  const [isLoading, setIsLoading] = useState(false);
  const [textLoading, setTextLoading] = useState("false");
  const [data, setData] = useState<Details>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalToken, setTotalToken] = useState<number>(0);
  const [qrCode, setQrCode] = useState<string | null>(null);
  // const [bankDetails, setBankDetails] = useState<BankDetails>({
  //     bank: '',
  //     typeAccount: '',
  //     nAccount: ''
  // });

  const generateQRCode = useCallback((text: string) => {
    QRCode.toDataURL(text, (err, url) => {
      if (err) {
        console.error(err);
        return;
      }
      setQrCode(url);
    });
  }, []);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      const jwt = sessionStorage.getItem("jwt");

      if (!jwt || !id) {
        console.error("Token or Id is missing");
        return;
      }
      try {
        const _data: Details | null = await bucksGet(`room/request/${id}`);
        if (_data !== null) {
          setData(_data);
          if (_data.typeAccount === "qr") {
            generateQRCode(_data.qr);
          } else {
            // setBankDetails(_data.bankDetails);
          }

          const cop = parseFloat(_data?.cop!);
          const usd = parseFloat(_data?.usd!);
          const total = cop / usd;
          setTotalToken(total);
        } else {
          console.log({ data: _data });
        }
      } catch (error) {
        console.error("Failed to fetch room details:", error);
      }
    };
    fetchRoomDetails();
  }, [id]);

  const handleTotalTokenClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = (updatedRate?: number) => {
    setIsModalOpen(false);
    if (typeof updatedRate === "number") {
      setTotalToken(updatedRate);
    }
  };

  const handlePay = async () => {
    setTextLoading("Esperando el pago por parte del usuario");
    setIsLoading(true);
    let _confirm;
    try {
      _confirm = await bucksPost("room/confirm", {
        requestRoom: data?._id,
      });
      if (_confirm) {
        console.log({ confirm });
      }
    } catch (ex: any) {
      console.log("Error confirmando: ", ex.message);
      return;
    }
    const dataToSend = {
      message: "confirm",
      trxId: data?._id,
      trxIdNew: _confirm.id,
      step: "eventLiquidator",
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
    var _pusher = new Pusher(String(process.env.NEXT_PUBLIC_PUSHER_API_KEY), {
      cluster: String(process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
    });
    var channel = _pusher.subscribe(`${data?.code}_liquidator`);
    channel.bind(String(data?._id), (data: any) => {
      console.log({ data });
      const { alert } = data;
      if (alert == Alerts.Payed) {
        redirectChat();
      }
    });
  };

  const redirectChat = async () => {
    const trx = await bucksPatch("room/confirm");
    if (trx && trx._id) {
      setTimeout(() => {
        router.push("/Room");
      }, 5000);
    }
  };

  console.log({ data });
  return (
    <PageContainer>
      {isLoading && <Loading text={textLoading} />}
      <div className={styles.formContainer}>
        <div className={styles.inputGroup}>
          <div className={styles.user}>
            <Image
              src={"/icons/user.svg"}
              alt="user.svg"
              width={30}
              height={30}
            />
            <span className={styles.address}>
              {formatWalletAddress(data?.userAddress!)}
            </span>
            {/* <Image src={"/icons/message.svg"} alt='' width={20} height={20} /> */}
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label>Red:</label>
          <div className={styles.totalInputContainer}>
            <span className={styles.totalInput}>
              {networks[data?.network!]}
            </span>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label>Token:</label>
          <div className={`${styles.totalInputContainer}`}>
            <span className={`${styles.totalInput} ${styles.upper}`}>
              {data?.cryptoCurrency}
            </span>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label>Total:</label>
          <div className={`${styles.totalInputContainer}`}>
            <span className={styles.totalInput}>{data?.cop}</span>
            <span className={styles.unit}>COP</span>
          </div>
        </div>
        <div>
          <div className={styles.inputGroup}>
            <label>Total Token:</label>
            <div className={`${styles.totalInputToken}`}>
              <input
                type="number"
                name="totalToken"
                value={totalToken}
                onClick={handleTotalTokenClick}
                readOnly
                className={styles.totalInput}
              />
              <span className={`${styles.unit} ${styles.upper}`}>
                {data?.cryptoCurrency}
              </span>
            </div>
          </div>
          <div className={styles.rateInfoContainer}>
            <span className={styles.rateLabel}>Rate:</span>
            <span className={styles.rateValue}>{data?.usd}.00 USD</span>
          </div>
        </div>

        {data?.typeAccount === "qr" && qrCode && (
          <div className={styles.details}>
            <div className={styles.inputGroup}>
              <label>{t("method")}:</label>
              {qrCode ? (
                <Image
                  src={qrCode}
                  alt="QR Code"
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
        {data?.typeAccount === "transfer" && (
          <div className={styles.details}>
            <div className={styles.inputGroup}>
              <label>{t("bank")}:</label>
              <div className={`${styles.totalInputContainer}`}>
                <span className={styles.totalInput}>{data?.bankName}</span>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>{t("type")}:</label>
              <div className={`${styles.totalInputContainer}`}>
                <span className={styles.totalInput}>{data?.bankType}</span>
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>{t("account")}:</label>
              <div className={`${styles.totalInputContainer}`}>
                <span className={styles.totalInput}>{data?.bankNumber}</span>
              </div>
            </div>
          </div>
        )}
        <div className={styles.inputGroup}>
          <label>{t("note")}:</label>
          <textarea
            rows={5}
            name="note"
            value={data?.message}
            className={styles.textarea}
            disabled={true}
          ></textarea>
        </div>
        <div className={styles.containerButtons}>
          <ButtonNoLink title={t("pay")} color="#1F046B" onClick={handlePay} />
        </div>
        {isModalOpen && (
          <UpdateTotalToken
            isOpen={isModalOpen}
            initialTotalToken={totalToken}
            onClose={handleModalClose}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default Page;
