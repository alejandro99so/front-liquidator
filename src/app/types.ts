export type FormState = {
  red: string;
  token: string;
  total: string;
  totalToken: string;
  message: string;
  method: string;
};

export type BankDetails = {
  bankName: string;
  bankType: string;
  bankNumber: string;
};

export type TrxRequest = {
  _id: string;
  userAddress: string;
  network: number;
  usd: string;
  cop: string;
  cryptoCurrency: string;
};

export type Details = FormState &
  BankDetails &
  TrxRequest & {
    rate: number;
    qr: string;
    typeAccount: string;
  };
