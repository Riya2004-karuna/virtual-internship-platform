import React from "react";
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { UserData } from "./context/UserContext";

import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Footer from "./components/header/footer/Footer";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import About from "./pages/about/About";
import Account from "./pages/account/Account";
import Courses from "./pages/courses/Courses";
import CourseDescription from "./pages/courseDescription/CourseDescription";
import CourseStudy from "./pages/courseStudy/CourseStudy";
import PaymentSuccess from "./pages/paymentSuccess/PaymentSuccess";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Loading from "./components/loading/Loading";
import Dashboard from "./pages/dashboard/Dashboard";
import Lectures from "./pages/lectures/Lectures";

const App = () => {
  const { user, isAuth, loading } = UserData();
  const authUser = user;
  const authenticated = isAuth && !!authUser;
  const signedInPath = authUser?.role === "admin" ? "/admin/dashboard" : `/${authUser?._id}/dashboard`;

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Header isAuth={authenticated} user={authUser} />

        <div className="content">
          <Routes>
            <Route path="/" element={authenticated ? <Home /> : <Navigate to="/login" replace />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDescription />} />
            <Route path="/course/study/:id" element={authenticated ? <CourseStudy /> : <Navigate to="/login" replace />} />
            <Route path="/lectures/:id" element={authenticated ? <Lectures /> : <Navigate to="/login" replace />} />
            <Route path="/payment-success/:id" element={authenticated ? <PaymentSuccess /> : <Navigate to="/login" replace />} />
            <Route path="/:id/dashboard" element={authenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/account" element={authenticated ? <Account user={authUser} /> : <Navigate to="/login" replace />} />
            <Route path="/admin/dashboard" element={authenticated && authUser?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" replace />} />
            <Route path="/login" element={authenticated ? <Navigate to={signedInPath} replace /> : <Login />} />
            <Route path="/register" element={authenticated ? <Navigate to={signedInPath} replace /> : <Register />} />
            <Route path="/verify" element={authenticated ? <Navigate to={signedInPath} replace /> : <Verify />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
