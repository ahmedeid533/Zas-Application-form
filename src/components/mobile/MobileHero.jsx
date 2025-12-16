import React from 'react'
import { langText } from '../../assets/constants/lang'
import { useLangStore } from '../../assets/store/langStore';
import { IoIosArrowForward } from "react-icons/io";
import { TbClockHour3 } from "react-icons/tb";
import { FaMotorcycle } from "react-icons/fa6";
import { IoStar } from "react-icons/io5";


function MobileHero() {
    const { lang } = useLangStore();
  return (
    <div className='h-65 relative'>
      <div className="h-5/8 bg-[url('/images/food.jpg')]  bg-cover bg-top relative after:absolute after:w-full after:h-full after:bg-[rgba(0,0,0,0.5)]"></div>
      <div className="h-3/8 bg-white"></div>
      <div className="absolute p-4 top-5/8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg border border-light-gray rounded-xl w-4/5  bg-white">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
            <div className="w-30">
                <img src="images/logo.png" alt="skyculinaire logo" className='w-full' />
            </div>
            {/* <div className="flex flex-col gap-0.5">
                <h1 className='text-md'>{langText.SkyCulinaire[lang]}</h1>
                <p className="text-gray text-xs">{langText.skyAddresses[lang]}</p>
                <p className="text-gray text-xs">{langText.kindOfFood[lang]}</p>

            </div> */}
        </div>

        <button className={`cursor-pointer text-primary ${lang=="AR"&&"rotate-180"}`}>
            <IoIosArrowForward className='text-2xl' />
        </button>

        
      </div>
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-1.5 text-sm">
            <span><TbClockHour3/></span>
            <p>{langText.deliveryTimeT[lang]}</p>
        </div>
        {/* <div className="flex items-center gap-1.5 text-sm">
            <span><FaMotorcycle/></span>
            <p>{langText.EGP80[lang]}</p>
        </div> */}
        <div className="flex items-center gap-1.5 text-sm">
            <span className='text-yellow-500'><IoStar/></span>
            <p>4.3 <span className="text-gray text-xs">(1,000+)</span></p>
        </div>
      </div>
      </div>
    </div>
  )
}

export default MobileHero
