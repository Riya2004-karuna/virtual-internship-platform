import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import { server } from "../../config";
import Loading from "../../components/loading/Loading";
import "./Lectures.css";

const Lectures = () => {
  const params = useParams();
  const { user } = UserData();
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lectureLoading, setLectureLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const activeUser = user || savedUser;
  const isAdmin = activeUser?.role === "admin";

  function changeVideoHandler(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setVideo(null);
      setVideoPreview("");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setVideoPreview(reader.result);
      setVideo(file);
    };
  }

  async function fetchLectures() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${server}/api/lectures/${params.id}`, {
        headers: { token },
      });

      setLectures(data.lectures || []);
      setLecture(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch lectures");
      setLectures([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLecture(id) {
    try {
      setLectureLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${server}/api/lecture/${id}`, {
        headers: { token },
      });

      setLecture(data.lecture);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch lecture");
    } finally {
      setLectureLoading(false);
    }
  }

  async function submitHandler(e) {
    e.preventDefault();

    if (!video) {
      toast.error("Please select a lecture video");
      return;
    }

    try {
      setFormLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("file", video);

      const { data } = await axios.post(`${server}/api/course/${params.id}`, formData, {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.message || "Lecture added");
      setTitle("");
      setDescription("");
      setVideo(null);
      setVideoPreview("");
      setShowForm(false);
      await fetchLectures();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add lecture");
    } finally {
      setFormLoading(false);
    }
  }

  async function deleteLecture(id) {
    if (!confirm("Are you sure you want to delete this lecture")) return;

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(`${server}/api/lecture/${id}`, {
        headers: { token },
      });

      toast.success(data.message || "Lecture deleted");
      if (lecture?._id === id) {
        setLecture(null);
      }
      await fetchLectures();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete lecture");
    }
  }

  useEffect(() => {
    fetchLectures();
  }, [params.id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="lectures-page">
      <section className="lecture-player-panel">
        {lectureLoading ? (
          <Loading />
        ) : lecture ? (
          <>
            <video
              className="lecture-video"
              src={`${server}/uploads/${lecture.video}`}
              controls
              controlsList="nodownload noremoteplayback"
              disablePictureInPicture
              disableRemotePlayback
            />
            <div className="lecture-details">
              <h2>{lecture.title}</h2>
              <p>{lecture.description}</p>
            </div>
          </>
        ) : (
          <div className="lecture-empty-state">
            <h2>Please select a lecture</h2>
            <p>Choose a lecture from the list to start studying.</p>
          </div>
        )}
      </section>

      <aside className="lecture-list-panel">
        <div className="lecture-list-header">
          <h3>Lectures</h3>
          {isAdmin && (
            <button className="common-btn" onClick={() => setShowForm((current) => !current)}>
              {showForm ? "Close" : "Add Lecture"}
            </button>
          )}
        </div>

        {isAdmin && showForm && (
          <form className="lecture-form" onSubmit={submitHandler}>
            <label htmlFor="lecture-title">Title</label>
            <input
              id="lecture-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label htmlFor="lecture-description">Description</label>
            <textarea
              id="lecture-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <label htmlFor="lecture-video">Video</label>
            <input
              id="lecture-video"
              type="file"
              accept="video/*"
              onChange={changeVideoHandler}
              required
            />

            {videoPreview && (
              <video
                className="lecture-preview-video"
                src={videoPreview}
                controls
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
              />
            )}

            <button className="common-btn" type="submit" disabled={formLoading}>
              {formLoading ? "Please wait..." : "Save Lecture"}
            </button>
          </form>
        )}

        <div className="lecture-list">
          {lectures.length > 0 ? (
            lectures.map((item, index) => (
              <div
                key={item._id}
                className={`lecture-card ${lecture?._id === item._id ? "active" : ""}`}
                onClick={() => fetchLecture(item._id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") fetchLecture(item._id);
                }}
              >
                <div>
                  <span>Lecture {index + 1}</span>
                  <h4>{item.title}</h4>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    className="lecture-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLecture(item._id);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="lecture-empty-list">
              {isAdmin ? "No lectures added yet. Click Add Lecture to upload one." : "No lectures added yet."}
            </p>
          )}
        </div>
      </aside>
    </main>
  );
};

export default Lectures;
