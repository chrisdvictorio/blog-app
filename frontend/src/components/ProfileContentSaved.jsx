import React from 'react'
import { Link } from 'react-router-dom'

const ProfileContentSaved = ({ userData }) => {
    return (
        <>
            {userData.savedPosts.length ? (
                <>
                    {userData?.savedPosts.map((post) => (
                        <div key={post._id} className='flex items-center justify-between p-3 rounded-md shadow-md bg-white'>
                            <div className='flex items-center gap-4'>
                                <img src={post.image} className='rounded-md min-h-24 max-w-36 object-cover' />
                                <div>
                                    <p className='font-medium text-lg'>{post.title}</p>
                                    <p className='text-sm text-[#667085]'>Created on: {new Date(post.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className='space-x-4'>
                                <Link to={`/posts/${post._id}`} className='rounded-md px-3 py-1 bg-slate-200 hover:bg-slate-300'>View Post</Link>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div className='text-lg'>You don't have any saved post</div>
            )}
        </>
    )
}

export default ProfileContentSaved