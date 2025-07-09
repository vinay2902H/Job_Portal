import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import ChatbotFrame from './Chat';
const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate(`/browse?search=${encodeURIComponent(query)}`); // Pass via query param
  };

  return (
    <div className='text-center'>
      <div className='flex flex-col gap-5 my-10'>
       
        <h1 className='text-5xl font-bold'>Search, Apply & <br /> Get Your Dream Jobs</h1>
        

        <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
          <input
            type="text"
            placeholder='Find your dream jobs'
            onChange={(e) => setQuery(e.target.value)}
            className='outline-none border-none w-full'
          />
          <ChatbotFrame/>
          <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2]">
            <Search className='h-5 w-5' />
          </Button>
        </div>
      </div>
    </div>
  )
};

export default HeroSection;
