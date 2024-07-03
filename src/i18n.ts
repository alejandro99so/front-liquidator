import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import enHome from "../public/locales/en/home.json";
import enUser from "../public/locales/en/user.json";
import enPay from "../public/locales/en/pay.json";

import esHome from "../public/locales/es/home.json";
import esUser from "../public/locales/es/user.json";
import esPay from "../public/locales/es/pay.json";

const resources = {
  en: {
    home: enHome,
    user: enUser,
    pay: enPay,
  },
  es: {
    home: esHome,
    user: esUser,
    pay: esPay,
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: "en",
  debug: true,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
