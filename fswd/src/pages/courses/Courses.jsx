import React from "react";
import { CourseData } from "../../context/CourseContext";
import CourseCard from "../../components/coursecard/CourseCard";
import Loading from "../../components/loading/Loading";
import "./Courses.css";

const Courses = () => {
  const { courses, courseLoading } = CourseData();

  if (courseLoading) {
    return <Loading />;
  }

  return (
    <div className="courses">
      <div className="courses-content">
        <h2>Available Courses</h2>
        <p>Explore our internship and learning programs designed to build practical skills.</p>

        <div className="course-container">
          {courses && courses.length > 0 ? (
            courses.map((course) => <CourseCard key={course._id || course.title} course={course} />)
          ) : (
            <p className="no-courses">No Courses</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
