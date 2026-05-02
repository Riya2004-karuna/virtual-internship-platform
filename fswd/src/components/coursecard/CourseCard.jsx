import React from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../../context/UserContext";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../config";
import "./coursecard.css";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { deleteCourse } = CourseData();

  const subscribedCourses = user?.courses || [];
  const hasAccess =
    user?.role === "admin" ||
    subscribedCourses.some((courseId) => String(courseId) === String(course._id));

  const deleteHandler = async (id) => {
    if (!confirm("Are you sure you want to delete this course")) return;
    await deleteCourse(id);
  };

  const handlePrimaryAction = () => {
    if (!isAuth) {
      navigate("/login");
      return;
    }

    if (hasAccess) {
      navigate(`/course/study/${course._id}`);
      return;
    }

    navigate(`/course/${course._id}`);
  };

  return (
    <div className="course-card">
      <img
        src={`${server}/${course.image}`}
        alt={course.title}
        className="course-image"
      />

      <div className="course-card-body">
        <h3>{course.title}</h3>
        <p><strong>Instructor:</strong> {course.createdBy || course.instructor || "Admin"}</p>
        <p><strong>Duration:</strong> {course.duration} weeks</p>
        <p><strong>Price:</strong> {"\u20B9"} {course.price}</p>
        <button className="common-btn" onClick={handlePrimaryAction}>
          {hasAccess ? "Study" : "Get Started"}
        </button>

        {user?.role === "admin" && (
          <>
            <br />
            <button className="common-btn delete-btn" onClick={() => deleteHandler(course._id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseCard;



