import React from 'react';
import { useNavigate } from 'react-router-dom';
import './account.css';
import { UserData } from '../../context/UserContext';
import { CourseData } from '../../context/CourseContext';

const Account = ({ user }) => {
  const navigate = useNavigate();
  const { logoutUser } = UserData();
  const { setMyCourse } = CourseData();

  if (!user) {
    return (
      <div className="profile">
        <h2>My Profile</h2>
        <p>User data is not available. Please login again.</p>
        <button className='common-btn' onClick={() => navigate('/login')}>
          Go To Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="profile">
        <h2>My Profile</h2>
        <div className="profile-info">
          <p>
            <strong>Name - {user.name}</strong>
          </p>

          <p>
            <strong>Email - {user.email}</strong>
          </p>

          <p>
            <strong>Role - {user.role}</strong>
          </p>

          <button
            className='common-btn'
            onClick={() => navigate(user.role === "admin" ? "/admin/dashboard" : `/${user._id}/dashboard`)}
          >
            Dashboard
          </button>

          <br />

          <button
            className='common-btn'
            onClick={() => logoutUser(navigate, setMyCourse)}
            style={{ backgroundColor: 'red' }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
