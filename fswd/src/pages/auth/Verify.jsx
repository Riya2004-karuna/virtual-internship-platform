import { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [devOtp] = useState(() => localStorage.getItem("devOtp") || "");
  const navigate = useNavigate();
  const { btnLoading, verifyOtp } = UserData();

  const submitHandler = async (e) => {
    e.preventDefault();
    await verifyOtp(otp, navigate);
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Verify Account</h2>

        {devOtp && (
          <div className="dev-otp-box">
            <span>Development OTP</span>
            <strong>{devOtp}</strong>
            <button type="button" className="otp-fill-btn" onClick={() => setOtp(devOtp)}>
              Use OTP
            </button>
          </div>
        )}

        <form onSubmit={submitHandler}>
          <label htmlFor="otp">Otp</label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            required
          />
          <button type="submit" disabled={btnLoading} className="common-btn">
            {btnLoading ? "please wait..." : "Verify"}
          </button>
        </form>

        <p>
          Go to <Link to="/login">Login</Link> page
        </p>
      </div>
    </div>
  );
};

export default Verify;
