"use client";
import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import styles from "../../../styles/room.module.css";

const Hola: React.FC = () => {
  const [user, setUser] = useState("");
  const [sortedMessages, setSortedMessages] = useState([] as any[]);

  useEffect(() => {
    const _user = String(sessionStorage.getItem("address"));
    setUser(_user);
  }, []);

  const createMessages = (data: any) => {
    let messages = [];
    let side1;
    let side2;
    console.log(data);
    if (data.user == user) {
      side1 = "l";
      side2 = "r";
    } else if (data.payer == user) {
      side1 = "r";
      side2 = "l";
    }
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
    setSortedMessages(_sortedMessages);
  };

  var _pusher = new Pusher(String(process.env.NEXT_PUBLIC_PUSHER_API_KEY), {
    cluster: String(process.env.NEXT_PUBLIC_PUSHER_CLUSTER),
  });
  var channel = _pusher.subscribe("room-2");
  channel.bind("667ee66af1e4327d16a3d1f0", (data: any) => {
    console.log(data);
    createMessages(data.chat);
  });

  console.log("here");

  const sendMessage = async (e: any) => {
    e.preventDefault();
    const message = e.target[0].value;
    console.log({ message });
    try {
      const request = await fetch("http://localhost:3000/chat/create-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization:
            "bearer eyJhbGciOiJIUzI1NiJ9.eyJhZGRyZXNzIjoiMHgwRjRhMjZDOTViZjQ1M2ZkMjEzMGViNTY2QkMxMzQ5QzVEODFlNDZjIiwic2lnbmF0dXJlIjoiMHg4ZmRhNjBhYzRhYTkwOTk5MjlhNzBhMmIwYTU2MWE4YWYyMjBiOWI1NjRmMDRmZjNmMTI0OTM3NWYxZDZlZWNmMjY2NDFmYmFlNmFmMDFiY2QwNGE1OTNiOGFhMWNhODE4NWI1MGQyYjdiZTRjMTkxNmRiYjg2MDg4ZjA5YjhkZTFjIiwiaWF0IjoxNzE5NzE5NzYxLCJleHAiOjE3MTk3MjMzNjF9.S0W52Gsp-6QyXRK4yo8uCp5i7nCW3YIynNGST6W5bqs",
        },
        body: JSON.stringify({
          message,
          trxId: "667ee66af1e4327d16a3d1f0",
          to:
            user != "0x0F4a26C95bf453fd2130eb566BC1349C5D81e46c"
              ? "0x0F4a26C95bf453fd2130eb566BC1349C5D81e46c"
              : "0x820FAec66A504901De79fa44D21609d457174f5B",
          from: user,
        }),
      });
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
    <div className="container">
      <h1>Hola</h1>
      <div>
        {sortedMessages.map((item, index) => (
          <div
            key={index}
            className={item.side == "r" ? styles.text_right : styles.text_left}
          >
            {item.message} - {formatTime(item.time)}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <label>Digita tu mensaje</label>
        <input type="text" name="message" />
        <button type="submit">Enviar Mensaje</button>
      </form>
    </div>
  );
};

export default Hola;
