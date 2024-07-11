"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnections, useSignMessage } from "wagmi";
import { disconnect } from "@wagmi/core";
import { config } from "../../../config";
import * as jose from "jose";
import styles from "./Dashboard.module.css";
import PageContainer from "@/components/PageContainer/PageContainer";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import enDataRandom from "../../../public/locales/en/data-random.json";
import esDataRandom from "../../../public/locales/es/data-random.json";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { bucksPost } from "@/utils/fetchWithToken";

const DashboardPage = () => {
  const [nowSign, setNowSign] = useState(0);
  const {
    data: signMessageData,
    error: errorSigningMessage,
    signMessage,
  } = useSignMessage();
  const connections = useConnections();
  const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_PRIVATE_KEY);
  const account = useAccount();
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const { t } = useTranslation(["home", "data-random"]);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const jwt = sessionStorage.getItem("jwt");
      const IsSignData = sessionStorage.getItem("IsSignData");
      if (IsSignData === "true") {
        setConnected(true);
      } else {
        setConnected(false);
        if (!jwt) {
          router.push("/Dashboard");
        } else {
          try {
            const { payload } = await jose.jwtVerify(jwt, secret);
            if (payload.exp! < Math.floor(Date.now() / 1000)) {
              sessionStorage.removeItem("jwt");
              router.push("/Dashboard");
            }
          } catch (ex) {
            sessionStorage.removeItem("jwt");
            router.push("/Dashboard");
          }
        }
      }
    };
    checkSession();
  }, [router]);

  useEffect(() => {
    const dataRandom = i18n.language === "es" ? esDataRandom : enDataRandom;
    const index = Math.floor(Math.random() * dataRandom.length);
    setCurrentPhrase(dataRandom[index]);
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    if (currentIndex !== null) {
      const dataRandom = i18n.language === "es" ? esDataRandom : enDataRandom;
      setCurrentPhrase(dataRandom[currentIndex]);
    }
  }, [i18n.language]);

  const validateSession = async () => {
    const jwt = sessionStorage.getItem("jwt");
    const now = Math.floor(Date.now() / 1000);
    if (jwt) {
      try {
        const { payload } = await jose.jwtVerify(jwt, secret);
        sessionStorage.setItem("address", String(payload.address));
        if (
          payload.address == connections[0].accounts[0] &&
          Number(payload.exp) > now
        ) {
          return;
        }
      } catch (ex: any) {
        if (ex.code == "ERR_JWT_EXPIRED")
          console.log({ message: "JWT_EXPIRED" });
        else console.log({ message: "ERROR_GETTING_PAYLOAD" });
      }
    }
    setNowSign(now);
    const message = {
      Message: "Connect to Liquidator",
      URI: "www.liquidator.com",
      iat: now,
      exp: now + 3600,
    };
    signMessage({ message: JSON.stringify(message) });
  };

  useEffect(() => {
    if (connections.length && connections[0].accounts.length) {
      console.log(connections[0].accounts[0]);
      validateSession();
      console.log("Connect?: ", connections[0].connector.onConnect);
    }
  }, [connections]);

  const validateUse = async () => {
    const data = {
      address: connections[0].accounts[0],
      signature: signMessageData,
      now: nowSign,
    };
    console.log(data);

    const request = await bucksPost("login", data, false);
    if (request) {
      console.log({ request: await request.json() });
    }
  };

  useEffect(() => {
    console.log({ account });
    if (account.address && signMessageData) {
      console.log({ signMessageData, account: account.address });
      sessionStorage.setItem("IsSignData", "true");
      setConnected(true);
    }
  }, [account, signMessageData]);

  useEffect(() => {
    if (signMessageData && jose) {
      createToken();
      // validateUse()
    }
  }, [signMessageData, jose]);

  const createToken = async () => {
    const alg = "HS256";
    const token = await new jose.SignJWT({
      address: connections[0].accounts[0],
      signature: signMessageData,
    })
      .setProtectedHeader({ alg })
      .setIssuedAt(nowSign)
      .setExpirationTime(nowSign + 3600)
      .sign(secret);
    console.log(token);
    sessionStorage.setItem("jwt", token);
  };

  useEffect(() => {
    if (errorSigningMessage) {
      if (errorSigningMessage.name == "UserRejectedRequestError") {
        console.log("IS_NOT_POSIBLE_CONTINUE_WITHOUT_SIGN");
      }
      disconnect(config);
      sessionStorage.setItem("IsSignData", "false");
      console.log({ errorSigningMessage });
    }
  }, [errorSigningMessage]);

  return (
    <PageContainer>
      <p className={styles.currentPhrase}>{currentPhrase}</p>
      {connected == true ? (
        <div className={styles.containerButtons}>
          <Link
            className={`${styles.button} ${styles.buttonUser}`}
            href="/User"
          >
            {t("buttonUser")}
          </Link>
          <Link
            className={`${styles.button} ${styles.buttonLiquidator}`}
            href="/Liquidator"
          >
            {t("buttonLiquidator")}
          </Link>
        </div>
      ) : (
        <div>
          <w3m-button />
        </div>
      )}
    </PageContainer>
  );
};

export default DashboardPage;
