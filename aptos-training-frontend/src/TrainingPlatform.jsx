import React, { useState, useEffect } from "react";
import "./TrainingPlatform.css"; // Import CSS file

const TrainingPlatform = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [balance, setBalance] = useState(null);
    const [receiverAddress, setReceiverAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState(null);

    // ✅ Connect to Petra Wallet
    const connectWallet = async () => {
        setIsLoading(true);
        if (window.aptos) {
            try {
                const response = await window.aptos.connect();
                console.log("✅ Connected Wallet:", response.address);
                setWalletAddress(response.address);
                fetchBalance(response.address);
                setTransactionStatus({ type: "success", message: "Wallet connected successfully!" });
            } catch (error) {
                console.error("❌ Wallet connection failed:", error);
                setTransactionStatus({ type: "error", message: "Wallet connection failed. Check console for details." });
            }
        } else {
            setTransactionStatus({ type: "error", message: "Petra Wallet not installed. Please install it from https://petra.app/" });
        }
        setIsLoading(false);
    };

    // ✅ Fetch Aptos balance from backend
    const fetchBalance = async (address) => {
        try {
            const response = await fetch(`http://localhost:5000/balance/${address}`);
            const data = await response.json();
            console.log("💰 Balance:", data.balance);
            setBalance(data.balance);
        } catch (error) {
            console.error("❌ Error fetching balance:", error);
            setTransactionStatus({ type: "error", message: "Error fetching balance. Please try again." });
        }
    };

    // ✅ Stake tokens function (Fixes Hex Error)
    const stakeTokens = async () => {
        setIsLoading(true);
        setTransactionStatus(null);
        try {
            if (!window.aptos) {
                setTransactionStatus({ type: "error", message: "Petra Wallet not installed. Please install it from https://petra.app/" });
                setIsLoading(false);
                return;
            }
            if (!walletAddress) {
                setTransactionStatus({ type: "error", message: "Please connect your wallet first." });
                setIsLoading(false);
                return;
            }
            if (!receiverAddress) {
                setTransactionStatus({ type: "error", message: "Please enter the receiver's address." });
                setIsLoading(false);
                return;
            }

            // Remove any '0x' prefix and ensure proper hex format
            const cleanReceiverAddress = receiverAddress.replace(/^0x/, '');
            
            // Validate hex format (must be exactly 64 hex digits)
            if (!/^[a-fA-F0-9]{64}$/.test(cleanReceiverAddress)) {
                setTransactionStatus({ type: "error", message: "Invalid receiver address format. Please check the address." });
                setIsLoading(false);
                return;
            }

            const transaction = {
                type: "entry_function_payload",
                function: "0x1::coin::transfer",
                arguments: [
                    cleanReceiverAddress,  // receiver address
                    1,                     // amount as number (1 token)
                ],
                type_arguments: ["0x1::aptos_coin::AptosCoin"],
            };
            
            console.log("🚀 Sending transaction:", JSON.stringify(transaction, null, 2));

            const response = await window.aptos.signAndSubmitTransaction(transaction);

            console.log("✅ Transaction Response:", response);
            setTransactionStatus({ type: "success", message: "Transaction submitted! Check your Aptos Explorer." });
        } catch (error) {
            console.error("❌ Petra Wallet Error:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            setTransactionStatus({ type: "error", message: `Transaction failed: ${error.message}` });
        }
        setIsLoading(false);
    };

    // ✅ Debug: Log wallet address updates
    useEffect(() => {
        console.log("🔄 Updated Wallet Address:", walletAddress);
    }, [walletAddress]);

    return (
        <div className="platform-container">
            <div className="platform-header">
                <h1>Aptos Sports Training Platform</h1>
                <p className="subtitle">Connect your wallet and start training on the blockchain</p>
            </div>
            
            <div className="wallet-section">
                <button 
                    className={`connect-button ${walletAddress ? 'connected' : ''}`} 
                    onClick={connectWallet}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="loading-spinner"></span>
                    ) : walletAddress ? (
                        <span>Wallet Connected</span>
                    ) : (
                        <span>Connect Wallet</span>
                    )}
                </button>
                
                {walletAddress && (
                    <div className="wallet-info">
                        <div className="info-card">
                            <h3>Wallet Address</h3>
                            <p className="address">{walletAddress}</p>
                        </div>
                        {balance !== null && (
                            <div className="info-card">
                                <h3>Balance</h3>
                                <p className="balance">{balance} <span className="token">APT</span></p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {walletAddress && (
                <div className="staking-section">
                    <h2>Stake Tokens</h2>
                    <div className="input-group">
                        <label htmlFor="receiver-address">Receiver Address</label>
                        <input
                            id="receiver-address"
                            type="text"
                            placeholder="Enter receiver's address"
                            value={receiverAddress}
                            onChange={(e) => setReceiverAddress(e.target.value)}
                            className="address-input"
                        />
                    </div>
                    
                    <button 
                        className="stake-button" 
                        onClick={stakeTokens}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            <span>Stake 1 APT</span>
                        )}
                    </button>
                </div>
            )}
            
            {transactionStatus && (
                <div className={`status-message ${transactionStatus.type}`}>
                    {transactionStatus.type === 'success' ? (
                        <span className="status-icon">✓</span>
                    ) : (
                        <span className="status-icon">✕</span>
                    )}
                    <p>{transactionStatus.message}</p>
                </div>
            )}
            
            <div className="platform-footer">
                <p>Powered by Aptos Blockchain</p>
            </div>
        </div>
    );
};

export default TrainingPlatform;
// Note: Ensure to run the backend server on port 5000 for the fetch requests to work properly.