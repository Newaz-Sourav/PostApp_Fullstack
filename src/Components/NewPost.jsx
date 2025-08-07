import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { SendHorizonal } from "lucide-react";
import { motion } from "framer-motion";

const NewPost = ({ onPostCreated }) => {
  const [content, setContent] = useState("");

  const showToast = (type, message) => {
    toast[type](message, {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      showToast("warning", "✍️ Please write something before posting.");
      return;
    }

    try {
      await axios.post(
        "https://backend-postapp.onrender.com/post",
        { content },
        { withCredentials: true }
      );
      showToast("success", "✅ Post uploaded successfully!");
      setContent("");
      onPostCreated();
    } catch (err) {
      showToast("error", "❌ Failed to create post. Please log in first.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center gap-2">
        <span className="text-indigo-600 text-3xl">📝</span> 
        Share your thoughts
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full min-h-[120px] p-4 text-gray-800 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 italic">
            Let the world know what you're thinking!
          </p>
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-full transition duration-200"
          >
            <SendHorizonal size={18} />
            Post
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default NewPost;
