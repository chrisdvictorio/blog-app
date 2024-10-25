import React from 'react'
import { Link } from 'react-router-dom'

const ProfileContentFollowers = ({ userData, isOwnProfile, removeFollowerMutation }) => {

    return (
        <>
            {userData.followers.length ? (
                <>
                    {userData?.followers.map((follower) => (
                        <div key={follower._id} className="flex items-center justify-between p-3 gap-4 rounded-md shadow-md bg-white">
                            <Link to={`/profile/${follower.username}`} className='flex items-center gap-4 w-full'>
                                <img src={follower.profilePicture} className="size-14 rounded-full object-cover" />
                                <div>
                                    <p className="text-md font-semibold">{follower.fullName}</p>
                                    <p className="text-xs text-[#5c6068]">/{follower.username}</p>
                                </div>
                            </Link>
                            {isOwnProfile && <button onClick={() => removeFollowerMutation(follower._id)} className='relative rounded-md px-3 py-1 bg-red-200 hover:bg-red-300'>Remove</button>}

                        </div>
                    ))}
                </>
            ) : (
                <div className='text-lg'>User don't have any follower</div>
            )}
        </>
    )
}

export default ProfileContentFollowers