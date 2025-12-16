import React, { useEffect, useRef } from 'react'
import { useScreenViewStore } from '../store/screenViewStore';

function Footer() {
  const ref =useRef(null);
  const {setFooterHeight}=useScreenViewStore();

    useEffect(() => {
      console.log("navbar height",ref.current.offsetHeight);
      
      setFooterHeight(ref.current.offsetHeight);
      }, [ref]);
  return (
    <div ref={ref} >
    </div>
  )
}

export default Footer
