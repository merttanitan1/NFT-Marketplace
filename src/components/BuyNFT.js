import React, { useState } from "react";
import { ethers } from "ethers";
import NFTMarketPlace from "../contracts/NFTMarketplace.json";

const BuyNFT = ({ marketplaceAddress }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [tokenId, setTokenId] = useState("");

    const buyNFT = async () => {
        if(!window.ethereum){
            setMessage("Please install MetaMask!");
            return;
        }

        setLoading(true);
        try{
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const marketplace = new ethers.Contract(marketplaceAddress, NFTMarketPlace.abi, signer);

            const price = await marketplace.tokenPrices(tokenId);
            const tx = await marketplace.buyNFT(tokenId, {value: price});
            await tx.wait();
            setMessage("NFT purchased successfully!");
            setTokenId("");
        }catch(err){
            console.error("Connection failed: " + err);
            setMessage("Connection failed: " + err.message);
        }
        setLoading(false);
    };

    return(
        <div>
            <h2>Buy NFT</h2>
            <form onSubmit={(e) => {e.preventDefault(); buyNFT();}}>
                <div>
                    <label>Token ID:</label>
                    <input
                        type="text"
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Buy NFT"}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};
export default BuyNFT;