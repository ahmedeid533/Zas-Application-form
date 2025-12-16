// HorizontalScrollNav.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useLangStore } from "../../assets/store/langStore";
import { IoMdClose } from "react-icons/io";
import { langText } from "../../assets/constants/lang";

const HorizontalScrollNav = React.forwardRef(function HorizontalScrollNav({ data, activeIndex = 0, onSelect = () => {} }, ref) {
  const { lang } = useLangStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
const items = data?.map(grandGroup => ({
  title: grandGroup?.FoodMenuGrandGroupName,
  count: grandGroup?.mainGroup?.reduce(
    (acc, mainGroup) =>
      acc +
      (mainGroup?.itemDatas?.length ?? 0),
    0
  )
})) ?? [];

  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const underlineRef = useRef(null);

  // update underline position & width relative to container
  const updateUnderline = () => {
    const nav = containerRef.current;
    const activeEl = itemRefs.current[activeIndex];
    const underline = underlineRef.current;
    if (!nav || !activeEl || !underline) return;

    const navRect = nav.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();

    const dir = lang === "EN"
      ? (itemRect.left - navRect.left + nav.scrollLeft)
      : (itemRect.left - navRect.left + nav.scrollLeft); // for RTL you may need to adapt

    underline.style.width = `${itemRect.width}px`;
    underline.style.transform = `translateX(${dir}px)`;
  };

  // scroll nav to keep active button centered-ish
  const scrollActiveIntoView = (idx) => {
    const nav = containerRef.current;
    const el = itemRefs.current[idx];
    if (!nav || !el) return;

    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const offset = (elRect.left - navRect.left) - (navRect.width / 2 - elRect.width / 2);

    nav.scrollTo({ left: nav.scrollLeft + offset, behavior: "smooth" });
  };

  useEffect(() => {
    updateUnderline();
    scrollActiveIntoView(activeIndex);
    const onResize = () => requestAnimationFrame(updateUnderline);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeIndex, data, lang]);

  // keep underline update during nav scroll
  useEffect(() => {
    const nav = containerRef.current;
    if (!nav) return;
    const onScroll = () => requestAnimationFrame(updateUnderline);
    nav.addEventListener("scroll", onScroll, { passive: true });
    return () => nav.removeEventListener("scroll", onScroll);
  }, [activeIndex]);

  // expose ref: if parent forwarded a ref, assign to nav dom
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") ref(containerRef.current);
    else if (ref) ref.current = containerRef.current;
  }, [containerRef.current, ref]);

  return (
    <div className="sticky top-0 z-20 w-full bg-white shadow-sm">
      <div className="max-w-4xl mx-auto relative border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-none w-12 h-12 flex items-center justify-center pt-2">
            <button aria-label="Open menu" className="w-10 h-10 text-center" onClick={() => setIsMenuOpen(true)}>
              <FaBars className="text-lg ms-1 text-primary" />
            </button>
          </div>

          <div
            ref={containerRef}
            className="flex-1 overflow-x-auto overflow-y-hidden whitespace-nowrap pt-4 relative scrollbar-hide"
          >
            <div className="inline-flex items-center relative pb-2">
              {items.map((label, i) => (
                <button
                  key={`${label?.title}-${i}`}
                  ref={(el) => (itemRefs.current[i] = el)}
                  onClick={() => onSelect(i)}
                  className={`px-4 py-1 mr-3 text-sm font-medium transition-colors duration-150 ${
                    activeIndex === i ? "text-black" : "text-gray-600"
                  }`}
                >
                  {label?.title}
                </button>
              ))}

              <span
                ref={underlineRef}
                className="absolute bottom-0 h-0.5 bg-primary transition-all duration-200 ease-out"
                style={{ width: 0, transform: "translateX(0)" }}
              />
            </div>
          </div>
        </div>
      </div>
      <CategoryPopUp setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} items={items} onSelect={onSelect} onClose={()=>{}} activeIndex={activeIndex} itemRefs={itemRefs}/>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
});

export default HorizontalScrollNav;
function CategoryPopUp({items, onSelect, itemRefs, activeIndex, isMenuOpen, setIsMenuOpen}) {
  const { lang } = useLangStore();
  function handelClose (e) {
    if(e.target.classList.contains("menu-popup")) {
      setIsMenuOpen(false);
    }
  }
  return (
    <div onClick={handelClose}
      onPointerDown={handelClose}
      onPointerMove={handelClose}
      onPointerUp={handelClose}
      onTouchStart={handelClose}
      onTouchMove={handelClose}
      onTouchEnd={handelClose}
     className={`w-screen h-screen fixed menu-popup transform transition-all duration-[0s]   left-0 z-40 bg-[#00000066] ${isMenuOpen ? "top-0" : "top-full "}`}>
      <div className={`bg-white h-[70%]  rounded-t-4xl absolute  w-full shadow-lg transition-all duration-1000  flex flex-col ${isMenuOpen ? "bottom-0" : "bottom-[-700px] "}`}>
        <div className="flex gap-5 items-center  p-6 shrink-0 shadow-md shadow-gray-300/40">
          <div className="p-2 aspect-square rounded-full flex items-center justify-center border border-primary" onClick={()=>{setIsMenuOpen(false)}}>
            <IoMdClose className="text-primary text-lg" />
          </div>
          <p className="text-xl">{langText?.menuCategories[lang]}</p>
        </div>
        <div className="flex flex-col overflow-y-auto  flex-1 py-2 px-4">
          {items.map((label, i) => (
            <div
              key={`${label?.title}-${i}`}
              // ref={(el) => (itemRefs.current[i] = el)}
              onClick={() => {onSelect(i); setIsMenuOpen(false)}}
              className={`flex items-center justify-between border-0 border-b border-light-gray px-3 py-2 relative ${activeIndex === i ? "after:absolute after:top-1/2 after:-left-1 after:h-3/4 after:-translate-y-1/2 after:w-0.5 after:bg-primary" : ""} cursor-pointer`}
            >
              <p className=" capitalize ">{label?.title}</p>
              <p className="text-gray">{label?.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}


// function CategoryPopUp({
//   items = [],
//   onSelect,
//   itemRefs,
//   activeIndex,
//   isMenuOpen,
//   setIsMenuOpen,
// }) {
//   const { lang } = useLangStore?.() ?? { lang: "en" };
//   const pointerState = useRef({ x: 0, y: 0, moved: false });

//   // Lock body scroll when popup open and restore on close
//   useEffect(() => {
//     if (isMenuOpen) {
//       const scrollY = window.scrollY || window.pageYOffset;
//       document.body.style.position = "fixed";
//       document.body.style.top = `-${scrollY}px`;
//       document.body.style.left = "0";
//       document.body.style.right = "0";
//       document.body.style.overflow = "hidden";
//       document.body.dataset.scrollY = String(scrollY);
//     } else {
//       const stored = document.body.dataset.scrollY;
//       document.body.style.position = "";
//       document.body.style.top = "";
//       document.body.style.left = "";
//       document.body.style.right = "";
//       document.body.style.overflow = "";
//       if (stored) {
//         // restore original scroll position
//         window.scrollTo(0, parseInt(stored, 10));
//         delete document.body.dataset.scrollY;
//       }
//     }

//     return () => {
//       const stored = document.body.dataset.scrollY;
//       document.body.style.position = "";
//       document.body.style.top = "";
//       document.body.style.left = "";
//       document.body.style.right = "";
//       document.body.style.overflow = "";
//       if (stored) {
//         window.scrollTo(0, parseInt(stored, 10));
//         delete document.body.dataset.scrollY;
//       }
//     };
//   }, [isMenuOpen]);

//   // Pointer / touch handlers to detect move vs tap
//   const handlePointerDown = (e) => {
//     pointerState.current.x =
//       e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
//     pointerState.current.y =
//       e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
//     pointerState.current.moved = false;
//   };

//   const handlePointerMove = (e) => {
//     const cx = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
//     const cy = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
//     const dx = cx - pointerState.current.x;
//     const dy = cy - pointerState.current.y;
//     if (Math.hypot(dx, dy) > 10) {
//       pointerState.current.moved = true;
//     }
//   };

//   const handlePointerUp = (e) => {
//     // close only if it was a simple tap (no move) AND target is overlay itself
//     if (!pointerState.current.moved && e.target === e.currentTarget) {
//       setIsMenuOpen(false);
//     }
//   };

//   // Helper: close first, then call onSelect after popup fully closed/unlocked
//   const handleItemClick = (e, index) => {
//     e.stopPropagation?.(); // stop bubbling to overlay handlers
//     // close popup first (this will trigger useEffect to restore body scroll)
//     setIsMenuOpen(false);

//     // call onSelect after two animation frames so the body unlock (effect) has applied
//     // double rAF is a common trick to wait till after paint/layout side-effects
//     requestAnimationFrame(() => {
//       requestAnimationFrame(() => {
//         onSelect(index);
//       });
//     });
//   };

//   return (
//     <div
//       // attach pointer/touch handlers on overlay
//       onPointerDown={handlePointerDown}
//       onPointerMove={handlePointerMove}
//       onPointerUp={handlePointerUp}
//       onTouchStart={handlePointerDown}
//       onTouchMove={handlePointerMove}
//       onTouchEnd={handlePointerUp}
//       className={`w-screen h-screen fixed menu-popup transform transition-all duration-[0s] left-0 z-40 bg-[#00000066] ${isMenuOpen ? "top-0" : "top-full"}`}
//     >
//       <div
//         className={`bg-white h-[70%] rounded-t-4xl absolute w-full shadow-lg transition-all duration-1000 flex flex-col ${isMenuOpen ? "bottom-0" : "bottom-[-700px]"}`}
//       >
//         <div className="flex gap-5 items-center p-6 shrink-0 shadow-md shadow-gray-300/40">
//           <div
//             className="p-2 aspect-square rounded-full flex items-center justify-center border border-primary"
//             onClick={() => {
//               setIsMenuOpen(false);
//             }}
//           >
//             <IoMdClose className="text-primary text-lg" />
//           </div>
//           <p className="text-xl">{langText?.menuCategories?.[lang] ?? "Categories"}</p>
//         </div>

//         <div className="flex flex-col overflow-y-auto flex-1 py-2 px-4">
//           {items.map((label, i) => (
//             <div
//               key={`${label?.title ?? "item"}-${i}`}
//               // ref={(el) => (itemRefs.current[i] = el)}
//               onClick={(e) => handleItemClick(e, i)}
//               className={`flex items-center justify-between border-0 border-b border-light-gray px-3 py-2 relative ${activeIndex === i ? "after:absolute after:top-1/2 after:-left-1 after:h-3/4 after:-translate-y-1/2 after:w-0.5 after:bg-primary" : ""} cursor-pointer`}
//             >
//               <p className="capitalize">{label?.title}</p>
//               <p className="text-gray">{label?.count}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }