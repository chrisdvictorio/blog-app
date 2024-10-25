import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiLogin } from "react-icons/ci";
import { FaSpinner } from "react-icons/fa";

import axiosInstance from "../api/axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();

  const { mutate: loginMutation, isLoading } = useMutation({
    mutationFn: async (userData) => {
      const res = await axiosInstance.post("auth/login", userData);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data.message || "Logged in successfully.");
    },
    onError: (error) => {
      toast.error(error.response.data.error || "An error occured.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="text-sm">
          Email
        </label>
        <div className="relative">
          <MdOutlineMailOutline className="absolute left-5 top-1/2 -translate-x-1/2 -translate-y-1/2 transform" />
          <input
            id="email"
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full rounded-md border px-9 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="text-sm">
          Password
        </label>
        <div className="relative">
          <RiLockPasswordLine className="absolute left-5 top-1/2 -translate-x-1/2 -translate-y-1/2 transform" />
          <input
            id="password"
            type="password"
            required
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full rounded-md border px-9 py-2 text-sm"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-green-300 py-2 shadow-md hover:bg-green-400"
      >
        <div className="flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              <p>Loading...</p>
            </>
          ) : (
            <>
              <CiLogin className="size-5" />
              <p>Login</p>
            </>
          )}
        </div>
      </button>
    </form>
  );
};

export default LoginForm;
