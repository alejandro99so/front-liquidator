import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { baseSepolia, avalancheFuji } from "wagmi/chains";

// Your WalletConnect Cloud project ID
export const projectId = String(process.env.NEXT_PUBLIC_PROJECT_ID);

// Create a metadata object
const metadata = {
  name: "liquidator",
  description: "AppKit Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmiConfig
const chains = [baseSepolia, avalancheFuji] as const;
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
