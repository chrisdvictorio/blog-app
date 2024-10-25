import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoPersonAddOutline } from "react-icons/io5";
import { FaSpinner } from "react-icons/fa";

import axiosInstance from "../api/axios.js"


const SignUpForm = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: signUpMutation, isPending } = useMutation({
        mutationFn: async (data) => {
            const res = await axiosInstance.post("/auth/signup", data)
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            toast.success(data.message || "Account created successfully.");
            navigate('/')
        },
        onError: (error) => {
            toast.error(error.response.data.error || "An error occured.");
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        const { fullName, username, email, password, confirmPassword } = formData;

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return; // Stop the form submission
        }

        // Call the mutation with the form data excluding confirmPassword
        signUpMutation({ fullName, username, email, password });
    }

    return (
        <>
            {isPending ? (
                <div className='flex flex-1 items-center justify-center'>
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <FaSpinner className='size-10 animate-spin text-blue-500' />
                        <p className='text-xl'>Creating Account...</p>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} autoComplete='off' className='space-y-4'>
                    <div>
                        <label htmlFor='fullName' className='text-sm'>Full Name</label>
                        <div className='relative'>
                            <FaRegUser className='absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 ' />
                            <input
                                id='fullName'
                                type='text'
                                required
                                placeholder='Full Name'
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className='w-full block px-9 py-2 rounded-md border text-sm'
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor='username' className='text-sm'>Username</label>
                        <div className='relative'>
                            <FaRegUser className='absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 ' />
                            <input
                                id='username'
                                type='text'
                                required
                                placeholder='username'
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className='w-full block px-9 py-2 rounded-md border text-sm'
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor='email' className='text-sm'>Email</label>
                        <div className='relative'>
                            <MdOutlineMailOutline className='absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 ' />
                            <input
                                id='email'
                                type='email'
                                required
                                placeholder='you@email.com'
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className='w-full block px-9 py-2 rounded-md border text-sm'
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor='password' className='text-sm'>Password</label>
                        <div className='relative'>
                            <RiLockPasswordLine className='absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 ' />
                            <input
                                id='password'
                                type='password'
                                required
                                placeholder='******'
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className='w-full block px-9 py-2 rounded-md border text-sm'
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor='confirmPassword' className='text-sm'>Confirm Password</label>
                        <div className='relative'>
                            <RiLockPasswordLine className='absolute top-1/2 left-5 transform -translate-x-1/2 -translate-y-1/2 ' />
                            <input
                                id='confirmPassword'
                                type='password'
                                required
                                placeholder='******'
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className='w-full block px-9 py-2 rounded-md border text-sm'
                            />
                        </div>
                    </div>
                    <button type='submit' className='py-2 w-full rounded-md shadow-md bg-green-300 hover:bg-green-400'>
                        <div className='flex items-center justify-center gap-2'>
                            <IoPersonAddOutline className='size-5' />
                            <p>Sign Up</p>
                        </div>
                    </button>
                </form >
            )}
        </>
    )
}

export default SignUpForm