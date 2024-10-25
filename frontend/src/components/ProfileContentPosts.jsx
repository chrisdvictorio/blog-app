import React from 'react'
import { Link } from 'react-router-dom'

const ProfileContentPosts = ({ userData, isOwnProfile, deletePostMutation }) => {
    return (
        <>
            {userData?.posts.length ? (
                <>
                    {userData?.posts.map((post) => (
                        <div key={post._id} className='flex items-center justify-between p-3 rounded-md shadow-md h-30 bg-white'>
                            <div className='flex items-center gap-4'>
                                <img src={post.image} className='rounded-md min-h-24 max-w-36 object-cover' />
                                <div>
                                    <p className='font-medium text-lg'>{post.title}</p>
                                    <p className='text-sm text-[#667085]'>Created on: {new Date(post.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className='space-x-2'>
                                <Link to={`/posts/${post._id}`} className='rounded-md px-3 py-1 bg-slate-200 hover:bg-slate-300'>View</Link>
                                {isOwnProfile && <>
                                    <Link to={`/posts/${post._id}/edit`} className='rounded-md px-3 py-1 bg-blue-200 hover:bg-blue-300'>Edit</Link>
                                    <button onClick={() => deletePostMutation(post._id)} className='rounded-md px-3 py-1 bg-red-200 hover:bg-red-300'>Delete</button>
                                </>}
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div className='text-lg'>User don't have any post</div>
            )}

        </>
    )
}

export default ProfileContentPosts