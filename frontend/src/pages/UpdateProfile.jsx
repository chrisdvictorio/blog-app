import React, { useState } from 'react'

import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';

import { FaSpinner } from "react-icons/fa";

const UpdateProfile = () => {

  const [newUser, setNewUser] = useState({
    fullName: "",
    username: "",
    profilePicture: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewUser({ ...newUser, profilePicture: reader.result });
      };

      reader.readAsDataURL(file); //base64 format
    };
  };

  const queryClient = useQueryClient();

  const { mutate: updateProfileMutation, isPending } = useMutation({
    mutationFn: async (userData) => {
      const res = await axiosInstance.patch("/users/update", userData);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data.message || "Profile updated successfully.");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "An error occured.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const { fullName, username, email, profilePicture, currentPassword, newPassword, confirmNewPassword } = newUser;

    if (newPassword !== confirmNewPassword) {
      return toast.error("Password do not match.")
    }

    const userData = {
      fullName,
      username,
      email,
      profilePicture,
      currentPassword,
      newPassword, // Send the new password if it's provided
    };

    updateProfileMutation(userData);
  }


  return (
    <>
      {isPending ? (
        <div className='flex flex-1 items-center justify-center'>
          <div className='flex flex-col items-center justify-center gap-4'>
            <FaSpinner className='size-10 animate-spin text-blue-500' />
            <p className='text-xl'>Updating Profile...</p>
          </div>
        </div>
      ) : (
        <div className='flex flex-col flex-1 items-center justify-center py-8'>
          <div className='w-[36rem] p-6 rounded-2xl shadow-2xl bg-white space-y-4'>
            <h2 className='text-3xl text-[#3B82F6]'>Update Your Profile</h2>
            <form onSubmit={handleSubmit} autoComplete='off' className='space-y-4'>
              <div>
                <label htmlFor='fullName' className='text-sm'>Full Name</label>
                <div className='relative'>
                  <FaRegUser className='absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 ' />
                  <input
                    id='fullName'
                    type='text'
                    placeholder="Full Name"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                    className='w-full block px-9 py-2 rounded-md border text-sm'
                  />
                </div>
              </div>
              <div>
                <label htmlFor='username' className='text-sm'>Username</label>
                <div className='relative'>
                  <FaRegUser className='absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 ' />
                  <input
                    id='username'
                    type='text'
                    placeholder='username'
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className='w-full block px-9 py-2 rounded-md border text-sm'
                  />
                </div>
              </div>
              <div>
                <label htmlFor='email' className='text-sm'>Email</label>
                <div className='relative'>
                  <MdOutlineMailOutline className='absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 ' />
                  <input
                    id='email'
                    type='email'
                    placeholder='you@email.com'
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className='w-full block px-9 py-2 rounded-md border text-sm'
                  />
                </div>
              </div>
              <div>
                <label htmlFor='currentPassword' className='text-sm'>Current Password</label>
                <div className='relative'>
                  <RiLockPasswordLine className='absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 ' />
                  <input
                    id='currentPassword'
                    type='password'
                    placeholder='******'
                    value={newUser.currentPassword}
                    onChange={(e) => setNewUser({ ...newUser, currentPassword: e.target.value })}
                    className='w-full block px-9 py-2 rounded-md border text-sm'
                  />
                </div>
              </div>
              <div>
                <label htmlFor='newPassword' className='text-sm'>New Password</label>
                <div className='relative'>
                  <RiLockPasswordLine className='absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 ' />
                  <input
                    id='newPassword'
                    type='password'
                    placeholder='******'
                    value={newUser.newPassword}
                    onChange={(e) => setNewUser({ ...newUser, newPassword: e.target.value })}
                    className='w-full block px-9 py-2 rounded-md border text-sm'
                  />
                </div>
              </div>
              <div>
                <label htmlFor='confirmNewPassword' className='text-sm'>Confirm New Password</label>
                <div className='relative'>
                  <RiLockPasswordLine className='absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 ' />
                  <input
                    id='confirmNewPassword'
                    type='password'
                    placeholder='******'
                    value={newUser.confirmNewPassword}
                    onChange={(e) => setNewUser({ ...newUser, confirmNewPassword: e.target.value })}
                    className='w-full block px-9 py-2 rounded-md border text-sm'
                  />
                </div>
              </div>
              <div>
                <label htmlFor='profilePicture' className='text-sm'>Profile Picture</label>
                <input
                  id='profilePicture'
                  type='file'
                  accept='image/*'
                  onChange={handleImageChange}
                  className='w-full block px-2 py-2 rounded-md border text-sm'
                />
              </div>
              <button type='submit' className='py-2 w-full rounded-md shadow-md bg-green-300 hover:bg-green-400'>
                <div className='flex items-center justify-center gap-2'>
                  <FaEdit className='size-5' />
                  <p>Update Profile</p>
                </div>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default UpdateProfile