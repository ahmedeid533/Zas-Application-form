import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScreenViewStore } from "../store/screenViewStore";
import { HiBars3 } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";


function Navbar() {
  const {setNavBarHeight}=useScreenViewStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBgActive, setIsBgActive] = useState(false);
  const ref =useRef(null);
  const navigate = useNavigate();
  const go = (path) => {
    navigate(path);
  };

  useEffect(() => {
    console.log("navbar height",ref.current.offsetHeight);
    setNavBarHeight(ref.current.offsetHeight);
    }, [ref]);

    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    });

useEffect(() => {
  if (isMenuOpen) {
    const timer = setTimeout(() => {
      setIsBgActive(true);
    }, 200); // التأخير هنا (ms)

    return () => clearTimeout(timer);
  } else {
    setIsBgActive(false);
  }
}, [isMenuOpen]);


  return (
    <nav
      ref={ref}
      className={`bg-secondary fixed transition-all duration-300  z-40  w-full ${isScrolled?"h-16":"h-24"} `}
    >
      <div className="px-4 h-full mx-auto ">
        <div className="flex items-center h-full justify-center lg:justify-between px-6 md:px-16 py-3 relative">
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer lg:hidden text-primary" onClick={() => setIsMenuOpen(true)}><HiBars3 className="text-3xl"/></button>
          <div className="flex items-center h-full gap-4">
            <a
              onClick={() => {
                navigate("/");
              }}
              className="h-full cursor-pointer group relative "
            >
              <img src="/images/login-logo.png" className="h-full" alt="logo" />
            </a>
          </div>

          <div className="lg:flex items-center justify-end gap-14 hidden">
<a className={`
  relative text-white ${isScrolled&&"text-sm"}
  after:content-['']
  after:absolute after:-bottom-1 after:left-0
  after:w-full after:h-0.5 after:bg-primary
  after:scale-x-0 after:origin-right
  after:transition-transform after:duration-300
  hover:after:scale-x-100 hover:after:origin-left
  transition-colors hover:text-primary cursor-pointer
`} onClick={()=>{navigate("/")}}>
  HOME
</a>
<a className={`
  relative text-white ${isScrolled&&"text-sm"}
  after:content-['']
  after:absolute after:-bottom-1 after:left-0
  after:w-full after:h-0.5 after:bg-primary
  after:scale-x-0 after:origin-right
  after:transition-transform after:duration-300
  hover:after:scale-x-100 hover:after:origin-left
  transition-colors hover:text-primary cursor-pointer
`} onClick={()=>{navigate("/private-jet-aircatering-cairo")}}>
   CATERING
</a><a className={`
  relative text-white ${isScrolled&&"text-sm"}
  after:content-['']
  after:absolute after:-bottom-1 after:left-0
  after:w-full after:h-0.5 after:bg-primary
  after:scale-x-0 after:origin-right
  after:transition-transform after:duration-300
  hover:after:scale-x-100 hover:after:origin-left
  transition-colors hover:text-primary cursor-pointer
`} onClick={() => {
    navigate("/");
    setTimeout(() => {
      const el = document.getElementById("work");
      el?.scrollIntoView( { behavior: "smooth"});
    }, 100);
  }}>
   CUISINE 
</a><a className={`
  relative text-white ${isScrolled&&"text-sm"}
  after:content-['']
  after:absolute after:-bottom-1 after:left-0
  after:w-full after:h-0.5 after:bg-primary
  after:scale-x-0 after:origin-right
  after:transition-transform after:duration-300
  hover:after:scale-x-100 hover:after:origin-left
  transition-colors hover:text-primary cursor-pointer
`} onClick={()=>{navigate("/inflight-meal-catering-egypt")}}>
   IN-FLIGHT MEALS
</a><a className={`
  relative text-white ${isScrolled&&"text-sm"}
  after:content-['']
  after:absolute after:-bottom-1 after:left-0
  after:w-full after:h-0.5 after:bg-primary
  after:scale-x-0 after:origin-right
  after:transition-transform after:duration-300
  hover:after:scale-x-100 hover:after:origin-left
  transition-colors  hover:text-primary cursor-pointer
`} onClick={()=>{navigate("/air-catering-cairo-contact")}}>
   CONTACT
</a>
<a className={`
  relative text-white ${isScrolled&&"text-sm"}
  after:content-['']
  after:absolute after:-bottom-1 after:left-0
  after:w-full after:h-0.5 after:bg-primary
  after:scale-x-0 after:origin-right
  after:transition-transform after:duration-300
  hover:after:scale-x-100 hover:after:origin-left
  transition-colors  hover:text-primary cursor-pointer
`} onClick={()=>{navigate("/job-application")}}>
   JOIN US
</a>
<button className="global-btn btn-secondary" onClick={()=>{navigate("/login")}}>login</button>
<button className="global-btn btn-primary" onClick={()=>{navigate("/menu")}}>food menu</button>
        </div>
          </div>
          </div>
          <div  className={`fixed h-screen w-screen   z-40 top-0  transition-all  duration-500 menu ${isMenuOpen?"right-0 ":"right-full"} ${isBgActive?"bg-[#00000040]":"bg-transparent"}`}>

          <div className="  w-125 h-full px-6 py-5 max-w-3/4 bg-secondary flex">
            <div className="flex flex-col w-full gap-6">
              <div className="w-full flex justify-end  text-primary py-3">
                <button onClick={() => setIsMenuOpen(false)}><IoClose className="text-3xl"/></button>
              </div>
              <a className={`
  text-white text-xl hover:text-primary cursor-pointer duration-200
`} onClick={()=>{navigate("/");setIsMenuOpen(false)}}>
  HOME
</a>
<a className={`  text-white text-xl hover:text-primary cursor-pointer duration-200

`} onClick={()=>{navigate("/private-jet-aircatering-cairo");setIsMenuOpen(false)}}>
   CATERING
</a><a className={`
    text-white text-xl hover:text-primary cursor-pointer duration-200

`}>
   CUISINE 
</a><a className={`
    text-white text-xl hover:text-primary cursor-pointer duration-200

`} onClick={()=>{navigate("/inflight-meal-catering-egypt");setIsMenuOpen(false)}}>
   IN-FLIGHT MEALS
</a><a className={`
    text-white text-xl hover:text-primary cursor-pointer duration-200

`} onClick={() => {
    navigate("/");
    setIsMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById("work");
      el?.scrollIntoView( { behavior: "smooth"});
    }, 100);
  }}>
   CONTACT
</a>
<a className={`
    text-white text-xl hover:text-primary cursor-pointer duration-200

`} onClick={()=>{navigate("/job-application");setIsMenuOpen(false)}}>
   JOIN US
</a>
<button className="global-btn btn-secondary">login</button>
<button className="global-btn btn-primary">food menu</button>
            </div>
          </div>
          </div>

    </nav>
  );
}

export default Navbar;



// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useScreenViewStore } from "../store/screenViewStore";

// function Navbar() {
//   const {setNavBarHeight}=useScreenViewStore();
//   const ref =useRef(null);
//   const navigate = useNavigate();
//   const go = (path) => {
//     navigate(path);
//   };

//   useEffect(() => {
//     console.log("navbar height",ref.current.offsetHeight);
//     setNavBarHeight(ref.current.offsetHeight);
//     }, [ref]);

//   return (
//     <nav
//       ref={ref}
//       className={`bg-secondary  z-40  w-full `}
//     >
//       <div className="px-4 mx-auto ">
//         <div className="flex items-center justify-between px-6 md:px-16 py-3">
//           {/* start area: hamburger (mobile) + logo (clickable) */}
//           <div className="flex items-center gap-4">
//             <a
//               onClick={() => {
//                 // navigate("/");
//               }}
//               className="w-44 md:w-56 cursor-pointer group relative "
//             >
//               <img src="/images/login-logo.png" className="w-full" alt="logo" />
//             </a>
//           </div>
//           </div>
//           </div>


//     </nav>
//   );
// }

// export default Navbar;

