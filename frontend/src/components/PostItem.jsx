import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { FaRegBookmark, FaBookmark, FaRegHeart, FaHeart } from "react-icons/fa";

import axiosInstance from '../api/axios';

import defaultUserProfile from "../assets/defaultUserProfile.png";

const categoryColors = {
    Education: 'bg-blue-200',
    Entertainment: 'bg-yellow-200',
    Finance: 'bg-green-200',
    'Food & Drink': 'bg-red-200',
    Health: 'bg-purple-200',
    Lifestyle: 'bg-pink-200',
    Technology: 'bg-orange-200',
    Travel: 'bg-teal-200',
};

const PostItem = ({ post }) => {

    const { data: authUser } = useQuery({ queryKey: ["authUser"] })

    const queryClient = useQueryClient();

    const { mutate: likePostMutation } = useMutation({
        mutationKey: ["likePostMutation"],
        mutationFn: async () => {
            const res = await axiosInstance.post(`/posts/like/${post._id}`)
            return res.data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success(data.message || "Post liked.");
        },
        onError: (error) => {
            toast.error(error.data.response.error);
        }
    })

    const { mutate: savePostMutation } = useMutation({
        mutationKey: ["savePostMutation"],
        mutationFn: async () => {
            const res = await axiosInstance.post(`/posts/save/${post._id}`)
            return res.data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success(data.message || "Post saved.");
        },
        onError: (error) => {
            toast.error(error.data.response.error);
        }
    })

    const isLiked = post.likedBy.includes(authUser?._id);
    const isSaved = post.savedBy.includes(authUser?._id);
    const navigate = useNavigate();

    return (
        <div className='flex flex-col justify-between rounded-2xl space-y-4 shadow-md border bg-white'>
            <div>
                <div className='flex items-center justify-between p-5'>
                    <div className='flex items-center gap-4'>
                        <Link to={`profile/${post.author?.username}`}>
                            <img src={post.author?.profilePicture || defaultUserProfile} className='size-11 rounded-full object-cover' />
                        </Link>
                        <div>
                            <Link to={`profile/${post.author?.username}`} className='text-sm font-semibold'>{post.author?.username}</Link>
                            <p className='text-sm text-[#667085]'>Posted: {new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    {isSaved ? (
                        <button onClick={authUser ? () => savePostMutation() : () => { navigate("/login") }}><FaBookmark className='text-xl text-gray-600' /></button>

                    ) : (
                        <button onClick={authUser ? () => savePostMutation() : () => { navigate("/login") }}><FaRegBookmark className='text-xl' /></button>
                    )}
                </div>
                <div className='space-y-4'>
                    <Link to={`/posts/${post._id}`}><img src={post.image} className='object-cover min-w-full h-72' /></Link>
                    <div className='pl-5 pr-5'>
                        <Link to={`/posts/${post._id}`}>
                            <h2 className='text-xl font-bold text-[#101828] '>{post.title}</h2>
                            <p className='text-[#667085]'>{post.body}</p>
                        </Link>
                    </div>
                </div>
            </div>
            <div className='flex justify-between pb-5 pl-5 pr-5'>
                <div className='flex items-center gap-2'>
                    {isLiked ? (
                        <button onClick={authUser ? () => likePostMutation() : () => { navigate("/login") }}><FaHeart className='text-xl text-red-600' /></button>

                    ) : (
                        <button onClick={authUser ? () => likePostMutation() : () => { navigate("/login") }}><FaRegHeart className='text-xl' /></button>
                    )}
                    <p className='text-sm'>{post.likedBy?.length ? (`(${post.likedBy.length})`) : ""}</p>
                </div>
                <div className={`flex items-center px-4 rounded-2xl ${categoryColors[post.category]}`}>
                    <p className='font-semibold text-sm'>{post.category}</p>
                </div>
            </div>
        </div >
    )
}

export default PostItem