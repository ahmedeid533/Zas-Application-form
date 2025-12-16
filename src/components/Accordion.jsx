import React, { useEffect, useState } from "react";

function Accordion({
  children,
  allowMultiple = false,
  activeIndex = null,
}) {
  const [openSet, setOpenSet] = useState(new Set());

  useEffect(() => {
    if (activeIndex === null) return;
    const next = new Set();
    next.add(activeIndex);
    setOpenSet(next);
  }, [activeIndex]);

  const toggle = (index) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  return React.Children.map(children, (child, idx) =>
    React.cloneElement(child, {
      isOpen: openSet.has(idx),
      onToggle: () => toggle(idx),
      index: idx,
    })
  );
}

export default Accordion;
