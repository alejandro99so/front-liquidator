export function formatWalletAddress(address: string) {
  if (address) {
    const end = address.slice(-4);
    const start = address.slice(0, 4);
    return `${start}...${end}`;
  }
}
