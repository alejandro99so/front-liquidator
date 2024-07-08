import { useState, useEffect } from "react";

export interface FormState {
  red: string;
  token: string;
  total: string;
  totalToken: string;
  note: string;
  method: string;
}

export const useRateCalculation = (form: FormState): number | null => {
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    const { total, totalToken } = form;
    const totalValue = parseFloat(total.replace(/,/g, ""));
    const totalTokenValue = parseFloat(totalToken);

    if (
      !isNaN(totalValue) &&
      !isNaN(totalTokenValue) &&
      totalTokenValue !== 0
    ) {
      setRate(totalValue / totalTokenValue);
    } else {
      setRate(null);
    }
  }, [form.total, form.totalToken]);

  return rate;
};
