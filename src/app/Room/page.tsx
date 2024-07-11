"use client";
import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import styles from "./room.module.css";
import PageContainer from "@/components/PageContainer/PageContainer";
import Image from "next/image";
import { bucksGet, bucksPost } from "@/utils/fetchWithToken";

const Hola: React.FC = () => {
  const [user, setUser] = useState("");
  const [token, setToken] = useState("");
  const [sortedMessages, setSortedMessages] = useState([] as any[]);
  const [payerAddress, setPayerAddress] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [trxId, setTrxId] = useState("");

  const getMessages = async (_token: string, trxId: string, _user?: string) => {
    const request = await bucksGet("chat/messages");
    if (request) {
      createMessages(request.chat, _user);
    }
  };

  useEffect(() => {
    const _user = String(sessionStorage.getItem("address"));
    const _token = String(sessionStorage.getItem("jwt"));
    setUser(_user);
    setToken(_token);
    getMessages(_token, "6681c3c7cdc3e9e47e1c18bf", _user);
  }, []);

  const createMessages = (data: any, _user: string | null = null) => {
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
    setPayerAddress(data.payer);
    setUserAddress(data.user);
    setTrxId(data.trxId);
    setSortedMessages(_sortedMessages);
    var channel = _pusher.subscribe(`${data?.code}_liquidator`);
    channel.bind(data.trxId, (data: any) => {
      console.log({ data });
      createMessages(data.chat);
    });
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
