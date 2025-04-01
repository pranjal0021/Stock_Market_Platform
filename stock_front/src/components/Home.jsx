import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Home.css";
import Navbar from "./Navbar";

const Home = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        alert("Logged out successfully!");
        navigate("/login");
    };

    return (
        <div 
            className="home-container"
            style={{
                backgroundImage: "url('/market.avif')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh",
                position: "relative",
            }}
        >
            {/* Gradient Overlay */}
            <div className="overlay"></div>

            {/* Navbar */}
            <header className="navbar">
                {/* Clickable Logo Section */}
                <Link to="/" className="logo-container">
                    <img src="/logo-StockiFy.png" alt="StockiFy Logo" className="logo-img" />
                </Link>

                {/* Navigation Links */}
                <nav>
                    <ul className="nav-links">
                        <li><Link to="/">Dashboard</Link></li>
                        <li><Link to="/market">Market</Link></li>
                        <li><Link to="/budget">Budget</Link></li>
                        <li><Link to="/portfolio">Portfolio</Link></li>
                        <li><Link to="/learn">Learn</Link></li>
                        <li><Link to="/buystock">Buy Stock</Link></li>
                    </ul>
                </nav>

                {/* Authentication Buttons */}
                <div className="nav-buttons">
                    {isLoggedIn ? (
                        <button className="nav-btn logout" onClick={handleLogout}>Logout</button>
                    ) : (
                        <>
                            <button className="nav-btn" onClick={() => navigate("/register")}>Register</button>
                            <button className="nav-btn" onClick={() => navigate("/login")}>Login</button>
                        </>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <main className="hero">
                <div className="hero-content">
                    <h1>Learn and Master the Stock Market with <span className="highlight">StockiFy</span></h1>
                    <p>A Smart Way to Manage Your Finances</p>
                    <p>Track trends, analyze stocks, and make smarter investments.</p>
                </div>

                {/* Open Demat Account Button */}
                <div className="demat-button-container">
                    <Link to="/demat-question" className="demat-btn">
                        Open a Demat Account
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Home;
