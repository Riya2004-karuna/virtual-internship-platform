import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { server } from "../config";
import toast, { Toaster } from "react-hot-toast";

const defaultUserContext = {
  user: null,
  setUser: () => {},
  setIsAuth: () => {},
  isAuth: false,
  loginUser: async () => {},
  registerUser: async () => {},
  verifyOtp: async () => {},
  btnLoading: false,
  loading: false,
  fetchUser: async () => {},
  logoutUser: async () => {},
};

const UserContext = createContext(defaultUserContext);

export const UserContextProvider = ({ children }) => {
  const savedUser = localStorage.getItem("user");
  const savedToken = localStorage.getItem("token");

  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);
  const [isAuth, setIsAuth] = useState(!!savedToken);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function fetchUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setIsAuth(false);
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token,
        },
        timeout: 10000,
      });

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuth(true);
      return true;
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuth(false);
      toast.error(error.response?.data?.message || "Session expired. Please login again.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchUser();
    }
  }, []);

  async function loginUser(email, password, navigate, fetchMyCourse) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email, password });

      toast.success(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setIsAuth(true);
      navigate(data.user?.role === "admin" ? "/admin/dashboard" : `/${data.user?._id}/dashboard`, { replace: true });
      fetchMyCourse?.();
      fetchUser();
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuth(false);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setBtnLoading(false);
    }
  }

  async function registerUser(name, email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name,
        email,
        password,
      });

      localStorage.setItem("activationToken", data.activationToken);
      if (data.devOtp) {
        localStorage.setItem("devOtp", data.devOtp);
        toast.success("OTP email failed, but a development OTP is shown on the verify page.");
      } else {
        localStorage.removeItem("devOtp");
        toast.success(data.message);
      }
      navigate("/verify");
    } catch (error) {
      toast.error(error.response?.data?.message || "Register failed");
    } finally {
      setBtnLoading(false);
    }
  }

  async function verifyOtp(otp, navigate) {
    setBtnLoading(true);
    try {
      const activationToken = localStorage.getItem("activationToken");
      const normalizedOtp = String(otp).replace(/\s+/g, "");

      if (!activationToken) {
        toast.error("Activation token missing");
        return;
      }

      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp: normalizedOtp,
        activationToken,
      });

      toast.success(data.message);
      localStorage.removeItem("activationToken");
      localStorage.removeItem("devOtp");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setBtnLoading(false);
    }
  }

  async function logoutUser(navigate, setMyCourse) {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    setIsAuth(false);
    setLoading(false);
    setMyCourse?.([]);
    toast.success("Logged out");
    if (navigate) {
      navigate("/login", { replace: true });
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        setIsAuth,
        isAuth,
        loginUser,
        registerUser,
        verifyOtp,
        btnLoading,
        loading,
        fetchUser,
        logoutUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext) || defaultUserContext;

