import { useQuery } from '@tanstack/react-query';
import axios  from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoMdArrowDropdown } from "react-icons/io";
import { IoLockClosedSharp } from "react-icons/io5";
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
const images = [
"/images/bacon-eggs-breakfast-menu-executive-jet.jpg",
"/images/italian-food-flight-staff-meals.jpg",
"/images/executive-flight-catering-chicken-greek-cuisine.jpg",
"/images/asian-chicken-chilli-sky-culinaire-catering.jpg",
];
function Menu() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const [mainGroups, setMainGroups] = useState([]);
  const [selectedMainId, setSelectedMainId] = useState(() =>
    mainGroups.length ? mainGroups[0].MainGroupID : null
  );
  const [availableSubGroups, setAvailableSubGroups] = useState(() =>
    mainGroups.length ? mainGroups[0].SubGroups || [] : []
  );
  const [selectedSubId, setSelectedSubId] = useState(() =>
    mainGroups.length && (mainGroups[0].SubGroups || []).length
      ? mainGroups[0].SubGroups[0].SubGroupID
      : null
  );
  const { data, isLoading, error } = useQuery({
    queryKey: ["menu"],
    queryFn: () =>
      axios
        .get("https://apitest.skyculinaire.com/api/FlightMenu/GetMenu")
        .then((res) => res.data),
        retry:3,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
    if(data && data.length){

        console.log("data",data[5]);
        setMainGroups(data);
        setSelectedMainId(data[0].MainGroupID);
        setAvailableSubGroups(data[0].SubGroups || []);
        setSelectedSubId(data[0].SubGroups[0].SubGroupID);
        setVisibleItems(data[0].SubGroups[0].Items || []);
    }
    
  },[data])


  // اختيارات الحالة

  // العناصر المعروضة حسب الاختيارات
  const [visibleItems, setVisibleItems] = useState(() => {
    if (!mainGroups.length) return [];
    const sg = mainGroups[0].SubGroups && mainGroups[0].SubGroups[0];
    return sg ? sg.Items || [] : [];
  });

  // متى يتغير الـ MainGroup: حدث تحديث للـ subgroups و reset للاختيار الفرعي
  useEffect(() => {
    const main = mainGroups.find((m) => m.MainGroupID === selectedMainId);
    const subs = main ? main.SubGroups || [] : [];
    setAvailableSubGroups(subs);

    // اختر أول SubGroup تلقائياً (أو null لو مفيش)
    const firstSub = subs.length ? subs[0].SubGroupID : null;
    setSelectedSubId(firstSub);
  }, [selectedMainId, mainGroups]);

  // متى يتغير الـ SubGroup أو الـ MainGroup: حدث تحديث للعناصر المرئية
  useEffect(() => {
    const main = mainGroups.find((m) => m.MainGroupID === selectedMainId);
    if (!main) {
      setVisibleItems([]);
      return;
    }
    const sub = (main.SubGroups || []).find((s) => s.SubGroupID === selectedSubId);
    setVisibleItems(sub ? sub.Items || [] : []);
  }, [selectedMainId, selectedSubId, mainGroups]);



  return (
    <div className="relative min-h-screen">
      
      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {images.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 ">
        <div className="flex justify-end p-6">
          <div className="flex items-center gap-3 rounded-full bg-[#02020280] text-white p-3 px-5">
            <button onClick={() => navigate("/")} className='text-primary hover:text-[#d9b27a] transition-all duration-300'>Home</button>
            <span>|</span>
            <button onClick={() => navigate("/login")} className='text-primary hover:text-[#d9b27a] transition-all duration-300'>Login</button>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-6 min-w-md w-2/5 mx-auto py-6">
            <div className="w-96">
                <img src="images/login-logo.png" alt="logo" className='w-full' />
            </div>
            <h2 className='text-4xl text-white text-center'>OUR FOOD <span className='text-primary font-bold'>MENU</span></h2>
            <p className='text-white text-center text-lg'>To gain complete access to the food menu and its prices, kindly fill out the form below
if you wish to view and have access to it.</p>
<button className="global-btn bg-primary  hover:bg-inherit">Full menu request</button>
        </div>



        <div className="">
            <div className="flex flex-col items-center ">

<div className="bg-[#2E2E2Eaa] w-full flex justify-center">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center max-w-6xl w-2/3 ">
        {/* MainGroup Dropdown */}
        <div>
          <CustomDropdown
  value={selectedMainId}
  options={mainGroups}
  onChange={setSelectedMainId}
  getLabel={(m) => m.MainGroupName}
  getValue={(m) => m.MainGroupID}
  placeholder="Select Main Group"
/>
        </div>

        {/* SubGroup Dropdown */}
        <div>
<CustomDropdown
  value={selectedSubId}
  options={availableSubGroups}
  onChange={setSelectedSubId}
  getLabel={(s) => s.SubGroupName}
  getValue={(s) => s.SubGroupID}
  placeholder="Select Sub Group"
/>

        </div>

        {/* اختياري: زر لإظهار العناصر أو إعادة التعيين */}

      </div>
</div>

      {/* Items list */}
      <div className='bg-[#151515ee] w-full py-6 px-12'>
        {visibleItems.length === 0 ? (
          <div className=" text-center text-white">No items available</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gap-y-12 gap-x-20">
            {visibleItems.map((it) => (
              <div key={it.ItemID} className="flex gap-1 flex-col">
               <h3 className='text-primary text-xl font-bold'>{it.ItemName}</h3>
               <p className='flex items-center gap-1 text-[#e7e7e7] '>{it.ItemDescription}</p>
               <p className='flex items-center gap-1 text-white text-[14px]'><IoLockClosedSharp className='text-primary'/>{it.ItemMegurment} </p>
               
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="py-5">
        <div className="flex flex-wrap justify-center gap-4 mt-12">
        {links.map((link, index) => (
          <>
          <p
            key={index}
            className="text-primary cursor-pointer text-lg font-bold"
            onClick={() => navigate(link.path)}
            >
            {link.name}
          </p>
          {index !== links.length - 1 && <span className='text-primary'>|</span>}
            </>
        ))}
      </div>
      </div>
    </div>
        </div>
      </div>

    </div>
  );
}


export default Menu


function CustomDropdown({
  value,
  options,
  onChange,
  getLabel,
  getValue,
  placeholder = "Select...",
}) {
  const [open, setOpen] = useState(false);

  const selected = options.find(
    (o) => getValue(o) === value
  );

  return (
    <div className="relative w-full bg-inherit border-0 border-b text-lg border-primary group">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-4 py-3 rounded bg-inherit   text-left"
      >
        <span className={`${selected ? "text-white" : "text-gray-400"} group-hover:text-primary transition duration-200`}>
          {selected ? getLabel(selected) : placeholder}
        </span>
        <span className="ml-2 text-white  group-hover:text-primary transition duration-200 text-3xl"><IoMdArrowDropdown/></span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#2E2E2E] border rounded shadow-lg max-h-60 overflow-auto cutom-scroll">
          {options.map((opt) => (
            <button
              key={getValue(opt)}
              onClick={() => {
                onChange(getValue(opt));
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-primary hover:bg-primary hover:text-white ${
                getValue(opt) === value
                  ? "bg-primary text-white"
                  : ""
              }`}
            >
              {getLabel(opt)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}



{/* <div key={it.ItemID} className="p-4 border rounded shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{it.ItemName}</h4>
                    <p className="text-sm text-gray-600">{it.ItemDescription}</p>
                    <p className="text-xs text-gray-500">{it.ItemMegurment}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${it.itemPriceUSD}</div>
                    <div className="text-xs text-gray-500">Base price</div>
                  </div>
                </div>

                {it.ItemPrices && it.ItemPrices.length > 0 && (
                  <div className="mt-3 text-sm">
                    <div className="font-medium mb-1">Station Prices:</div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {it.ItemPrices.map((p, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{p.StationName}</span>
                          <span>${p.itemPriceUSD}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div> */}