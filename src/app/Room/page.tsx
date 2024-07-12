"use client";
import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import styles from "./room.module.css";
import PageContainer from "@/components/PageContainer/PageContainer";
import Image from "next/image";
import { bucksGet, bucksPatch, bucksPost } from "@/utils/fetchWithToken";
import { useRouter } from "next/navigation";
import { useWriteContract } from "wagmi";
import contract from "../../../constants.json";

const Hola: React.FC = () => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [sortedMessages, setSortedMessages] = useState([] as any[]);
  const [payerAddress, setPayerAddress] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [trxId, setTrxId] = useState("");
  const [trxCode, setTrxCode] = useState("");
  const [paymentDone, setPaymentDone] = useState(false);
  const Alerts = {
    Confirmed: "confirmed",
    Payed: "payed",
  };
  const {
    writeContract,
    data: dataWrite,
    error: errorWrite,
    isSuccess: isSuccessWrite,
  } = useWriteContract();
  const getMessages = async (_token: string, trxId: string, _user?: string) => {
    const request = await bucksGet("chat/messages");
    if (request) {
      await createMessages(request.chat, _user);
    }
  };

  useEffect(() => {
    if (dataWrite) {
      console.log({ dataWrite });
      updateChat();
    }
  }, [dataWrite]);

  const updateChat = async () => {
    const dataToSend = {
      message: "payed",
      trxId,
      trxIdNew: trxId,
      step: "eventLiquidator",
      role: "USER",
    };
    const messageSent = await bucksPost("chat/create-message", dataToSend);
    if (messageSent) {
      console.log({ messageSent });
    }
    await bucksPatch("chat");
    router.push("/");
  };

  useEffect(() => {
    console.log({ user, userAddress, trxCode, trxId });
    if (user != "" && userAddress != "" && trxCode != "" && trxId != "") {
      console.log("aca adentro: ", trxCode, trxId);
      var channel = _pusher.subscribe(`${trxCode}_liquidator`);
      channel.bind(trxId, (data: any) => {
        updateState(data);
      });
    }
  }, [user, userAddress, trxCode, trxId]);

  useEffect(() => {
    const _user = String(sessionStorage.getItem("address"));
    const _token = String(sessionStorage.getItem("jwt"));
    setUser(_user.toLowerCase());
    setToken(_token);
    getMessages(_token, "6681c3c7cdc3e9e47e1c18bf", _user);
  }, []);

  const router = useRouter();
  const createMessages = async (data: any, _user: string | null = null) => {
    let messages = [];
    let side1;
    let side2;
    console.log({ data });
    const localUser = (_user ?? user).toLowerCase();
    console.log({ localUser, data });
    if (data.user == localUser) {
      side1 = "l";
      side2 = "r";
    } else if (data.payer == localUser) {
      side1 = "r";
      side2 = "l";
    }
    console.log({ data });

    for (let i = 0; i < data.messagePayer.length; i++) {
      messages.push({
        side: side1,
        message: data.messagePayer[i],
        time: data.messagePayerTime[i],
      });
    }
    for (let i = 0; i < data.messageUser.length; i++) {
      messages.push({
        side: side2,
        message: data.messageUser[i],
        time: data.messageUserTime[i],
      });
    }
    const _sortedMessages = messages.sort((a, b) => a.time - b.time);
    console.log(_sortedMessages);
    console.log("at the beginning", data.user);
    setPayerAddress(data.payer.toLowerCase());
    setUserAddress(data.user.toLowerCase());
    setTrxId(data.trxId);
    let _trx;
    try {
      console.log("TRXID: ", data.trxId);
      _trx = await bucksGet(`room/${data.trxId}`);
    } catch (ex: any) {
      console.log(ex.message);
    }
    console.log({ _trx });
    if (_trx.status == "PAYED") {
      setPaymentDone(true);
    } else if (_trx.status == "FINISHED") {
      router.push("/");
    }
    setSortedMessages(_sortedMessages);
    setTrxCode(data.code);
  };

  const updateState = (data: any) => {
    console.log({ data, user, userAddress });
    if (data.alert) {
      if (data.alert == Alerts.Confirmed && user == userAddress) {
        setPaymentDone(true);
      } else if (data.alert == Alerts.Payed && user != userAddress) {
        console.log("acá");
        router.push("/");
        // Transacción terminada
      }
    } else if (data.chat) {
      console.log({ data });
      createMessages(data.chat);
    }
  };

  var _pusher = new Pusher(String(process.env.NEXT_PUBLIC_PUSHER_API_KEY), {
    cluster: String(process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
  });

  console.log("here");

  const sendMessage = async (e: any) => {
    e.preventDefault();
    const message = e.target[0].value;
    console.log({ message });
    try {
      const dataToSend = {
        message,
        trxId,
        to: user != userAddress ? userAddress : payerAddress,
        from: user,
      };
      const request = await bucksPost("chat/create-message", dataToSend);
      if (request) {
        console.log({ request: await request.json() });
      }

      // const messageSent = await axios.post(
      //   "http://localhost:3000/chat/create-message",
      //   {
      //     message,
      //     trxId: "667ee66af1e4327d16a3d1f0",
      //     to:
      //       user != "0x0F4a26C95bf453fd2130eb566BC1349C5D81e46c"
      //         ? "0x0F4a26C95bf453fd2130eb566BC1349C5D81e46c"
      //         : "0x820FAec66A504901De79fa44D21609d457174f5B",
      //     from: user,
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization:
      //         "bearer eyJhbGciOiJIUzI1NiJ9.eyJhZGRyZXNzIjoiMHgwRjRhMjZDOTViZjQ1M2ZkMjEzMGViNTY2QkMxMzQ5QzVEODFlNDZjIiwic2lnbmF0dXJlIjoiMHg4ZmRhNjBhYzRhYTkwOTk5MjlhNzBhMmIwYTU2MWE4YWYyMjBiOWI1NjRmMDRmZjNmMTI0OTM3NWYxZDZlZWNmMjY2NDFmYmFlNmFmMDFiY2QwNGE1OTNiOGFhMWNhODE4NWI1MGQyYjdiZTRjMTkxNmRiYjg2MDg4ZjA5YjhkZTFjIiwiaWF0IjoxNzE5NzE5NzYxLCJleHAiOjE3MTk3MjMzNjF9.S0W52Gsp-6QyXRK4yo8uCp5i7nCW3YIynNGST6W5bqs",
      //     },
      //   }
      // );
      // console.log({ messageSent });
      e.target[0].value = "";
    } catch (ex) {
      console.log(ex);
    }
  };

  const formatTime = (unixtime: number) => {
    const date = new Date(unixtime * 1000);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const paymentDoneClick = async (status: "PAYED" | "FINISHED") => {
    setPaymentDone(true);
    await bucksPatch(`room/confirm?status=${status}`);
    const dataToSend = {
      message: status == "PAYED" ? "confirmed" : "payed",
      trxId,
      trxIdNew: trxId,
      step: "eventLiquidator",
      role: "USER",
    };
    try {
      console.log({ dataToSend });

      if (status == "FINISHED") {
        console.log("Here finishing");
        writeContract({
          abi: contract.abiLiquidator,
          address: contract.addressLiquidator as `0x${string}`,
          functionName: "confirm",
          gas: BigInt(200000),
        });
      } else {
        const messageSent = await bucksPost("chat/create-message", dataToSend);
        if (messageSent) {
          console.log({ messageSent });
        }
      }
    } catch (ex: any) {
      console.log("Error Enviando mensaje: ", ex.message);
      return;
    }
  };

  return (
    <PageContainer>
      <div className={styles.container}>
        <div className={styles.headers}>
          <button type="button" className={styles.sendButton}>
            <Image src={"/back.svg"} alt="" width={30} height={30} />
          </button>
          <span>Chat</span>
        </div>
        <div className={styles.chatWindow}>
          {sortedMessages.map((item, index) => (
            <div
              className={
                item.side == "r" ? styles.content_right : styles.content_left
              }
              key={index}
            >
              <Image src={"/user.svg"} alt="" width={30} height={30} />
              <div
                className={
                  item.side == "r" ? styles.text_right : styles.text_left
                }
              >
                <span className={styles.message}>{item.message}</span>
                <span className={styles.time}>{formatTime(item.time)}</span>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className={styles.messageForm}>
          {user == userAddress
            ? paymentDone && (
                <button
                  type="button"
                  onClick={() => paymentDoneClick("FINISHED")}
                >
                  Pago realizado
                </button>
              )
            : !paymentDone && (
                <button type="button" onClick={() => paymentDoneClick("PAYED")}>
                  Confirmar pago
                </button>
              )}
          <input
            type="text"
            name="message"
            className={styles.messageInput}
            placeholder="Type your message..."
          />
          <button type="submit" className={styles.sendButton}>
            <Image src={"/send.svg"} alt="" width={30} height={30} />
          </button>
        </form>
      </div>
    </PageContainer>
  );
};

export default Hola;
