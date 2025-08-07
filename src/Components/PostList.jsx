import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import LikesModal from "./LikesModal";
import NewPost from "./NewPost";
import EditPostModal from "./EditPostModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

// ✅ Custom Toast Config
const toastOptions = {
  position: "top-center",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

// 🟦 Skeleton Loader Component
const SkeletonPost = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.6 }}
    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse"
  >
    <div className="flex justify-between items-center mb-4">
      <div>
        <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
      </div>
      <div className="h-3 w-16 bg-gray-200 rounded"></div>
    </div>
    <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
    <div className="h-4 w-5/6 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
    <div className="mt-4 flex gap-3">
      <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
      <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
    </div>
  </motion.div>
);

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [openLikes, setOpenLikes] = useState({ show: false, likers: [] });
  const [editModal, setEditModal] = useState({ show: false, post: null });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("https://backend-postapp.onrender.com/profile", {
        withCredentials: true,
      });
      setLoggedInUserId(res.data.userid);
    } catch {
      setLoggedInUserId(null);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://backend-postapp.onrender.com");
      setPosts(res.data);
    } catch {
      toast.error("❌ Failed to load posts. Please try again later.", toastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.get(`https://backend-postapp.onrender.com/like/${postId}`, {
        withCredentials: true,
      });
      fetchPosts();
    } catch {
      toast.warning(
        "🔒 You must be logged in to like a post.",
        toastOptions
      );
    }
  };

  const handleEdit = (post) => {
    setEditModal({ show: true, post });
  };

  const openDeleteModal = (postId) => {
    setSelectedPostId(postId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`https://backend-postapp.onrender.com/delete/${selectedPostId}`, {
        withCredentials: true,
      });
      toast.success("✅ Post deleted successfully.", toastOptions);
      fetchPosts();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("🚫 You are not authorized to delete this post.", toastOptions);
      } else {
        toast.error("❌ Failed to delete post.", toastOptions);
      }
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedPostId(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <NewPost onPostCreated={fetchPosts} />

      <div className="max-w-3xl mx-auto mt-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="space-y-6"
        >
          {isLoading ? (
            <>
              <SkeletonPost />
              <SkeletonPost />
              <SkeletonPost />
            </>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4, type: "spring" }}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {post.user?.name}
                    </h3>
                    <p className="text-sm text-gray-500">@{post.user?.username}</p>
                  </div>
                  <span className="text-xs text-gray-400 italic">
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-700 text-base mb-5 leading-relaxed">
                  {post.content}
                </p>

                <div className="flex items-center gap-4 flex-wrap text-sm">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full shadow-sm text-white font-medium transition-all duration-300 
                      ${
                        post.likes.some((u) => u._id === loggedInUserId)
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-rose-500 hover:bg-rose-600"
                      }`}
                  >
                    <Heart className="w-4 h-4" />
                    {post.likes.some((u) => u._id === loggedInUserId)
                      ? "Liked"
                      : "Like"}
                  </motion.button>

                  <span className="text-gray-600">
                    ❤️ {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
                  </span>

                  <button
                    onClick={() => setOpenLikes({ show: true, likers: post.likes })}
                    className="text-blue-600 hover:underline transition"
                  >
                    See who liked
                  </button>

                  {post.user?._id === loggedInUserId && (
                    <>
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-yellow-600 flex items-center gap-1 hover:underline transition"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => openDeleteModal(post._id)}
                        className="text-red-600 flex items-center gap-1 hover:underline transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Modals */}
      <LikesModal
        isOpen={openLikes.show}
        likers={openLikes.likers}
        onClose={() => setOpenLikes({ show: false, likers: [] })}
      />

      <EditPostModal
        isOpen={editModal.show}
        post={editModal.post}
        onClose={() => setEditModal({ show: false, post: null })}
        onPostUpdated={fetchPosts}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default PostList;
