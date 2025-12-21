import React, { useEffect, useRef } from 'react'
import { useScreenViewStore } from '../store/screenViewStore';
import { IoIosMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Footer() {
  const ref =useRef(null);
  const {setFooterHeight}=useScreenViewStore();
  const navigate=useNavigate();
  
  //  VIP Catering | Food Menus | In-Flight Meals | Menu Request | Contact | Privacy Policy | Terms of Use
  const links = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "About",
      path: "/about-us",
    },
    {
      name: "VIP Catering",
      path: "/private-jet-aircatering-cairo",
    },
    {
      name: "Food Menus",
      path: "/menu",
    },
    {
      name: "In-Flight Meals",
      path: "/inflight-meal-catering-egypt",
    },
    {
      name: "Menu Request",
      path: "/request",
    },
    {
      name: "Contact",
      path: "/air-catering-cairo-contact",
    },
    {
      name: "Privacy Policy",
      path: "/privacy-policy",
    },
    {
      name: "Terms of Use",
      path: "/website-terms",
    },
    
  ]

    useEffect(() => {
      console.log("navbar height",ref.current.offsetHeight);
      
      setFooterHeight(ref.current.offsetHeight);
      }, [ref]);
  return (
    <div ref={ref} className="bg-[#201F1F] px-20 py-20">
      <div className="flex flex-col md:flex-row justify-between gap-9">
        <div className="text-white">
          <div className="flex items-center gap-3">
            <IoIosMail className="text-primary text-3xl" />{" "}
            <p>sales@skyculinaire.com</p>
          </div>
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-2">
              <FaPhoneAlt className="text-primary text-2xl" />{" "}
              <p> +20 1066668178</p>
            </div>
            <p> (+202) 22693134/ 22693135/ 22693136</p>
          </div>
        </div>
        <div className="">
          <p className="text-center text-white text-xl mb-4">Follow Our Socials</p>
          <div className="flex items-center justify-center gap-8">
            <a href="https://www.facebook.com/profile.php?id=100063803803378" className='text-primary text-3xl hover:text-white transition-all duration-300'>
              <FaFacebook className="" />
            </a>
            <a href="#" className='text-primary text-3xl hover:text-white transition-all duration-300'>
              <FaInstagram className="" />
            </a>
            <a href="https://www.linkedin.com/company/z-aviation-services-zas" className='text-primary text-3xl hover:text-white transition-all duration-300'>
              <FaLinkedin className="" />
            </a>
          </div>
        </div>
        <div className="flex justify-center h-20 gap-5">
          <img src="images/catering-certification-ISO-22000-skyculinaire.png" className='h-full' alt="" />
          <img src="images/EGAC-accredtied-sky-culinaire-aviation-catering.png" className='h-full' alt="" />
          <img src="images/International-Accreditation-Forum-skyculinaire.png" className='h-full' alt="" />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-12">
        {links.map((link, index) => (
          <>
          <p
            key={index}
            className="text-primary cursor-pointer"
            onClick={() => navigate(link.path)}
            >
            {link.name}
          </p>
          {index !== links.length - 1 && <span className='text-primary'>|</span>}
            </>
        ))}
      </div>
    </div>
  );
}

export default Footer
