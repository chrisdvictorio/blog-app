import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'

import axiosInstance from './api/axios'

import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ErrorPage from './pages/ErrorPage'
import CreatePost from './pages/CreatePost'
import ProfilePage from './pages/ProfilePage'
import UpdateProfile from './pages/UpdateProfile'
import PostDetail from './pages/PostDetail'
import EditPost from './pages/EditPost'

const App = () => {

  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 401 || 404) {
          return null;
        };
        toast.error(error.response.data.error || "An error occured.");
      }
    }
  });

  if (isLoading) return null;

  return (
    <div className='flex flex-col min-h-screen bg-[#F1F0F3]'>
      <Header />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/create' element={authUser ? <CreatePost /> : <Navigate to="/login" />} />
        <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path='/profile/:username/:category' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path='/profile/update' element={authUser ? <UpdateProfile /> : <Navigate to="/login" />} />
        <Route path='/posts/:id' element={authUser ? <PostDetail /> : <Navigate to="/login" />} />
        <Route path='/posts/:id/edit' element={authUser ? <EditPost /> : <Navigate to="/login" />} />
        <Route path='/*' element={<ErrorPage />} />
      </Routes>
      <Toaster />
      <Footer />
    </div>
  )
}

export default App