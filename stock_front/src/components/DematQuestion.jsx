import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/DematQuestion.css"; 

const DematQuestion = () => {
    const navigate = useNavigate();

    return (
        <div className="demat-container">
            <h2>Do you have Any Demat Account?</h2>
            <div className="button-group">
                <button className="yes-btn" onClick={() => navigate("/buystock")}>Yes</button>
                <button className="no-btn" onClick={() => navigate("/open-demat")}>No</button>
            </div>
        </div>
    );
};

export default DematQuestion;
