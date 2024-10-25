import React from 'react'

const ProfileNavbar = ({ activeCategory, handleCategoryClick, isOwnProfile }) => {

    return (
        <div className="space-y-4">
            <ul className="flex justify-start gap-8 border-b border-gray-300">
                <li onClick={() => handleCategoryClick("Posts")} className={`cursor-pointer rounded-full px-4 py-1 hover:underline ${activeCategory === "Posts" ? "bg-gray-300" : ""}`}>
                    Posts
                </li>
                <li onClick={() => handleCategoryClick("Likes")} className={`cursor-pointer rounded-full px-4 py-1 hover:underline ${activeCategory === "Likes" ? "bg-gray-300" : ""}`}>
                    Likes
                </li>
                {isOwnProfile && <li onClick={() => handleCategoryClick("Saved")} className={`cursor-pointer rounded-full px-4 py-1 hover:underline ${activeCategory === "Saved" ? "bg-gray-300" : ""}`}>
                    Saved
                </li>}
                <li onClick={() => handleCategoryClick("Following")} className={`cursor-pointer rounded-full px-4 py-1 hover:underline ${activeCategory === "Following" ? "bg-gray-300" : ""}`}>
                    Following
                </li>
                <li onClick={() => handleCategoryClick("Followers")} className={`cursor-pointer rounded-full px-4 py-1 hover:underline ${activeCategory === "Followers" ? "bg-gray-300" : ""}`}>
                    Followers
                </li>
            </ul>
        </div>
    )
}

export default ProfileNavbar