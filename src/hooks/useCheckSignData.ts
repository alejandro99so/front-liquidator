"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useCheckSignData = () => {
  const router = useRouter();
  useEffect(() => {
    const isSignData = sessionStorage.getItem("IsSignData");
    if (isSignData === "false") {
      router.push("/Dashboard");
    }
  }, [router]);
};

export default useCheckSignData;
