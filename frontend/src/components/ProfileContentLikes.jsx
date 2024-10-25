import React from 'react'
import { Link } from 'react-router-dom'

const ProfileContentLikes = ({ userData }) => {
    return (
        <>
            {userData.likedPosts.length ? (
                <>
                    {userData?.likedPosts.map((likedPost) => (
                        <div key={likedPost._id} className='flex items-center justify-between p-3 rounded-md shadow-md bg-white'>
                            <div className='flex items-center gap-4'>
                                <img src={likedPost.image} className='rounded-md min-h-24 max-w-36 object-cover' />
                                <div>
                                    <p className='font-medium text-lg'>{likedPost.title}</p>
                                    <p className='text-sm text-[#667085]'>Created on: {new Date(likedPost.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className='space-x-4'>
                                <Link to={`/posts/${likedPost._id}`} className='rounded-md px-3 py-1 bg-slate-200 hover:bg-slate-300'>View Post</Link>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div className='text-lg'>User don't have any liked post</div>
            )}
        </>
    )
}

export default ProfileContentLikes