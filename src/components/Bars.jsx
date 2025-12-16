import React from 'react'
import { MdRestaurantMenu } from "react-icons/md";
import { IoIosChatbubbles } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import { langText } from '../assets/constants/lang';
function Bars({setSelectedBar,selectedBar,lang}) {
  return (
    <div className="w-full lg:pe-40 mt-0 border-0 border-[#E5E5E5] border-b">
                <div className="flex w-full items-end">
                    <button onClick={()=>{setSelectedBar(0)}} className={`flex-1 pb-3 relative flex items-center justify-center gap-2 cursor-pointer after:w-full after:z-10 after:h-1 after:rounded-full after:absolute after:-bottom-1 after:bg-primary after:transition  ${selectedBar===0?'after:opacity-100':'after:opacity-0'}`}>
                        <MdRestaurantMenu className='md:text-3xl text-xl text-primary' />
                        <p>{langText.menu[lang]}</p>
                    </button>
                    <button onClick={()=>{setSelectedBar(1)}} className={`flex-1 pb-3 relative flex items-center justify-center gap-2 cursor-pointer after:w-full after:z-10 after:h-1 after:rounded-full after:absolute after:-bottom-1 after:bg-primary after:transition  ${selectedBar===1?'after:opacity-100':'after:opacity-0'}`}>
                        <IoIosChatbubbles className='md:text-3xl text-xl text-primary' />
                        <p>{langText.reviews[lang]}</p>
                    </button>
                    <button onClick={()=>{setSelectedBar(2)}} className={`flex-1 pb-3 relative flex items-center justify-center gap-2 cursor-pointer after:w-full after:z-10 after:h-1 after:rounded-full after:absolute after:-bottom-1 after:bg-primary after:transition  ${selectedBar===2?'after:opacity-100':'after:opacity-0'}`}>
                        <FaInfoCircle className='md:text-3xl text-xl text-primary' />
                        <p>{langText.info[lang]}</p>
                    </button>
                </div>
            </div>
  )
}

export default Bars
