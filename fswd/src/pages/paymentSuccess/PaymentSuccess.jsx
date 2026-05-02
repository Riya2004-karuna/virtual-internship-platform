import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <div className="payment-success-page">
      <div className="payment-success-card">
        <h2>Payment Successful</h2>
        <p>Your course subscription has been activated</p>
        <p>Reference No: {params.id}</p>
        <button className="common-btn" onClick={() => navigate("/")}>
          Go To Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
