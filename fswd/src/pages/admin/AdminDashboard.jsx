import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../config";
import "./adminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${server}/api/stats`, {
          headers: { token },
        });

        setStats(data.stats);
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load admin dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <main className="admin-dashboard">
        <h2>Admin Dashboard</h2>
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h2>Admin Dashboard</h2>
        <p>Overview of courses, lectures, and users.</p>
      </div>

      <section className="admin-dashboard__stats">
        <div className="admin-stat">
          <span>Total Courses</span>
          <strong>{stats?.totalCoures ?? 0}</strong>
        </div>
        <div className="admin-stat">
          <span>Total Lectures</span>
          <strong>{stats?.totalLectures ?? 0}</strong>
        </div>
        <div className="admin-stat">
          <span>Total Users</span>
          <strong>{stats?.totalUsers ?? 0}</strong>
        </div>
      </section>
    </main>
  );
};

export default AdminDashboard;
