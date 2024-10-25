import React from 'react';
import { FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className='pt-4 pb-2 text-center space-y-4 bg-gray-800 '>
      <ul className='flex items-center justify-center gap-5'>
        <li>
          <a href="https://www.instagram.com/ishmimi_" target="_blank" rel="noopener noreferrer" className='flex items-center justify-center size-8 rounded-full bg-white hover:bg-gray-400'>
            <FaInstagram className='size-6' />
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/chris-victorio/" target="_blank" rel="noopener noreferrer" className='flex items-center justify-center size-8 rounded-full bg-white hover:bg-gray-400'>
            <FaLinkedinIn className='size-5' />
          </a>
        </li>
        <li>
          <a href="https://github.com/Ishmimi" target="_blank" rel="noopener noreferrer" className='flex items-center justify-center size-8 rounded-full bg-white hover:bg-gray-400'>
            <FaGithub className='size-6' />
          </a>
        </li>
      </ul>
      <p className='text-white'>© 2024 Chris Victorio. All rights reserved.</p>
    </div>
  );
};

export default Footer;
