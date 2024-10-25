import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FaRegBookmark, FaBookmark, FaRegHeart, FaHeart } from "react-icons/fa";
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../api/axios'
import { toast } from 'react-hot-toast'

const PostDetail = () => {

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

    const { id } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const { data: postDetail, isLoading } = useQuery({
        queryKey: ["postDetail"],
        queryFn: async () => {
            const res = await axiosInstance.get(`/posts/${id}`);
            return res.data;
        }
    })

    const { mutate: likePostMutation } = useMutation({
        mutationKey: ["likePostMutation"],
        mutationFn: async () => {
            const res = await axiosInstance.post(`/posts/like/${postDetail._id}`)
            return res.data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            queryClient.invalidateQueries({ queryKey: ["postDetail"] });
            toast.success(data.message || "Post liked.");
        },
        onError: (error) => {
            toast.error(error.data.response.error);
        }
    })

    const { mutate: savePostMutation } = useMutation({
        mutationKey: ["savePostMutation"],
        mutationFn: async () => {
            const res = await axiosInstance.post(`/posts/save/${postDetail._id}`)
            return res.data
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            queryClient.invalidateQueries({ queryKey: ["postDetail"] });
            toast.success(data.message || "Post saved.");
        },
        onError: (error) => {
            toast.error(error.data.response.error);
        }
    })

    const isLiked = postDetail?.likedBy?.includes(authUser?._id);
    const isSaved = postDetail?.savedBy?.includes(authUser?._id);

    if (isLoading) return null

    return (
        <div className='flex flex-1 justify-center p-5'>
            <div className='flex flex-col justify-between rounded-2xl p-5 shadow-md border max-w-[36rem] gap-4 bg-white'>
                <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex gap-4'>
                            <Link to={`/profile/${postDetail?.author?.username}`}><img src={postDetail?.author?.profilePicture} className='size-11 rounded-full object-cover' /></Link>
                            <div>
                                <Link to={`/profile/${postDetail?.author?.username}`}><p className='font-semibold'>{postDetail?.author?.username}</p></Link>
                                <p className='text-sm text-[#667085]'>{new Date(postDetail?.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className={`flex items-center px-4 rounded-2xl ${categoryColors[postDetail?.category]}`}>
                            <p className='font-semibold text-sm'>{postDetail?.category}</p>
                        </div>
                    </div>
                    <h2 className='text-2xl font-bold text-[#101828]'>{postDetail?.title}</h2>
                    <img src={postDetail?.image} className='object-cover w-full' />
                    <p>{postDetail?.body}</p>
                </div>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-2'>
                        {isLiked ? (
                            <button onClick={authUser ? () => likePostMutation() : () => { navigate("/login") }}><FaHeart className='text-xl text-red-600' /></button>

                        ) : (
                            <button onClick={authUser ? () => likePostMutation() : () => { navigate("/login") }}><FaRegHeart className='text-xl' /></button>
                        )}
                        <p>Total Likes: {postDetail?.likedBy?.length || 0}</p>
                    </div>


                    {isSaved ? (
                        <button onClick={authUser ? () => savePostMutation() : () => { navigate("/login") }}><FaBookmark className='text-xl text-gray-600' /></button>

                    ) : (
                        <button onClick={authUser ? () => savePostMutation() : () => { navigate("/login") }}><FaRegBookmark className='text-xl' /></button>
                    )}
                </div>
            </div>
        </div >
    )
}

export default PostDetail