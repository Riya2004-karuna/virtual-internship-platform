import React from 'react';
import "./testimonials.css";

const Testimonials = () => {
    const testimonialsData = [
  {
    id: 1,
    name: "John Doe",
    position: "Student",
    message: "This platform helped me learn so effectively.",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    position: "Student",
    message: "I've learned more here than anywhere.",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: 3,
    name: "Alex",
    position: "Student",
    message: "Great platform!",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    id: 4,
    name: "Emma",
    position: "Student",
    message: "Loved the courses!",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
];
return (
  <section className='testimonials'>
    <h2> What our students says </h2>

    <div className="testmonials-cards">
      {
        testimonialsData.map((e) => (

          <div className="testmonial-card" key={e.id}>
            <div className="student-image">
              <img src={e.image} alt=''/>
            </div>

            <p className="message">{e.message}</p>

            <div className='info'>
              <p className="name">{e.name}</p> 
              <p className="position">{e.position}</p>
            </div>

          </div>

        ))
      }
    </div> 

  </section>
)
}

export default Testimonials