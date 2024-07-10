"use client";
import PageContainer from "@/components/PageContainer/PageContainer";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useWriteContract, useReadContract } from "wagmi";
import contract from "../../../constants.json";
import styles from "./page.module.css";
import ListTrx from "./list";

const typePayment = ["qr", "transfer"];
const typeBlockchain = [
  "Base",
  "Avalanche",
  "Ethereum",
  "Arbitrum",
  "Polygon",
  "Optimism",
];
const typeCrypto = ["usdc", "usdt", "dai"];

const Trx: React.FC = () => {
  const [dollarP, setDollarP] = useState(0);
  const [dollarRange, setDollarRange] = useState([0, 0, 0]);
  const account = useAccount();
  const {
    writeContract,
    data: dataWrite,
    error: errorWrite,
  } = useWriteContract();
  const [amountTransfer, setAmountTransfer] = useState(0);
  const [typeWrite, setTypeWrite] = useState(0);
  //   useEffect(() => {
  //     console.log(account);
  //   }, [account]);

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

  useEffect(() => {
    if (dataWrite && amountTransfer && typeWrite) {
      console.log({ dataWrite, amountTransfer, typeWrite });
      if (typeWrite == 1) {
        console.log("here");
        depositFunds();
        setTypeWrite(0);
      }
      //  else if (typeWrite == 2) {
      //   setTypeWrite(0);
      // }
    }
  }, [dataWrite, amountTransfer, typeWrite]);

  useEffect(() => {
    if (errorWrite && typeWrite) {
      console.log({ errorWrite });
      if (typeWrite == 1) {
        setTypeWrite(0);
      }
      // else if (typeWrite == 2) {
      //   setTypeWrite(1);
      //   depositFunds();
      // }
    }
  }, [errorWrite, typeWrite]);

  // const result = useReadContract({
  //   abi: contract.abiUsdc,
  //   address: contract.addressUsdc as `0x${string}`,
  //   functionName: "allowance",
  //   args: [account.address, contract.addressLiquidator],
  // });

  // useEffect(() => {
  //   if (result) {
  //     console.log({ result: result.data });
  //   }
  // }, [result]);

  const initTrx = async (e: any) => {
    e.preventDefault();
    const [
      network,
      contract,
      cop,
      usd,
      message,
      typePayment,
      bank,
      typeAccount,
      numberAccount,
    ] = e.target;
    console.log({
      network: network.value,
      contract: contract.value,
      cop: cop.value,
      usd: usd.value,
      message: message.value,
      typePayment: typePayment.value,
      bank: bank.value,
      typeAccount: typeAccount.value,
      numberAccount: numberAccount.value,
    });
    const valueTransfer = Number(usd.value);
    setAmountTransfer(valueTransfer);
    setTypeWrite(1);
    console.log(valueTransfer);

    // writeContract({
    //   abi: contract.abiUsdc,
    //   address: contract.addressUsdc as `0x${string}`,
    //   functionName: "approve",
    //   args: [contract.addressLiquidator, valueTransfer],
    // });

    // console.log({ valueTransfer, account: account.address });
    // writeContract({
    //   abi: contract.abiLiquidator,
    //   address: contract.addressLiquidator as `0x${string}`,
    //   functionName: "deposit",
    //   args: [
    //     valueTransfer,
    //     "0x777c79841a5926FB631d4D581f6A2c5AF5fe7792",
    //     [account.address],
    //   ],
    // });
  };

  const requestRoom = async (
    network: string,
    contract: string,
    cop: number,
    usd: number,
    type: string,
    message: string
  ) => {
    let body = {
      network,
      contract,
      cop,
      usd,
      type,
      message,
      qr: "1234",
    };
    const request = await fetch("http://localhost:3000/room/request", {
      method: "POST",
      headers: { "Content-Type": "application/json", authorization: `bearer` },
      body: JSON.stringify(body),
    });
  };

  const depositFunds = async () => {
    console.log({ amountTransfer, account: account.address });
    writeContract({
      abi: contract.abiLiquidator,
      address: contract.addressLiquidator as `0x${string}`,
      functionName: "deposit",
      args: [
        amountTransfer,
        "0x777c79841a5926FB631d4D581f6A2c5AF5fe7792",
        [account.address],
      ],
    });
  };

  const confirmDeposit = () => {
    // writeContract({
    //   abi: contract.abiLiquidator,
    //   address: contract.addressLiquidator as `0x${string}`,
    //   functionName: "confirm",
    // });
  };

  const convertCurrency = () => {
    const usdInput = document.getElementById("usdAmount");
    if (usdInput) {
      usdInput.value = getAmountToConvert(100);
      setDollarRange([
        getAmountToConvert(50),
        getAmountToConvert(100),
        getAmountToConvert(150),
      ]);
    }
  };

  const getAmountToConvert = (valueSubs: number) => {
    let value = 0;
    if (dollarP) {
      const copInput = document.getElementById("copAmount");
      const usdInput = document.getElementById("usdAmount");
      if (usdInput && copInput) {
        value = Number((copInput.value / (dollarP - valueSubs)).toFixed(1));
      }
    }
    return value;
  };

  const assignValue = (value: number) => {
    const usdInput = document.getElementById("usdAmount");
    if (usdInput) {
      usdInput.value = value;
    }
  };

  return (
    <PageContainer>
      <div>
        {account.address ? (
          <div>
            <h1>Hola</h1>
            <form onSubmit={initTrx} className={styles.trx_form}>
              <div className={styles.trx_form_content}>
                <label>Network: </label>
                <ListTrx name="typeBlockchain" elements={typeBlockchain} />
              </div>
              <div className={styles.trx_form_content}>
                <label>Contract: </label>
                <ListTrx name="typeCrypto" elements={typeCrypto} />
              </div>
              <div className={styles.trx_form_content}>
                <label>COP: </label>
                <input
                  id="copAmount"
                  type="number"
                  name="cop"
                  min="20000"
                  onInput={() => convertCurrency()}
                />
              </div>
              <div className={styles.trx_form_content}>
                <div
                  className={styles.button_option_container}
                  onClick={() => assignValue(dollarRange[0])}
                >
                  <span>Poco probable</span>
                  <div className={styles.button_option}>{dollarRange[0]}</div>
                </div>
                <div
                  className={styles.button_option_container}
                  onClick={() => assignValue(dollarRange[1])}
                >
                  <span>Tárifa estándar</span>
                  <div className={styles.button_option}>{dollarRange[1]}</div>
                </div>
                <div
                  className={styles.button_option_container}
                  onClick={() => assignValue(dollarRange[2])}
                >
                  <span>Recomendado</span>
                  <div className={styles.button_option}>{dollarRange[2]}</div>
                </div>
              </div>
              <div className={styles.trx_form_content}>
                <label>USD: </label>
                <input id="usdAmount" type="text" name="usd" />
              </div>
              <div className={styles.trx_form_content}>
                <label>Message: </label>
                <input type="text" name="message" />
              </div>
              <div className={styles.trx_form_content}>
                <label>type: </label>
                <ListTrx name="type" elements={typePayment} />
              </div>
              <div className={styles.trx_form_content}>
                <label>Banco: </label>
                <ListTrx name="typeBank" elements={["Bancolombia"]} />
              </div>
              <div className={styles.trx_form_content}>
                <label>Tipo de cuenta: </label>
                <ListTrx
                  name="typeAccount"
                  elements={["Ahorros", "Corriente"]}
                />
              </div>
              <div className={styles.trx_form_content}>
                <label>Número de cuenta: </label>
                <input type="text" name="numberAccount" />
              </div>

              <button disabled={!!typeWrite} type="submit">
                Iniciar
              </button>
            </form>
            <button onClick={() => confirmDeposit()}>Confirmar deposito</button>
          </div>
        ) : (
          <div>Conecta tu wallet para continuar</div>
        )}
      </div>
    </PageContainer>
  );
};

export default Trx;
