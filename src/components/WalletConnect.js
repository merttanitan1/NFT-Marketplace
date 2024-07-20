import React, { useState } from 'react';
import { ethers } from 'ethers';

const WalletConnect = ({ setWalletAddress }) => {
    const [message, setMessage] = useState('');

    const connectWallet = async() => {
        if(!window.ethereum){
            setMessage("Please Install MetaMask");
            return;
        }
        try{
            const provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setWalletAddress(address);
            setMessage("Successfully Connected.");
        }catch(err){
            console.error("Connection Failed: " + err);
            setMessage("Connection Failed: " + err);
        }
    };

    return(
        <div>
            <button onClick={connectWallet}>Connect Wallet</button>
            {message && <p>{message}</p>}
        </div>
    );
};
export default WalletConnect;