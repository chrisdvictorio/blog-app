import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "react-hot-toast";
import { useParams } from 'react-router-dom';

import { IoMdAdd } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";

import axiosInstance from '../api/axios';

const categories = ["Education", "Entertainment", "Finance", "Food & Drink", "Health", "Lifestyle", "Technology", "Travel"]

const EditPost = () => {

    const { id } = useParams();

    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");

    const queryClient = useQueryClient();

    const { mutate: editPostMutation, isPending } = useMutation({
        mutationKey: ["editPostMutation"],
        mutationFn: async (postData) => {
            const res = await axiosInstance.patch(`posts/${id}/edit`, postData)
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success(data.message || "Post edited successfully.");
        },
        onError: (error) => {
            console.error("Error creating post:", error);
            toast.error(error.response.data.error || "An error occured");
        }
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setImage(reader.result);
            };

            reader.readAsDataURL(file); //base64 format
        };
    };

    const resetForm = () => {
        setCategory("");
        setTitle("");
        setBody("");
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        resetForm();
        editPostMutation({ category, title, body, image });
    }

    return (
        <>
            {isPending ? (
                <div className='flex flex-1 items-center justify-center'>
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <FaSpinner className='size-10 animate-spin text-blue-500' />
                        <p className='text-xl'>Editing Post...</p>
                    </div>
                </div>
            ) : (
                <div className='flex flex-1 items-center justify-center'>
                    <div className='w-[36rem] p-6 rounded-2xl shadow-2xl bg-white space-y-4'>
                        <h2 className='text-3xl text-[#3B82F6]'>Edit Post</h2>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div>
                                <label htmlFor='category' className='text-sm'>Category</label>
                                <select
                                    id='category'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className='w-full block px-2 py-2 rounded-md border text-sm'
                                >
                                    <option value=''>Select a Category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option >
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor='title' className='text-sm'>Title</label>
                                <input
                                    id='title'
                                    type='text'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className='w-full block px-2 py-2 rounded-md border text-sm'
                                />
                            </div>
                            <div>
                                <label htmlFor='body' className='text-sm'>Body</label>
                                <textarea
                                    id='body'
                                    rows='3'
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className='w-full block px-2 py-2 rounded-md border text-sm'
                                />
                            </div>
                            <div>
                                <label htmlFor='image' className='text-sm'>Post Image</label>
                                <input
                                    id='image'
                                    type='file'
                                    accept='image/*'
                                    onChange={handleImageChange}
                                    className='w-full block px-2 py-2 rounded-md border text-sm'
                                />
                            </div>
                            <button type='submit' className='py-2 w-full rounded-md shadow-md bg-green-300 hover:bg-green-400'>
                                <div className='flex items-center justify-center gap-2'>
                                    <IoMdAdd className='size-5' />
                                    <p>Edit Post</p>
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default EditPost