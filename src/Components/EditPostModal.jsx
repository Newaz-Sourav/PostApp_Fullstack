import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditPostModal = ({ isOpen, onClose, post, onPostUpdated }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (post) {
      setContent(post.content);
    }
  }, [post]);

  const handleUpdate = async () => {
    try {
      const res = await axios.post(
        `https://backend-postapp.onrender.com/update/${post._id}`,
        { content },
        { withCredentials: true }
      );

      toast.success("✅ Post updated successfully");
      onClose();
      onPostUpdated(); // Refresh posts
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("🚫 You can only edit your own post.");
      } else {
        toast.error("❌ Failed to update post.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-20 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Post</h2>
        <textarea
          rows="5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded p-2 text-gray-700"
        />
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
