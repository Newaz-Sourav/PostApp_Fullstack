import React from 'react'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PostList from './Components/postList.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Navbar from './Components/Navbar.jsx';
import Login from './Components/Login.jsx';
import Profile from './Components/Profile.jsx';

let router = createBrowserRouter([
  {
    path: "/",
    element: 
    <div>
      <Navbar />
    <PostList />
    </div>,
  },

  {
    path: "/login",
    element: 
    <div>
      <Navbar />
    <Login></Login>
    </div>,
  },

  {
    path: "/profile",
    element: 
    <div>
      <Navbar />
    <Profile />
    </div>,
  },
]);

function App() {
  

  return (
    <div>
     <RouterProvider router={router} />
     <ToastContainer />
    </div>
  )
}

export default App
