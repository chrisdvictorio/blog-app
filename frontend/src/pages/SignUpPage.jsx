import React from 'react'
import { Link } from 'react-router-dom';

import SignUpForm from '../components/SignUpForm.jsx';

const SignUpPage = () => {
  return (
    <div className='flex flex-1 items-center justify-center gap-36'>
      <div className='space-y-4'>
        <p className='text-4xl font-semibold text-[#3B82F6]'>PostHub</p>
        <p className='text-2xl '>Explore, like, and save posts effortlessly. Connect with the <br></br>content that matters to you.</p>
      </div>
      <div className='space-y-4'>
        <h2 className='text-center text-3xl text-[#3B82F6]'>Create Your Account</h2>
        <div className='min-w-96 p-6 rounded-2xl shadow-2xl bg-white'>
          <SignUpForm />
        </div>
        <p className='text-center'>Already have an account? <Link to='/login' className='text-blue-900'>Login</Link></p>
      </div>
    </div>
  )
}

export default SignUpPage