import React, { useEffect, useState } from 'react'
import { FaPlus, FaMinus } from "react-icons/fa";
import { langText } from '../../assets/constants/lang';
import { useLangStore } from '../../assets/store/langStore';
import { FaRegTrashAlt } from "react-icons/fa";

import { RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddressStore } from '../../assets/store/addressStore';
import { useCartStore } from '../../assets/store/cartStore';
import FormInput from '../../components/formInput/FormInput';
import CheackOutPopUp from '../../components/cheackoutPopup/CheackoutPopup';
import { useScreenViewStore } from '../../assets/store/screenViewStore';

function Cart() {
    const { lang } = useLangStore();
    const {cart,updateQuantity,getTotalPrice,removeFromCart,serviceFee,deliveryFee}=useCartStore();
    const [showCheckoutPopUp, setShowCheckoutPopUp] = useState(false);
    const navigate =useNavigate();
    const {navBarHeight,footerHeight}=useScreenViewStore();
    const{isAddressMap}=useAddressStore();
    console.log(navBarHeight,footerHeight);
    
    if (cart?.length == 0) {
      return (
        <div
          style={{
            height: `calc(100vh - ${navBarHeight + footerHeight}px)`,
          }}
          className={`bg-[#f5f5f5] p-2.5  flex  items-center justify-center shadow-md`}
        >
          <div className="text-center flex flex-col items-center justify-center gap-4">
            <img src="images/empty-cart.svg" className="w-1/2" alt="" />
            <p className="text-gray text-xl font-semibold">
              {langText.thereAreNoItemsInYourCart[lang]}
            </p>
          </div>
        </div>
      );
    }
  return (
    <div className="container mx-auto">
      <div className="py-9">
        {/* <h2 className="text-xl font-semibold">My Cart</h2> */}
        <div className="flex flex-col lg:flex-row justify-between gap-5">
          <div className="flex-1 flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-3 px-3 w-full shrink lg:max-h-96 cutom-scroll overflow-y-auto">
              {cart.map((item)=>{return (

              <div className="py-2 border-0 border-b border-b-light-gray grid grid-cols-[30%_20%_auto]  items-center w-full ">
                <div className="flex flex-col gap-2">

                <div className="flex items-center gap-3">
                  <div onClick={()=>updateQuantity(item?.FoodMenuItemId,item?.quantity -1)} className="w-6 h-6 flex cursor-pointer items-center justify-center bg-primary rounded-full">
                    <FaMinus className="text-white text-md" />
                  </div>
                  <span className="text-secondary font-semibold">{item?.quantity}</span>
                  <div onClick={()=>updateQuantity(item?.FoodMenuItemId,item?.quantity + 1)} className="w-6 h-6 flex cursor-pointer items-center justify-center bg-primary rounded-full">
                    <FaPlus  className="text-white text-md" />
                  </div>
                </div>
                </div>
                <div className="">{item?.quantity*item?.FoodMenuItemPrice} {langText.EGP[lang]}</div>
                <div className="flex items-center gap-3 justify-end">
                  <h4 className="text-sm text-center">{item?.FoodMenuItemName}</h4>
                  <div className="w-11 h-11 ">
                    <img
                      src="/images/shawarma.webp"
                      alt=""
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-4">
                  <FaRegTrashAlt onClick={()=>removeFromCart(item?.FoodMenuItemId)} className="text-red-400 cursor-pointer" />
                  <RiEdit2Line className="text-primary cursor-pointer" />
                  </div>
                </div>
              </div>
              )})}
              
            </div>
          </div>
          <div className=" lg:w-1/4 lg:min-w-99 min-h-55 w-full pt-4">
                    <div className="bg-primary p-2.5 text-xl text-white">
                      <p>{langText.yourCart[lang]}</p>
                    </div>
            <div className="bg-[#f5f5f5] p-2.5 flex items-center justify-center shadow-md">
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between py-2 border-0 border-b border-b-light-gray">
                <p className='font-semibold'>{langText.subtotal[lang]}</p>
                <p>{getTotalPrice()} </p>
            </div>
            <div className="flex items-center justify-between py-2 border-0 border-b border-b-light-gray">
                <p className='font-semibold'>{langText.deliveryFee[lang]} {!isAddressMap ? "(min)" : null}</p>
                <p>{deliveryFee} </p>
            </div>
            <div className="flex items-center justify-between py-2 border-0 border-b border-b-light-gray">
                <p className='font-semibold'>{langText.servviceFee[lang]}</p>
                <p>{serviceFee} </p>
            </div>
            <div className="flex items-center justify-between py-2 border-0 border-b border-b-light-gray">
                <p className='font-semibold'>{langText.totalAmountEGP[lang]}</p>
                <p>{getTotalPrice()+serviceFee+deliveryFee} </p>
            </div>
            <div className="flex items-center gap-5">

              <button onClick={()=>navigate('/')} className='py-3 flex-1 cursor-pointer mx-auto mt-5 border-primary border text-primary rounded-full'>{langText.addItem[lang]}</button>
              <button onClick={()=>{getTotalPrice()<80 ? toast.error(langText.yourOrderMustBeAtLeast80EGP[lang]):setShowCheckoutPopUp(true)}} className='py-3 flex-1 cursor-pointer mx-auto mt-5 bg-primary text-white rounded-full'>{langText.checkout[lang]}</button>
            </div>
        </div>
            </div>
          </div>
        </div>
      </div>
      {showCheckoutPopUp && <CheackOutPopUp lang={lang} onClose={()=>{setShowCheckoutPopUp(false)}} />}
    </div>
  );
}

export default Cart


