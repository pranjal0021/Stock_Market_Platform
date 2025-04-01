/*import { useEffect, useState } from "react";
import { fetchStocks, buyStock, sellStock } from "../api/api";
import "../style/BuyStock.css";

const BuyStock = () => {
    const [stocks, setStocks] = useState([]);
    const [selectedStock, setSelectedStock] = useState("");
    const [stockPrice, setStockPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [budget, setBudget] = useState(10000); // Assume user has a budget
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadStocks = async () => {
            try {
                const stocksData = await fetchStocks();
                setStocks(stocksData);
            } catch (error) {
                console.error("Error loading stocks", error);
            }
        };
        loadStocks();
    }, []);

    const handleStockChange = (e) => {
        const selected = stocks.find(stock => stock.stockSymbol === e.target.value);
        setSelectedStock(selected ? selected.stockSymbol : "");
        setStockPrice(selected ? selected.currentPrice : 0);
    };

    const handleTransaction = async (type) => {
        if (!selectedStock || quantity < 1) {
            setMessage("Please select a stock and enter a valid quantity.");
            return;
        }

        const totalCost = stockPrice * quantity;

        if (type === "buy" && budget < totalCost) {
            setMessage("Insufficient budget!");
            return;
        }

        setLoading(true);
        try {
            const stockData = { stockSymbol: selectedStock, quantity };
            let responseMessage;

            if (type === "buy") {
                await buyStock(stockData);
                setBudget(budget - totalCost);
                responseMessage = `Bought ${quantity} shares of ${selectedStock}`;
            } else {
                const sellResponse = await sellStock(stockData);
                responseMessage = sellResponse;
            }

            setMessage(responseMessage);
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            setMessage("Transaction failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="buy-stock-container">
            <h2>Buy/Sell Stock</h2>
            <div className="budget-display">
                Available Budget: <span>${budget.toFixed(2)}</span>
            </div>

            <select onChange={handleStockChange}>
                <option value="">Select Stock</option>
                {stocks.map(stock => (
                    <option key={stock.id} value={stock.stockSymbol}>
                        {stock.stockSymbol} - ${stock.currentPrice.toFixed(2)}
                    </option>
                ))}
            </select>

            {stockPrice > 0 && (
                <div className="price-info">
                    <p>Current Price: <strong>${stockPrice.toFixed(2)}</strong></p>
                    <p>Total Cost: <strong>${(stockPrice * quantity).toFixed(2)}</strong></p>
                </div>
            )}

            <input 
                type="number" 
                placeholder="Quantity" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
            />

            <div className="button-group">
                <button onClick={() => handleTransaction("buy")} disabled={loading || !selectedStock}>
                    {loading ? "Processing..." : "Buy Stock"}
                </button>
                <button onClick={() => handleTransaction("sell")} disabled={loading || !selectedStock}>
                    {loading ? "Processing..." : "Sell Stock"}
                </button>
            </div>

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default BuyStock;

*/