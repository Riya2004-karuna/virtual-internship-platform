import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import CourseCard from "../../components/coursecard/CourseCard";
import "./Dashboard.css";

const Dashboard = () => {
  const { id } = useParams();
  const { myCourse, fetchMyCourse } = CourseData();
  const { user } = UserData();

  useEffect(() => {
    fetchMyCourse();
  }, [id]);

  if (user && String(user._id) !== String(id)) {
    return <Navigate to={`/${user._id}/dashboard`} replace />;
  }

  return (
    <main className="student-dashboard">
      <div className="student-dashboard__header">
        <h2>My Dashboard</h2>
        <p>Your enrolled courses are shown here.</p>
      </div>

      <section className="student-dashboard__courses">
        {myCourse && myCourse.length > 0 ? (
          myCourse.map((course) => <CourseCard key={course._id} course={course} />)
        ) : (
          <p className="student-dashboard__empty">No Course Enrolled Yet</p>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
