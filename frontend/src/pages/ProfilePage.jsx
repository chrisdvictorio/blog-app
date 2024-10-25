import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import axiosInstance from "../api/axios";

import LoadingSpinner from "../components/LoadingSpinner";
import ProfileDetails from "../components/ProfileDetails";
import ProfileNavbar from "../components/ProfileNavbar";
import ProfileContent from "../components/ProfileContent";

const ProfilePage = () => {
  const { username, category } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: authUser, isLoading } = useQuery({ queryKey: ["authUser"] });

  const { data: userProfile, isLoading: isUserProfileLoading, isError, error } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/users/profile/${username.toLowerCase()}`)
      return res.data;
    }
  });

  const { mutate: deletePostMutation } = useMutation({
    mutationKey: ["deletePost"],
    mutationFn: async (postId) => {
      const res = await axiosInstance.delete(`/posts/${postId}/delete`)
      return res.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success(data.message || "Post Deleted.");
    },
    onError: (error) => {
      toast.error(error.response.data.error || "An error occured.");
    }
  })

  const { mutate: followUserMutation, isPending } = useMutation({
    mutationKey: ["followUserMutation"],
    mutationFn: async () => {
      const res = await axiosInstance.post(`/users/follow/${userProfile._id}`)
      return res.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success(data.message || "Followed Success.");
    },
    onError: (error) => {
      toast.error(error.response.data.error || "An error occured.");
    }
  });

  const { mutate: removeFollowerMutation } = useMutation({
    mutationKey: ["removeFollowerMutation"],
    mutationFn: async (followerId) => {
      const res = await axiosInstance.delete(`/users/profile/${authUser.username}/followers/remove/${followerId}`)
      return res.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success(data.message || "Follower Removed.");
    },
    onError: (error) => {
      toast.error(error.response.data.error || "An error occured.");
    }
  })

  const [activeCategory, setActiveCategory] = useState("Posts");

  useEffect(() => {
    if (category) {
      setActiveCategory(category.charAt(0).toUpperCase() + category.slice(1));
    } else {
      setActiveCategory("Posts");
    }
  }, [category])

  const handleCategoryClick = (category) => {
    if (category === "Posts") {
      navigate(`/profile/${username}`)
    } else {
      navigate(`/profile/${username}/${category.toLowerCase()}`);
    }
    setActiveCategory(category)
  };

  if (isLoading || isUserProfileLoading || isPending) return <LoadingSpinner />;

  if (isError) {
    if (error?.response?.status === 404) {
      queryClient.cancelQueries(["userProfile", username]);
      return <div className="flex flex-1 items-center justify-center text-xl">User not found.</div>;
    }
    return <div className="flex flex-1 items-center justify-center text-xl">An error occurred. Please try again later.</div>;
  }

  const isOwnProfile = authUser?.username === userProfile?.username;
  const userData = isOwnProfile ? authUser : userProfile;
  const isFollowing = authUser?.following.some(followingUser => followingUser?._id === userProfile?._id)

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-1 flex-col items-center py-8">
          <div className="w-1/2 space-y-4">
            <ProfileDetails userData={userData} followUserMutation={followUserMutation} isOwnProfile={isOwnProfile} isFollowing={isFollowing} />
            <ProfileNavbar activeCategory={activeCategory} handleCategoryClick={handleCategoryClick} isOwnProfile={isOwnProfile} />
            <ProfileContent userData={userData} activeCategory={activeCategory} isOwnProfile={isOwnProfile} deletePostMutation={deletePostMutation} removeFollowerMutation={removeFollowerMutation} />
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePage;
