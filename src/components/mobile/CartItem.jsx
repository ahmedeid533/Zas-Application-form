import React from 'react'
import { FaPlus, FaMinus } from "react-icons/fa";
import { langText } from '../../assets/constants/lang';
import { useLangStore } from '../../assets/store/langStore';
import { FaRegTrashAlt } from "react-icons/fa";

import { RiEdit2Line } from "react-icons/ri";
function CartItem({item,addOne,minusOne}) {
  return (
    <div className="py-4 border-0 border-b border-b-light-gray flex gap-3">
              <div className="flex flex-col gap-2 flex-1 justify-between">
                <div>
                  <h3 className="font-medium text-lg">{item?.FoodMenuItemName}</h3>
                  <div className="flex text-primary cursor-pointer gap-2 underline items-center">
                    <RiEdit2Line /> edit
                  </div>
                </div>
    
                <p className="text-gray-800 font-semibold">EGP {item?.FoodMenuItemPrice * item?.quantity}</p>
              </div>
    
              <div className="w-2/5 aspect-square rounded-xl overflow-hidden shrink-0 relative">
                <img
                  src="images/shawarma.webp"
                  className="w-full h-full object-cover object-center"
                  alt=""
                />
                <div className="w-4/5 p-2 bg-white rounded-full absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center justify-between">
                  <div className="w-5 h-5 flex cursor-pointer items-center justify-center bg-primary rounded-full">
                    <FaMinus onClick={minusOne} className="text-white text-sm" />
                  </div>
                  <span className="text-secondary font-semibold">{item?.quantity}</span>
                  <div className="w-5 h-5 flex cursor-pointer items-center justify-center bg-primary rounded-full">
                    <FaPlus onClick={addOne} className="text-white text-sm" />
                  </div>
                </div>
              </div>
            </div>
  )
}

export default CartItem
