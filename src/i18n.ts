import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import enLading from "../public/locales/en/landing.json";
import enHeader from "../public/locales/en/header.json";
import enHome from "../public/locales/en/home.json";
import enUser from "../public/locales/en/user.json";
import enPay from "../public/locales/en/pay.json";

import esLading from "../public/locales/es/landing.json";
import esHeader from "../public/locales/es/header.json";
import esHome from "../public/locales/es/home.json";
import esUser from "../public/locales/es/user.json";
import esPay from "../public/locales/es/pay.json";

const resources = {
  en: {
    landing: enLading,
    header: enHeader,
    home: enHome,
    user: enUser,
    pay: enPay,
  },
  es: {
    landing: esLading,
    header: esHeader,
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
