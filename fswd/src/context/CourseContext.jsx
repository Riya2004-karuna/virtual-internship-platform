import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../config";

const defaultCourseContext = {
  courses: [],
  setCourses: () => {},
  course: null,
  setCourse: () => {},
  setMyCourse: () => {},
  myCourse: [],
  fetchCourses: async () => {},
  fetchCourse: async () => {},
  fetchMyCourse: async () => {},
  deleteCourse: async () => {},
  checkoutCourse: async () => null,
  courseLoading: false,
  singleCourseLoading: false,
};

const CourseContext = createContext(defaultCourseContext);

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [myCourse, setMyCourse] = useState([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const [singleCourseLoading, setSingleCourseLoading] = useState(false);

  async function fetchCourses() {
    try {
      setCourseLoading(true);
      const { data } = await axios.get(`${server}/api/course/all`, { timeout: 3000 });
      setCourses(data.courses || []);
    } catch (error) {
      setCourses([]);
      toast.error(error.response?.data?.message || "Failed to fetch courses");
    } finally {
      setCourseLoading(false);
    }
  }

  async function fetchCourse(id) {
    try {
      setSingleCourseLoading(true);
      const { data } = await axios.get(`${server}/api/course/${id}`, { timeout: 3000 });
      setCourse(data.course || null);
    } catch (error) {
      setCourse(null);
      toast.error(error.response?.data?.message || "Failed to fetch course details");
    } finally {
      setSingleCourseLoading(false);
    }
  }

  async function fetchMyCourse() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMyCourse([]);
        return;
      }

      setMyCourse([]);
      const { data } = await axios.get(`${server}/api/mycourse`, {
        headers: {
          token,
        },
        timeout: 5000,
      });

      setMyCourse(data.courses || []);
    } catch (error) {
      console.error(error);
      setMyCourse([]);
    }
  }

  async function deleteCourse(id) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const { data } = await axios.delete(`${server}/api/course/${id}`, {
        headers: {
          token,
        },
      });

      toast.success(data.message || "Course deleted successfully");
      await fetchCourses();
      await fetchMyCourse();
      if (course?._id === id) {
        setCourse(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete course");
    }
  }

  async function checkoutCourse(id) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return null;
      }

      const { data } = await axios.post(
        `${server}/api/course/checkout/${id}`,
        {},
        {
          headers: {
            token,
          },
          timeout: 3000,
        }
      );

      toast.success(data.message || "Checkout created successfully");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
      return null;
    }
  }

  useEffect(() => {
    fetchCourses();
    fetchMyCourse();
  }, []);

  return (
    <CourseContext.Provider
      value={{
        courses,
        setCourses,
        course,
        setCourse,
        setMyCourse,
        myCourse,
        fetchCourses,
        fetchCourse,
        fetchMyCourse,
        deleteCourse,
        checkoutCourse,
        courseLoading,
        singleCourseLoading,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = () => useContext(CourseContext) || defaultCourseContext;
