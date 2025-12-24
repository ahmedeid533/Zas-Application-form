import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowDropdown } from "react-icons/io";
import { IoLockClosedSharp } from "react-icons/io5";

const links = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about-us" },
  { name: "VIP Catering", path: "/private-jet-aircatering-cairo" },
  { name: "Food Menus", path: "/menu" },
  { name: "In-Flight Meals", path: "/inflight-meal-catering-egypt" },
  { name: "Menu Request", path: "/request" },
  { name: "Contact", path: "/air-catering-cairo-contact" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms of Use", path: "/website-terms" },
];

const images = [
  "/images/bacon-eggs-breakfast-menu-executive-jet.jpg",
  "/images/italian-food-flight-staff-meals.jpg",
  "/images/executive-flight-catering-chicken-greek-cuisine.jpg",
  "/images/asian-chicken-chilli-sky-culinaire-catering.jpg",
];

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/* ---------- CustomDropdown (controlled by parent) ---------- */
function CustomDropdown({
  name,             // unique name for this dropdown: e.g. 'main' | 'sub' | 'station'
  label,            // optional label text
  value,
  options = [],
  onChange,
  getLabel = (o) => (typeof o === 'string' ? o : o?.label ?? ''),
  getValue = (o) => (typeof o === 'string' ? o : o?.value ?? o?.id ?? o),
  placeholder = "Select...",
  isOpen = false,   // controlled
  onToggle = () => {}, // called when trigger clicked (parent should open/close)
}) {
  const selected = options.find((o) => getValue(o) === value);

  return (
    <div className="relative w-full" data-custom-dd>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => onToggle(name)}
        className="w-full flex justify-between items-center px-4 py-3 rounded bg-inherit text-left border-b border-primary"
      >
        <span className={`${selected ? "text-white" : "text-gray-400"} transition-colors`}>
          {selected ? getLabel(selected) : placeholder}
        </span>
        <span className="ml-2 text-white text-2xl"><IoMdArrowDropdown/></span>
      </button>

      {/* Menu (renders only when isOpen true) */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-[#2E2E2E] border rounded shadow-lg max-h-60 overflow-auto cutom-scroll">
          {options.length === 0 ? (
            <div className="p-3 text-gray-400">No options</div>
          ) : (
            options.map((opt) => {
              const val = getValue(opt);
              const labelText = getLabel(opt);
              const isSelected = val === value;
              return (
                <button
                  key={val ?? labelText}
                  onClick={() => {
                    onChange(val);
                    onToggle(null); // close after selecting
                  }}
                  className={`w-full px-4 py-2 text-left ${
                    isSelected ? "bg-primary text-white" : "text-primary hover:bg-primary hover:text-white"
                  }`}
                >
                  {labelText}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Menu Component ---------- */
function Menu() {
  const isLogin = true;
  const [index, setIndex] = useState(0);

  // openDropdown controls which dropdown is open: 'main' | 'sub' | 'station' | null
  const [openDropdown, setOpenDropdown] = useState(null);

  const [stations, setStations] = useState([]); // will hold common stations
  const [selectedStation, setSelectedStation] = useState(null); // e.g. "HESH"
  const navigate = useNavigate();
  const [mainGroups, setMainGroups] = useState([]);
  const [selectedMainId, setSelectedMainId] = useState(null);
  const [availableSubGroups, setAvailableSubGroups] = useState([]);
  const [selectedSubId, setSelectedSubId] = useState(null);
   useEffect(() => {
    window.scrollTo(0, 0);
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ["menu"],
    queryFn: () =>
      axios
        .get(`${VITE_API_BASE_URL}/api/FlightMenu/GetMenu`)
        .then((res) => res.data),
    retry: 3,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // initialize groups when data arrives
  useEffect(() => {
    if (data && data.length) {
      setMainGroups(data);
      setSelectedMainId(data[0].MainGroupID);
      setAvailableSubGroups(data[0].SubGroups || []);
      setSelectedSubId(data[0].SubGroups?.[0]?.SubGroupID ?? null);
      setVisibleItems(data[0].SubGroups?.[0]?.Items || []);
    }
  }, [data]);

  // visible items
  const [visibleItems, setVisibleItems] = useState([]);

  // when mainGroup changes -> update available subgroups and reset selectedSubId
  useEffect(() => {
    const main = mainGroups.find((m) => m.MainGroupID === selectedMainId);
    const subs = main ? main.SubGroups || [] : [];
    setAvailableSubGroups(subs);
    const firstSub = subs.length ? subs[0].SubGroupID : null;
    setSelectedSubId(firstSub);
  }, [selectedMainId, mainGroups]);

  // when sub changes or groups change -> update visible items
  useEffect(() => {
    const main = mainGroups.find((m) => m.MainGroupID === selectedMainId);
    if (!main) {
      setVisibleItems([]);
      return;
    }
    const sub = (main.SubGroups || []).find((s) => s.SubGroupID === selectedSubId);
    setVisibleItems(sub ? sub.Items || [] : []);
  }, [selectedMainId, selectedSubId, mainGroups]);

  // compute common stations among visibleItems (by StationName only)
  useEffect(() => {
    if (!visibleItems || visibleItems.length === 0) {
      setStations([]);
      setSelectedStation(null);
      return;
    }

    // take only items that have ItemPrices
    const itemsWithPrices = visibleItems.filter(
      (it) => Array.isArray(it.ItemPrices) && it.ItemPrices.length > 0
    );

    if (itemsWithPrices.length === 0) {
      setStations([]);
      setSelectedStation(null);
      return;
    }

    const stationLists = itemsWithPrices.map((it) =>
      it.ItemPrices.map((p) => p.StationName)
    );

    const common = stationLists.reduce((acc, arr) =>
      acc.filter((x) => arr.includes(x))
    , stationLists[0] || []);

    setStations(common);
    setSelectedStation((prev) => (common.includes(prev) ? prev : (common[0] ?? null)));
  }, [visibleItems]);

  // helper to get price for an item given selectedStation
  const getPriceForItem = (item) => {
    if (!selectedStation) return item.itemPriceUSD; // fallback to base price
    const priceObj = (item.ItemPrices || []).find((p) => p.StationName === selectedStation);
    return priceObj ? priceObj.itemPriceUSD : item.itemPriceUSD;
  };

  // toggle dropdown open state; pass null to close all
  const toggleDropdown = (nameOrNull) => {
    setOpenDropdown((prev) => (prev === nameOrNull ? null : nameOrNull));
  };

  // close dropdowns on click outside any element that has data-custom-dd
  useEffect(() => {
    const handler = (e) => {
      // if click target is inside any custom dropdown, do nothing
      if (e.target.closest && e.target.closest('[data-custom-dd]')) return;
      setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {images.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
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
          <p className='text-white text-center text-lg'>To gain complete access to the food menu and its prices, kindly fill out the form below if you wish to view and have access to it.</p>
          <button className="global-btn bg-primary  hover:bg-inherit">Full menu request</button>
        </div>

        <div className="">
          <div className="flex flex-col items-center ">

            <div className="bg-[#2E2E2Eaa] w-full flex justify-center">
              {/* make 3 cols on larger screens: Main / Sub / Station */}
              <div className={`grid grid-cols-1 ${isLogin ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-4 items-center max-w-6xl w-2/3 py-6`}>
                {/* MainGroup Dropdown */}
                <div>
                  <CustomDropdown
                    name="main"
                    label="Main Group"
                    value={selectedMainId}
                    options={mainGroups}
                    onChange={(val) => setSelectedMainId(val)}
                    getLabel={(m) => m.MainGroupName}
                    getValue={(m) => m.MainGroupID}
                    placeholder="Select Main Group"
                    isOpen={openDropdown === 'main'}
                    onToggle={toggleDropdown}
                  />
                </div>

                {/* SubGroup Dropdown */}
                <div>
                  <CustomDropdown
                    name="sub"
                    label="Sub Group"
                    value={selectedSubId}
                    options={availableSubGroups}
                    onChange={(val) => setSelectedSubId(val)}
                    getLabel={(s) => s.SubGroupName}
                    getValue={(s) => s.SubGroupID}
                    placeholder="Select Sub Group"
                    isOpen={openDropdown === 'sub'}
                    onToggle={toggleDropdown}
                  />
                </div>

                {/* Station Dropdown (computed from visibleItems) */}
                {isLogin &&
                <div>
                  <CustomDropdown
                    name="station"
                    label="Station (common)"
                    value={selectedStation}
                    options={stations} // array of strings
                    onChange={(val) => setSelectedStation(val)}
                    getLabel={(s) => s}
                    getValue={(s) => s}
                    placeholder={ "stations"}
                    isOpen={openDropdown === 'station'}
                    onToggle={toggleDropdown}
                  />
                </div>
                }
              </div>
            </div>

            {/* Items list */}
            <div className='bg-[#151515ee] w-full py-6 px-12'>
              {isLoading ? (
                <div className='text-white text-center text-lg'>Loading...</div>
              ) : visibleItems.length === 0 ? (
                <div className=" text-center text-white">No items available</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gap-y-12 gap-x-20">
                  {visibleItems.map((it) => {
                    const price = getPriceForItem(it);
                    return (
                      <div key={it.ItemID} className="flex gap-1 flex-col">
                        <h3 className='text-primary text-xl font-bold'>{it.ItemName}</h3>
                        <p className='flex items-center gap-1 text-[#e7e7e7] '>{it.ItemDescription}</p>
                        <p className='flex items-center gap-1 text-white text-[14px]'>
                          <IoLockClosedSharp className='text-primary'/>
                          {it.ItemMegurment}
                        </p>
                        {isLogin &&
                        <div className="mt-2 text-white">
                          <div className="text-lg font-bold text-[14px]">
                            $ {price || "-"}
                            {selectedStation ? (
                              <span className="text-xs text-gray-400 ml-2">({selectedStation})</span>
                            ) : (
                              <span className="text-xs text-gray-400 ml-2">(base)</span>
                            )}
                          </div>
                        </div>
                        }
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="py-5">
              <div className="flex flex-wrap justify-center gap-4 mt-12">
                {links.map((link, idx) => (
                  <React.Fragment key={idx}>
                    <p className="text-primary cursor-pointer text-lg font-bold" onClick={() => navigate(link.path)}>
                      {link.name}
                    </p>
                    {idx !== links.length - 1 && <span className='text-primary'>|</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Menu;
