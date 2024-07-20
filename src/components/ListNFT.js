import React, { useState } from "react";
import { ethers } from "ethers";
import NFTMarketPlace from "../contracts/NFTMarketplace.json";

const ListNFT = ({ marketplaceAddress }) => {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [tokenId, setTokenId] = useState("");
    const [price, setPrice] = useState("");

    const ListNFT = async() => {
        if(!window.ethereum){
            setMessage("Please install MetaMask!");
            return;
        }

        setLoading(true);
        try{
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const marketplace = new ethers.Contract(marketplaceAddress, NFTMarketPlace.abi, signer);

            const tx = await marketplace.listNFT(tokenId, ethers.parseEther(price));
            await tx.wait();
            setMessage("NFT listed successfully!");
            setTokenId("");
            setPrice("");
        }catch(err){
            console.error("Connection error: ", err);
            setMessage("Connection error: " + err.message);
        }
        setLoading(false);
    };

    return(
        <div>
            <h2>List NFT</h2>
            <form onSubmit={(e) => {e.preventDefault(); ListNFT();}}>
                <div>
                    <label>Token ID:</label>
                    <input 
                        type="text"
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input 
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "List NFT"}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};
export default ListNFT;