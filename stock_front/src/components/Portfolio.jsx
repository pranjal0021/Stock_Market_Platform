import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStocks, addStock } from "../api/api.js";
import Navbar from "./Navbar";
import "../style/portfolio.css";

const Portfolio = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newStock, setNewStock] = useState({
    stockSymbol: "",
    quantity: "",
    purchasePrice: "",
  });

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

  const handleChange = (e) => {
    setNewStock({ ...newStock, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!newStock.stockSymbol || !newStock.quantity || !newStock.purchasePrice) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${newStock.stockSymbol}&outputsize=full&apikey= SA1H5UWIKG0WV53L`
      );

      const data = await response.json();

      if (!data["Time Series (Daily)"]) {
        alert("Failed to fetch stock data. Check the symbol or try again later.");
        return;
      }

      const latestDate = Object.keys(data["Time Series (Daily)"])[0];
      const currentPrice = parseFloat(data["Time Series (Daily)"][latestDate]["4. close"]);

      const stockData = {
        stockSymbol: newStock.stockSymbol.toUpperCase(),
        quantity: parseInt(newStock.quantity, 10),
        purchasePrice: parseFloat(newStock.purchasePrice),
        currentPrice: currentPrice,
      };

      const addedStock = await addStock(stockData);
      setStocks([...stocks, addedStock]);
      setShowForm(false);
      setNewStock({ stockSymbol: "", quantity: "", purchasePrice: "" });
    } catch (error) {
      console.error("Error adding stock", error);
      alert("Failed to add stock. Please try again.");
    }
  };

  return (
    <>
      <div className="portfolio-class">
        <Navbar />
        <div className="container">
          <div className="Add-stock">
            <div className="add-icon">
              <h3>My Portfolio</h3>
              <i className="fa-solid fa-plus" onClick={() => setShowForm(true)}></i>
            </div>
            <div className="purchase-stock">
              <button onClick={() => navigate("/catlog")}>Purchase Shares</button>
            </div>
          </div>

          <div className="stock-table">
            <h2>Your Assets</h2>
            <table>
              <thead>
                <tr>
                  <th>Stock Symbol</th>
                  <th>Quantity</th>
                  <th>Purchase Price</th>
                  <th>Current Price</th>
                  <th>Total Value</th>
                  <th>Gain/Loss</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock, index) => (
                  <tr key={index}>
                    <td>{stock.stockSymbol}</td>
                    <td>{stock.quantity}</td>
                    <td>${stock.purchasePrice.toFixed(2)}</td>
                    <td>${stock.currentPrice.toFixed(2)}</td>
                    <td>${(stock.quantity * stock.currentPrice).toFixed(2)}</td>
                    <td
                      style={{
                        color: (stock.currentPrice - stock.purchasePrice) * stock.quantity < 0 ? "red" : "green",
                      }}
                    >
                      ${((stock.currentPrice - stock.purchasePrice) * stock.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showForm && (
            <div className="overlay">
              <div className="form-container">
                <h2>Add New Stock</h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="stockSymbol"
                    placeholder="Stock Symbol"
                    value={newStock.stockSymbol}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={newStock.quantity}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="number"
                    name="purchasePrice"
                    placeholder="Purchase Price"
                    value={newStock.purchasePrice}
                    onChange={handleChange}
                    required
                  />
                  <div className="buttons">
                    <button type="submit">Add Stock</button>
                    <button type="button" onClick={() => setShowForm(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Portfolio;
