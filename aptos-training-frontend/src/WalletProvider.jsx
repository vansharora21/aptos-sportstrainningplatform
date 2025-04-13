import React from "react";
import { AptosWalletAdapterProvider, NetworkName } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "@aptos-labs/wallet-adapter-petra";

const wallets = [new PetraWallet()];

export const WalletProvider = ({ children }) => {
  return (
    <AptosWalletAdapterProvider wallets={wallets} autoConnect={true}>
      {children}
    </AptosWalletAdapterProvider>
  );
};
