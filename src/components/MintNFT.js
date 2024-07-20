import React, { useState } from "react";
import { ethers } from 'ethers';
import NFTMarketPlace from '../contracts/NFTMarketplace.json';

const MintNFT = ({marketplaceAddress}) => {
    const [tokenURI, setTokenURI] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const mintNFT = async() => {
        if(!window.ethereum){
            setMessage("Please Install Metamask.");
            return;
        }
        
        setLoading(true);
        try{
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const marketplace = new ethers.Contract(marketplaceAddress, NFTMarketPlace.abi, signer);

            const tx = await marketplace.createNFT(tokenURI);
            await tx.wait();
            setMessage("NFT Created.");
            setTokenURI('');
        }catch(err){
            console.error("Connection Failed: " + err);
            setMessage("Connection Failed: " + err);
        }

        setLoading(false);
    };

    return(
        <div>
            <h2>Create New NFT</h2>
            <form onSubmit={(e) => { e.preventDefault(); mintNFT(); }}>
                <div>
                    <label>NFT URI:</label>
                    <input
                        type="text"
                        value={tokenURI}
                        onChange={(e) => setTokenURI(e.target.value)}
                        placeholder="https://gateway.pinata.cloud/ipfs/YOUR_METADATA_CID"
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create NFT"}
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default MintNFT;