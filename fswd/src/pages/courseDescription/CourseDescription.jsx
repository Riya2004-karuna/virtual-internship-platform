import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import { server } from "../../config";
import Loading from "../../components/loading/Loading";
import "./CourseDescription.css";

const CourseDescription = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { course, fetchCourse, fetchCourses, fetchMyCourse, singleCourseLoading } = CourseData();
  const { user, isAuth, fetchUser } = UserData();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourse(params.id);
  }, [params.id]);

  const hasAccess =
    user?.role === "admin" ||
    user?.courses?.some((courseId) => String(courseId) === String(course?._id));

  const checkoutHandler = async () => {
    if (!isAuth) {
      navigate("/login");
      return;
    }

    if (!course?._id) {
      toast.error("Course is not available right now");
      return;
    }

    if (hasAccess) {
      navigate(`/course/study/${course._id}`);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const { data: keyData } = await axios.get(`${server}/api/payment/key`, {
        headers: { token },
      });

      const { data } = await axios.post(
        `${server}/api/course/checkout/${params.id}`,
        {},
        {
          headers: { token },
        }
      );

      const options = {
        key: keyData.key,
        amount: data.order.amount,
        currency: "INR",
        name: "Learnify",
        description: "Learn with us",
        order_id: data.order.id,
        handler: async function (response) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;

          const verificationResponse = await axios.post(
            `${server}/api/course/payment-verification/${params.id}`,
            {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            },
            {
              headers: { token },
            }
          );

          await fetchUser();
          await fetchCourses();
          await fetchMyCourse();
          toast.success(verificationResponse.data.message);
          navigate(`/payment-success/${razorpay_payment_id}`);
        },
        prefill: {
          name: user?.name || "Student",
          email: user?.email || "",
        },
        theme: {
          color: "#8a4baf",
        },
      };

      if (!window.Razorpay) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading || singleCourseLoading) {
    return <Loading />;
  }

  if (!course) {
    return (
      <div className="course-description-page">
        <div className="course-description-card">
          <div className="course-description-info">
            <h2>Course Not Found</h2>
            <p>The requested course could not be loaded.</p>
            <button className="common-btn" onClick={() => navigate('/courses')}>
              Back To Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-description-page">
      <div className="course-description-card">
        <img
          src={`${server}/${course.image}`}
          alt={course.title}
          className="course-description-image"
        />

        <div className="course-description-info">
          <h2>{course.title}</h2>
          <p><strong>Instructor:</strong> {course.createdBy}</p>
          <p><strong>Duration:</strong> {course.duration} weeks</p>
          <p><strong>Price:</strong> {"\u20B9"} {course.price}</p>
          <p><strong>Description:</strong> {course.description}</p>

          <button className="common-btn" onClick={checkoutHandler} disabled={loading}>
            {hasAccess ? "Study" : loading ? "Please wait..." : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDescription;

