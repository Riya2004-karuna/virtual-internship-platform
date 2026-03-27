import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import Testimonials from '../../components/testimonials/Testimonials';

const Home = () => {

  const navigate =useNavigate()
  return  (

 <div className="home">
  
  <div className="hero">  
    <div className="home-content">
      <h1>Welcome to our Virtual Internship Platform.</h1>
      <p> Learn ,Grow ,Excel </p>
      <button onClick={()=>navigate("/courses")} className='common-btn'>
        Get Started
      </button>
    </div>
  </div>

  <Testimonials/>

</div>
  



  );
  
};

export default Home;