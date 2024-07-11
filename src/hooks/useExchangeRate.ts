import { FormState } from "@/app/types";
import { useState, useEffect } from "react";

const useExchangeRate = (form: FormState) => {
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

export default useExchangeRate;
