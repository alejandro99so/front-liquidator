'use client'

import { useEffect, useState } from "react";
import { useAccount, useConnections, useSignMessage } from 'wagmi'
import { disconnect } from '@wagmi/core'
import { config } from '../../config'
import * as jose from 'jose'


export default function Home() {
  const [nowSign, setNowSign] = useState(0)
  const { data: signMessageData, error: errorSigningMessage, signMessage } = useSignMessage()
  const connections = useConnections()
  const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_PRIVATE_KEY)

  const validateSession = async () => {
    const jwt = sessionStorage.getItem("jwt")
    const now = Math.floor(Date.now()/1000)
    if (jwt) {

      try { 
        const { payload } = await jose.jwtVerify(jwt, secret)
        if (payload.address == connections[0].accounts[0] && Number(payload.exp) < now) {
          return
        }
      } catch (ex: any) {
        if (ex.code == 'ERR_JWT_EXPIRED') 
          console.log({message: 'JWT_EXPIRED'})
        else console.log({message: 'ERROR_GETTING_PAYLOAD'})
      }
    }
    setNowSign(now);
    const message = {
      Message: "Connect to Liquidator",
      URI: "www.liquidator.com",
      iat: now,
      exp: now + 3600
    }
    signMessage({ message: JSON.stringify(message) })
  }

  useEffect(()=> {
    if (connections.length && connections[0].accounts.length) {
      console.log(connections[0].accounts[0])
      validateSession()
    }
  }, [connections])

  const validateUse = async () => {
    const data = {
      address: connections[0].accounts[0],
      signature: signMessageData,
      now: nowSign
    }
    console.log(data)
    const request = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (request) {
      console.log({request: await request.json()})
    }
  }

  useEffect(() => {
    if (signMessageData && jose) {
      createToken()
      // validateUse()
    }
  }, [signMessageData, jose])

  const createToken = async () => {
    const alg = 'HS256'
    const token = await new jose.SignJWT({  
      address: connections[0].accounts[0],
      signature: signMessageData,
     })
      .setProtectedHeader({ alg })
      .setIssuedAt(nowSign)
      .setExpirationTime(nowSign + 3600)
      .sign(secret)
    console.log(token)
    sessionStorage.setItem("jwt", token);
  }

  useEffect(() => {
    if (errorSigningMessage) {
      if (errorSigningMessage.name == "UserRejectedRequestError") {
        console.log("IS_NOT_POSIBLE_CONTINUE_WITHOUT_SIGN")
      }
      disconnect(config)
      console.log({errorSigningMessage})
    }
  }, [errorSigningMessage])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <w3m-button />
        </div>
      </div>
    </main>
  );
}
