import { useState, useEffect, useCallback } from "react";

export const generateConfirmationCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }
  return code;
};

export interface FormState {
  red: string;
  token: string;
  total: string;
  totalToken: string;
  note: string;
  method: string;
}

export interface BankDetails {
  bank: string;
  typeAccount: string;
  nAccount: string;
}

export const useFormState = () => {
  const [form, setForm] = useState<FormState>({
    red: "Base",
    token: "USDC",
    total: "",
    totalToken: "",
    note: "",
    method: "",
  });

  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bank: "",
    typeAccount: "",
    nAccount: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);

  useEffect(() => {
    const { total, totalToken, method } = form;
    const isValid =
      total !== "" &&
      totalToken !== "" &&
      method !== "" &&
      ((method === "QR" && qrCode !== null) ||
        (method === "Account" &&
          bankDetails.bank !== "" &&
          bankDetails.typeAccount !== "" &&
          bankDetails.nAccount !== ""));
    setIsFormValid(isValid);
  }, [form, bankDetails, qrCode]);

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    },
    []
  );

  const handleBankDetailsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setBankDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    },
    []
  );

  const handleTokenChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
        totalToken: "",
      }));
    },
    []
  );

  const handleRadioChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setForm((prevForm) => ({
        ...prevForm,
        method: value,
      }));

      if (value === "QR") {
        setQrCode(null); // Reset QR code
      } else if (value === "Account") {
        setBankDetails({ bank: "", typeAccount: "", nAccount: "" }); // Reset bank details
      }

      setIsModalOpen(true);
    },
    []
  );

  const handleModalClose = (data?: BankDetails) => {
    setIsModalOpen(false);
    if (form.method === "QR") {
      setQrCode(data?.bank || null);
    } else if (form.method === "Account" && data) {
      setBankDetails(data);
    }
  };

  const handleImageSelect = (image: string) => {
    setQrCode(image);
    setIsModalOpen(false);
  };

  const handleContinue = () => {
    setConfirmationCode(generateConfirmationCode());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setConfirmationCode(null);
    setIsEditing(true);
  };

  return {
    form,
    bankDetails,
    qrCode,
    isEditing,
    isFormValid,
    isModalOpen,
    confirmationCode,
    handleInputChange,
    handleBankDetailsChange,
    handleTokenChange,
    handleRadioChange,
    handleModalClose,
    handleImageSelect,
    handleContinue,
    handleCancel,
    setIsModalOpen,
  };
};
