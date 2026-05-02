import { useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";
import { server } from "../../config";
import "./CourseStudy.css";

const CourseStudy = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { course, fetchCourse, singleCourseLoading } = CourseData();
  const { user } = UserData();

  useEffect(() => {
    fetchCourse(params.id);
  }, [params.id]);

  if (singleCourseLoading || !course) {
    return <Loading />;
  }

  const hasAccess =
    user?.role === "admin" ||
    user?.courses?.some((courseId) => String(courseId) === String(params.id));

  if (user && !hasAccess) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="course-study-page">
      <div className="course-study-card">
        <img src={`${server}/${course.image}`} alt={course.title} className="course-study-image" />
        <div className="course-study-info">
          <h2>{course.title}</h2>
          <p><strong>Description:</strong> {course.description}</p>
          <p><strong>Instructor:</strong> {course.createdBy || "Admin"}</p>
          <p><strong>Duration:</strong> {course.duration} weeks</p>
          <button className="common-btn" onClick={() => navigate(`/lectures/${course._id}`)}>
            Lectures
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseStudy;
