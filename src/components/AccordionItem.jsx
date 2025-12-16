import React, { useEffect, useRef } from "react";

function AccordionItem({ idPrefix, index, isOpen, onToggle, children }) {
  const itemRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    if (!itemRef.current) return;

    const top = itemRef.current.getBoundingClientRect().top + window.scrollY - 20;

    window.scrollTo({
      top,
      behavior: "smooth"
    });

  }, [isOpen]);

  return (
    <div ref={itemRef}>
      <h2 id={`${idPrefix}-heading-${index}`}>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={`${idPrefix}-body-${index}`}
          onClick={onToggle}
          className="flex w-full justify-between bg-[#F5F5F5] px-5 py-2"
        >
          {children.header}
                    <svg
            data-accordion-icon
            className={`w-5 h-5 shrink-0 transition-transform cursor-pointer ${isOpen ? "" : "rotate-180"}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 15 7-7 7 7" />
          </svg>
        </button>
      </h2>

      <div id={`${idPrefix}-body-${index}`} className={`${isOpen ? "" : "hidden"}`}>
        {children.body}
      </div>
    </div>
  );
}

export default AccordionItem;
