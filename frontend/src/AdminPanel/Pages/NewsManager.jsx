import React, { useEffect, useState } from "react";
import axios from "axios";

const NewsManager = () => {
  const [newsList, setNewsList] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    moreContent: "",
    author: "ITU Admin",
    category: "News",
    tags: "",
    featured: false,
    published: true,
    readTime: 5,
    metaDescription: ""
  });
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    try {
      setError(null);
      const res = await axios.get(`http://localhost:3001/api/admin/getallNews`);
      setNewsList(res.data.news || []);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Failed to load news. Please try again.");
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
        setError("Invalid image format. Only JPG, PNG, WEBP, or GIF are allowed.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      setImage(file);
      setFileName(file.name);
      setError(null);
    }
  };

  const resetForm = () => {
    setFormData({ title: "", content: "", moreContent: "" });
    setImage(null);
    setFileName("");
    setEditId(null);
    setError(null);
    document.querySelector('input[type="file"]').value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, content, moreContent } = formData;
    if (!title.trim() || !content.trim() || !moreContent.trim()) {
      setError("All fields are required");
      return;
    }

    const form = new FormData();
    form.append("title", title.trim());
    form.append("content", content.trim());
    form.append("moreContent", moreContent.trim());
    if (image) form.append("image", image);

    setLoading(true);
    setError(null);
    try {
      let response;
      const config = {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}` // Add if using auth
        }
      };

      if (editId) {
        response = await axios.put(
          `http://localhost:3001/api/admin/editNews/${editId}`,
          form,
          config
        );
      } else {
        response = await axios.post(
          `http://localhost:3001/api/admin/addNews`,
          form,
          config
        );
      }

      if (response.data.success) {
        alert(response.data.message || (editId ? "News updated successfully!" : "News added successfully!"));
        fetchNews();
        resetForm();
      } else {
        throw new Error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      setError(error.response?.data?.message || error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (news) => {
    setFormData({
      title: news.title,
      content: news.content,
      moreContent: news.moreContent,
    });
    setEditId(news._id);
    setFileName(news.image || "");
    setImage(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news item?")) return;
    
    setDeletingId(id);
    setError(null);
    try {
      const res = await axios.delete(
        `http://localhost:3001/api/admin/deleteNews/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}` // Add if using auth
          }
        }
      );

      if (res.data && res.data.success) {
        alert(res.data.message || "News deleted successfully");
        fetchNews();
      } else {
        throw new Error(res.data?.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.response?.data?.message || err.message || "Failed to delete news");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-4 gap-6">
  {/* Left: News List */}
  <div className="w-full md:w-1/2 bg-[#f8eeee] p-4 rounded shadow overflow-y-auto max-h-[80vh]">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">📰 News List</h2>
      <button
        onClick={fetchNews}
        className="text-[#0B2545] hover:text-[#0B2545] text-sm"
      >
        Refresh
      </button>
    </div>

    {newsList.length === 0 ? (
      <p className="text-gray-500">No news found.</p>
    ) : (
      <ul className="space-y-4">
        {newsList.map((news) => (
          <li
            key={news._id}
            className="border rounded p-4 hover:bg-gray-50 transition-all"
          >
            <h3 className="text-lg font-semibold">{news.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {news.content}
            </p>
            {news.image && (
              <p className="text-xs text-gray-500 mt-1 italic">
                Image: {news.image}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(news)}
                className="text-[#0B2545] hover:text-[#0B2545] px-3 py-1 border border-blue-200 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(news._id)}
                disabled={deletingId === news._id}
                className="text-red-600 hover:text-red-800 px-3 py-1 border border-red-200 rounded disabled:opacity-50"
              >
                {deletingId === news._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Right: News Form */}
  <div className="w-full md:w-1/2 bg-white p-6 rounded shadow space-y-4">
    <h2 className="text-xl font-bold mb-2">{editId ? "✏️ Edit News" : "➕ Add News"}</h2>

    {error && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        placeholder="News Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-3 border rounded"
      />

      <textarea
        name="content"
        placeholder="Short Description"
        value={formData.content}
        onChange={handleChange}
        className="w-full p-3 border rounded"
        rows="3"
      />

      <textarea
        name="moreContent"
        placeholder="Detailed Content"
        value={formData.moreContent}
        onChange={handleChange}
        className="w-full p-3 border rounded"
        rows="5"
      />

      <div>
        <label className="block mb-1 text-sm font-medium">News Image</label>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full file:bg-blue-50 file:text-blue-700 file:px-4 file:py-2 file:rounded hover:file:bg-blue-100"
        />
        {fileName && (
          <p className="text-xs text-gray-500 mt-1">
            {editId && !image ? "Current image: " : "Selected: "} {fileName}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-[#0B2545] text-white px-4 py-2 rounded hover:bg-[#0B2545] disabled:bg-blue-300"
        >
          {loading ? (editId ? "Updating..." : "Posting...") : (editId ? "Update News" : "Post News")}
        </button>
        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  </div>
</div>

  );
};

export default NewsManager;