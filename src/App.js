import React, { useState } from "react";
import WalletConnect from "./components/WalletConnect";
import MintNFT from "./components/MintNFT";
import ListNFT from "./components/ListNFT";
import BuyNFT from "./components/BuyNFT";
import TokenList from "./components/TokenList";

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const marketplaceAddress = "0x5a3928e4B3C4C98af4FBCabc86BF18489402360D";

  return (
    <div className="App">
      <header className="App-header">
        <h1>NFT Marketplace</h1>
        <WalletConnect setWalletAddress={setWalletAddress} />
        {walletAddress && <p>Cüzdan Adresi: {walletAddress}</p>}
        {walletAddress && <MintNFT marketplaceAddress={marketplaceAddress}/>}
        {walletAddress && <ListNFT marketplaceAddress={marketplaceAddress}/>}
        {walletAddress && <BuyNFT marketplaceAddress={marketplaceAddress}/>}
        {walletAddress && <TokenList marketplaceAddress={marketplaceAddress}/>}
      </header>
    </div>
  );
}

export default App;