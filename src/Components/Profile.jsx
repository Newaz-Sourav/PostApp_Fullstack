import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Heart, Pencil, Trash2 } from "lucide-react";
import LikesModal from "./LikesModal";
import NewPost from "./NewPost";
import EditPostModal from "./EditPostModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import LoadingSkeleton from "./LoadingSkeleton";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [openLikes, setOpenLikes] = useState({ show: false, likers: [] });
  const [editModal, setEditModal] = useState({ show: false, post: null });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get("https://backend-postapp.onrender.com/profile", {
        withCredentials: true,
      });
      setLoggedInUserId(res.data.userid);
      setUserInfo({
        name: res.data.name,
        username: res.data.username,
        email: res.data.email,
      });
    } catch (err) {
      console.warn("Not logged in.");
      setLoggedInUserId(null);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://backend-postapp.onrender.com");
      if (loggedInUserId) {
        const userPosts = res.data.filter(
          (post) => post.user?._id === loggedInUserId
        );
        setPosts(userPosts);
      }
    } catch (err) {
      toast.error("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (loggedInUserId) {
      fetchPosts();
    }
  }, [loggedInUserId]);

  const handleLike = async (postId) => {
    try {
      await axios.get(`https://backend-postapp.onrender.com/like/${postId}`, {
        withCredentials: true,
      });
      fetchPosts();
    } catch (err) {
      toast.warning("⚠️ Please login first to Like a post");
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
      await axios.delete(
        `https://backend-postapp.onrender.com/delete/${selectedPostId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("🚫 You are not authorized to delete this post.");
      } else {
        toast.error("Failed to delete post.");
      }
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedPostId(null);
    }
  };

  return (
    <div className="pb-10 bg-gray-50 min-h-screen">
      {/* ✅ Profile Info */}
      {userInfo && (
  <div className="max-w-3xl mx-auto mt-10">
    <div className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl p-1">
      <div className="bg-white rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 font-bold rounded-full flex items-center justify-center text-3xl shadow-inner">
            {userInfo.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
              {userInfo.name}
            </h2>
            <p className="text-sm text-gray-500 mb-2">@{userInfo.username}</p>
            <p className="text-sm text-gray-600"><span className="font-medium">📧 Email:</span> {userInfo.email}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


      {/* ✅ New Post */}
      <NewPost onPostCreated={fetchPosts} />

      {/* ✅ Posts */}
      <div className="max-w-3xl mx-auto mt-8 px-4">
        {/* <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📣 Your Posts</h2> */}

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts found.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl border border-gray-200 transition duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {post.user?.name}
                    </h3>
                    <p className="text-sm text-gray-500">@{post.user?.username}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(post.date).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{post.content}</p>

                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-1 px-3 py-1 text-sm font-medium text-white rounded-full shadow 
                      ${
                        post.likes.some((u) => u._id === loggedInUserId)
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-pink-500 hover:bg-pink-600"
                      }`}
                  >
                    <Heart className="w-4 h-4" />
                    {post.likes.some((u) => u._id === loggedInUserId) ? "Liked" : "Like"}
                  </button>

                  <span className="text-sm text-gray-600">
                    {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
                  </span>

                  <button
                    onClick={() => setOpenLikes({ show: true, likers: post.likes })}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    See likes
                  </button>

                  {post.user?._id === loggedInUserId && (
                    <>
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-sm flex items-center gap-1 text-yellow-600 hover:underline"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => openDeleteModal(post._id)}
                        className="text-sm flex items-center gap-1 text-red-600 hover:underline"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Modals */}
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

export default Profile;
