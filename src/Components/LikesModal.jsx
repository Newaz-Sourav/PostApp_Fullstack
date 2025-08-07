const LikesModal = ({ isOpen, onClose, likers = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">❤️ Liked By</h2>
        <ul className="space-y-2">
          {likers.map((user) => (
            <li key={user._id} className="text-gray-800">
              <span className="font-medium">{user.name}</span>{" "}
              <span className="text-sm text-gray-500">@{user.username}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default LikesModal;
