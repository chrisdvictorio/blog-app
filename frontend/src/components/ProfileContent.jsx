import React from 'react'

import ProfileContentPosts from './ProfileContentPosts'
import ProfileContentLikes from './ProfileContentLikes'
import ProfileContentSaved from './ProfileContentSaved'
import ProfileContentFollowing from './ProfileContentFollowing'
import ProfileContentFollowers from './ProfileContentFollowers'

const ProfileContent = ({ userData, activeCategory, isOwnProfile, deletePostMutation, removeFollowerMutation }) => {
    return (
        <>
            {activeCategory === "Posts" && <ProfileContentPosts userData={userData} isOwnProfile={isOwnProfile} deletePostMutation={deletePostMutation} />}
            {activeCategory === "Likes" && <ProfileContentLikes userData={userData} />}
            {activeCategory === "Saved" && <ProfileContentSaved userData={userData} />}
            {activeCategory === "Following" && <ProfileContentFollowing userData={userData} />}
            {activeCategory === "Followers" && <ProfileContentFollowers userData={userData} isOwnProfile={isOwnProfile} removeFollowerMutation={removeFollowerMutation} />}
        </>
    )
}

export default ProfileContent