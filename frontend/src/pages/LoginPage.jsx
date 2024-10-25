import React from "react";
import { Link } from "react-router-dom";

import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex flex-1 items-center justify-center gap-36">
      <div className="space-y-4">
        <p className="text-4xl font-semibold text-[#3B82F6]">PostHub</p>
        <p className="text-2xl">
          Explore, like, and save posts effortlessly. Connect with the <br></br>content that matters to you.
        </p>
      </div>
      <div className="space-y-4">
        <h2 className="text-center text-3xl text-[#3B82F6]">
          Login to your Account
        </h2>
        <div className="w-96 rounded-2xl bg-white p-6 shadow-2xl">
          <LoginForm />
        </div>
        <p className='text-center'>Don't have an account? <Link to='/signup' className='text-blue-900'>Sign Up</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
