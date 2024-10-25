import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { IoLogOut } from "react-icons/io5";
import { FcPlus } from "react-icons/fc";
import { CiLogin } from "react-icons/ci";
import { IoPersonAddOutline } from "react-icons/io5";

import axiosInstance from "../api/axios";

import titleLogo from "../assets/title.png"
import defaultUserProfile from "../assets/defaultUserProfile.png";

const Header = () => {
  const { data: authUser, isLoading } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    }
  });

  if (isLoading) return null;

  return (
    <div className="flex items-center justify-between bg-[#0F172A] px-4 py-4 sm:px-12 sm:py-6 text-white">
      <Link to="/">
        <img src={titleLogo} className="w-24 h-8 sm:w-28 sm:h-10 object-cover" />
      </Link>
      <div className="flex items-center gap-3 sm:gap-5">
        {authUser && (
          <Link to="/create" className="flex items-center justify-center py-1 px-3 gap-2 rounded-full bg-gray-800 hover:bg-[#3B82F6] text-sm sm:text-base">
            <FcPlus className="text-lg sm:text-xl" />
            <p>Create Post</p>
          </Link>
        )}

        {authUser && (
          <Link to={`/profile/${authUser.username}`} className="hover:brightness-125">
            <img
              src={authUser.profilePicture || defaultUserProfile}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md object-cover"
            />
          </Link>
        )}

        {authUser && (
          <button onClick={() => logout()} className="rounded-full">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 hover:bg-[#3B82F6]">
              <IoLogOut className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </button>
        )}

        {!authUser && (
          <Link to="/login" className="flex items-center justify-center py-1 px-3 gap-2 rounded-full bg-white text-black hover:bg-blue-300 text-sm sm:text-base">
            <CiLogin className="w-4 h-4 sm:w-5 sm:h-5" />
            <p>Login</p>
          </Link>
        )}

        {!authUser && (
          <Link to="/signup" className="flex items-center justify-center py-1 px-3 gap-2 rounded-full bg-gray-800 hover:bg-[#3B82F6] text-sm sm:text-base">
            <IoPersonAddOutline className="w-4 h-4 sm:w-5 sm:h-5" />
            <p>Sign Up</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
