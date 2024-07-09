import { BankDetails, FormState } from "@/app/types";
import { useState, useEffect } from "react";

const useFormValidation = (
  form: FormState,
  bankDetails: BankDetails,
  qrCode: string | null
) => {
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { total, totalToken, method } = form;
    const isValid =
      total !== "" &&
      totalToken !== "" &&
      method !== "" &&
      ((method === "qr" && qrCode !== null) ||
        (method === "transfer" &&
          bankDetails.bankName !== "" &&
          bankDetails.bankType !== "" &&
          bankDetails.bankNumber !== ""));
    setIsFormValid(isValid);
  }, [form, bankDetails, qrCode]);

  return isFormValid;
};

export default useFormValidation;
