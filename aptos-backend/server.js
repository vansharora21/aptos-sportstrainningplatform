require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { AptosClient } = require("aptos");

const app = express();
app.use(express.json());
app.use(cors());

const APTOS_NODE_URL = "https://fullnode.mainnet.aptoslabs.com"; // Aptos Mainnet Node
const client = new AptosClient(APTOS_NODE_URL);

// Route to connect wallet
app.post("/connect-wallet", async (req, res) => {
    try {
        const { walletAddress } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ error: "Wallet address is required" });
        }

        res.json({ message: "Wallet connected successfully", wallet: walletAddress });
    } catch (error) {
        console.error("Error connecting wallet:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route to fetch wallet balance
app.get("/balance/:address", async (req, res) => {
    try {
        const { address } = req.params;
        const balance = await client.getAccountBalance(address);

        res.json({ balance });
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
