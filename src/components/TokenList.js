import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import NFTMarketPlace from '../contracts/NFTMarketplace.json';

const TokenList = ({marketplaceAddress}) => {
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTokens = async() => {
            try {
                if(!window.ethereum){
                    setError("Please install MetaMask!");
                    return;
                }

                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const marketplace = new ethers.Contract(marketplaceAddress, NFTMarketPlace.abi, signer);

                const tokenCounter = await marketplace.tokenCounter();
                let tokenList = [];
                
                setLoading(true);

                for (let i = 0; i < tokenCounter; i++) {
                    try{
                        const tokenURI = await marketplace.tokenURI(i);
                        const tokenPrice = await marketplace.tokenPrices(i);
                        const tokenOwner = await marketplace.ownerOf(i);
                        tokenList.push({tokenId: i, tokenURI, tokenPrice, tokenOwner});
                    }catch(err){
                        console.error(err);
                    }
                }
                setTokens(tokenList);
                setLoading(false);
            }catch(err){
                console.error("Fetch Failed: " + err);
                setError("Fetch Failed: " + err);
            }
        };
        fetchTokens();
    }, [marketplaceAddress]);

    return(
        <div>
            <h2>NFT Tokens</h2>
            {loading ? "Loading..." : "Total NFTs"}
            {!loading && !error && (
                <ul>
                    {tokens.map((token) => (
                        <li key={token.tokenId}>
                            <p>Token ID: {token.tokenId}</p>
                            <p>Token URI: <a href={token.tokenURI} target="_blank" rel="noopener noreferrer">{token.tokenURI}</a></p>
                            <p>Price: {ethers.formatEther(token.tokenPrice)}</p>
                            <p>Owner: {token.tokenOwner}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default TokenList;