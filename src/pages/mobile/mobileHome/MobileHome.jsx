// MobileHome.jsx
import React, { useEffect, useRef, useState } from "react";
import MobileHero from '../../../components/mobile/MobileHero'
import { FaBars } from "react-icons/fa";
import { useLangStore } from "../../../assets/store/langStore";
import { langText } from "../../../assets/constants/lang";
import HorizontalScrollNav from "../../../components/mobile/HorizontalScrollNav";
import MobileMenu from "../../../components/mobile/MobileMenu";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetAllProducts } from "../../../assets/apis/product/PeoductApi";
import { useCartStore } from "../../../assets/store/cartStore";
import Loading from "../../loading/Loading";

function MobileHome() {
  const { lang } = useLangStore();
  const navigate = useNavigate();
  const {getTotalItems,getTotalPrice}=useCartStore();

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: GetAllProducts,
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: 5,
  });

  useEffect(() => {
    if (data) console.log("data", data);
  }, [data]);

  // active index shared between nav and content
  const [activeIndex, setActiveIndex] = useState(0);

  // refs for each category section (grandGroup)
 // we'll fill them via callback in MobileMenu

  // ref to the nav so we can read its height to offset scrolls
  const navRef = useRef(null);

const [selectedIndex, setSelectedIndex] = useState(null);
const itemRefs = useRef([]);

// يتم استدعاؤه من HorizontalScrollNav
const registerItemRef = (el, idx) => {
  itemRefs.current[idx] = el; // حتى لو el === null نحدث المصفوفة
};
useEffect(() => {
  if (data) {
    itemRefs.current = new Array(data.length).fill(null);
  }
}, [data]);


// مهم جدًا — scroll بعد حدوث التغيير
useEffect(() => {
  if (selectedIndex !== null) {
    const el = itemRefs.current[selectedIndex];
    const navEl = navRef.current;
const navHeight = navEl ? navEl.getBoundingClientRect().height : 0;
window.scrollTo({ top: el.offsetTop - navHeight, behavior: "smooth" });

  }
}, [selectedIndex]);


  // handler when tapping a category in nav
  const onCategorySelect = (idx) => {
    setActiveIndex(idx);
    const el = itemRefs.current[idx];
    const navEl = navRef.current;
    const navHeight = navEl ? navEl.getBoundingClientRect().height : 0;

    if (!el) return;
    // calc absolute top, subtract navHeight to avoid being hidden under sticky nav
    const rect = el.getBoundingClientRect();
    const absoluteTop = window.scrollY + rect.top - navHeight - 8; // -8 for small gap
    window.scrollTo({ top: Math.max(0, absoluteTop), behavior: "smooth" });
  };

  // detect scroll and update active index based on which section is nearest the top (under nav)
  useEffect(() => {
    let rafId = null;
    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const navEl = navRef.current;
        const navHeight = navEl ? navEl.getBoundingClientRect().height : 0;
        if (!itemRefs.current || itemRefs.current.length === 0) return;

        let bestIdx = 0;
        let bestDistance = Number.POSITIVE_INFINITY;
        itemRefs.current.forEach((el, idx) => {
          if (!el) return;
          // distance from top of viewport (adjusted by navHeight)
          const top = el.getBoundingClientRect().top - navHeight;
          const dist = Math.abs(top);
          if (dist < bestDistance) {
            bestDistance = dist;
            bestIdx = idx;
          }
        });

        // only update if changed
        // if (bestIdx !== activeIndex) {
        //   setActiveIndex(bestIdx);
        // }
        setActiveIndex(prev => (prev !== bestIdx ? bestIdx : prev));
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // run once to sync on mount
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [data]); // reattach when data changes (new sections)

  return (
    <div className="relative pb-20">
      <MobileHero />
      {isLoading ?(<Loading/>):(<>
      <HorizontalScrollNav
      ref={navRef}
      data={data}
      activeIndex={activeIndex}
      onSelect={onCategorySelect}
      onCategoryChange={(idx) => setSelectedIndex(idx)}
      
      />
      {/* pass register callback so MobileMenu attaches refs to each section */}
      <MobileMenu   Menu data={data} registerItemRef={registerItemRef}/>
      <div className="py-4 fixed bottom-0 w-full bg-white flex flex-col items-center justify-center border-0 border-t border-t-light-gray ">
      {getTotalPrice()<80 && <p className="text-center mb-2 text-gray">{langText.AddEGP80ToStartYourOrder[lang]}</p>}
      <button onClick={() => { navigate("/cart"); }} className={`w-4/5  h-12 rounded-full ${getTotalPrice()<80?"bg-gray-300":"bg-primary"} flex items-center justify-between px-4 text-white`}>
      <div className="flex items-center gap-4 h-full">
      <div className={`h-[70%] aspect-square rounded-full  ${getTotalPrice()<80?"bg-gray-400":"bg-[#9e7946]"} flex items-center justify-center`}>{getTotalItems()}</div>
      <p>{langText.viewCart[lang]}</p>
      </div>
      <p>{getTotalPrice()+" "+ langText.EGP[lang]}</p>
      </button>
      </div>
      </>)}
    </div>
  );
}

export default MobileHome;
