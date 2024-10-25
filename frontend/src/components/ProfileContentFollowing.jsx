import React from 'react'
import { Link } from 'react-router-dom'

const ProfileContentFollowing = ({ userData }) => {
    return (
        <>
            {userData.following.length ? (
                <>
                    {userData?.following.map((user) => (
                        <div key={user._id} className="flex items-center justify-between p-3 gap-4 rounded-md shadow-md bg-white">
                            <Link to={`/profile/${user.username}`} className='flex items-center gap-4 w-full'>
                                <img src={user.profilePicture} className="size-14 rounded-full object-cover" />
                                <div>
                                    <p className="text-md font-semibold">{user.fullName}</p>
                                    <p className="text-xs text-[#5c6068]">/{user.username}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </>
            ) : (
                <div className='text-lg'>User don't have any following</div>
            )}

        </>
    )
}

export default ProfileContentFollowing