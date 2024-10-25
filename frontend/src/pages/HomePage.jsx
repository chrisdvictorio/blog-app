import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import axiosInstance from "../api/axios";

import Navbar from "../components/Navbar";
import PostItem from "../components/PostItem";
import LoadingSpinner from "../components/LoadingSpinner";

const HomePage = () => {
  const { category } = useParams();
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    }
  });

  useEffect(() => {
    if (category) {
      setActiveCategory(category);
    } else {
      setActiveCategory("All");
    }
  }, [category]);

  const filteredPosts = activeCategory === "All" ? posts : posts.filter((post) => post.category === activeCategory);

  return (
    <>
      <Navbar activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-4 sm:px-8 lg:px-12">
            {filteredPosts.length === 0 ? (
              <p className="col-span-full text-center text-lg">No posts available</p>
            ) : (
              filteredPosts.map((post) => (
                <PostItem key={post._id} post={post} />
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
