import React from 'react'
import { Link } from 'react-router-dom'

import { FaEdit } from "react-icons/fa";

import defaultUserProfile from "../assets/defaultUserProfile.png";

const ProfileDetails = ({ userData, followUserMutation, isOwnProfile, isFollowing }) => {
    return (
        <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <img src={userData?.profilePicture || defaultUserProfile} className="size-14 rounded-full object-cover" />
                <div>
                    <p className="text-lg font-semibold">{userData.fullName}</p>
                    <p className="text-sm text-[#5c6068]">/{userData.username}</p>
                </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center space-x-12">
                <div className="text-center font-medium">
                    <p className="text-sm">{userData?.posts?.length || 0}</p>
                    <p className="text-sm">{userData?.posts?.length ? ("posts") : ("post")}</p>
                </div>
                <div className="text-center font-medium">
                    <p className="text-sm">{userData?.following?.length || 0}</p>
                    <p className="text-sm">following</p>
                </div>
                <div className="text-center font-medium">
                    <p className="text-sm">{userData?.followers?.length || 0}</p>
                    <p className="text-sm">followers</p>
                </div>
            </div>
            {isOwnProfile ? (
                <Link to="/profile/update">
                    <FaEdit className="relative cursor-pointer text-2xl text-[#3B82F6]" />
                </Link>
            ) : (
                <button onClick={() => followUserMutation()} className="relative px-3 py-1 rounded-lg font-medium shadow-md bg-blue-200 hover:bg-blue-300">{isFollowing ? "Unfollow" : "Follow"}</button>
            )}
        </div>
    )
}

export default ProfileDetails