import React, { useEffect, useState } from "react";
import { RiEdit2Line } from "react-icons/ri";

import { FaPlus, FaMinus } from "react-icons/fa";
import CartItem from "../../../components/mobile/CartItem";
import { langText } from "../../../assets/constants/lang";
import { useLangStore } from "../../../assets/store/langStore";
import { useCartStore } from "../../../assets/store/cartStore";
import { useScreenViewStore } from "../../../assets/store/screenViewStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../../../assets/store/authStore";
import FormInput from "../../../components/formInput/FormInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddressStore } from "../../../assets/store/addressStore";
import CheackOutPopUp from "../../../components/cheackoutPopup/CheackoutPopup";

function MobileCart() {
    const {navBarHeight}=useScreenViewStore();
    const navigate = useNavigate();
    const { lang } = useLangStore();
    const{cart,updateQuantity,getTotalPrice,serviceFee,deliveryFee }=useCartStore();
    const user = useAuthStore((state) => state.user);
    const [cheackOutPopUpOpen, setCheackOutPopUpOpen] = useState(false);

    function moveToLogin(){
      toast.error(langText.pleaseLoginFirst[lang], { id: 1 });
        navigate('/login');
    }

    if(cart?.length == 0){
        return(
            <div className={`bg-[#f5f5f5] p-2.5 flex h-[calc(100vh-${navBarHeight}px)] items-center justify-center shadow-md`}>
                          <div className="text-center flex flex-col items-center justify-center gap-4">
                            <img src="images/empty-cart.svg" className="w-1/2" alt="" />
                            <p className="text-gray text-xl font-semibold">
                              {langText.thereAreNoItemsInYourCart[lang]}
                            </p>
                          </div>
                        </div>
        )}
  return (
    <div className="p-6 pb-24">
      <h4 className="font-semibold mb-5 text-xl">Cart</h4>
      <div className="flex flex-col w-full">
                        {cart.map((item)=>{return (
                          <CartItem item={item} addOne={()=>user?updateQuantity(item?.FoodMenuItemId,item?.quantity + 1):moveToLogin()} minusOne={()=>user?updateQuantity(item?.FoodMenuItemId,item?.quantity -1):moveToLogin()}/>
                        )
                })}
        <div className="mt-9">
            <h4 className="font-semibold mb-5 text-xl">{langText.paymentSummary[lang]}</h4>

            <div className="w-full flex flex-col gap-4">
                        <div className="flex items-center justify-between py-2 border-0 border-b border-b-light-gray">
                            <p className='font-semibold'>{langText.subtotal[lang]}</p>
                            <p>{getTotalPrice()}</p>
                        </div>
                        <div className="flex items-center justify-between py-2 border-0 border-b border-b-light-gray">
                            <p className='font-semibold'>{langText.deliveryFee[lang]}</p>
                            <p>{deliveryFee}</p>
                        </div>
                        <div className="flex items-center justify-between py-2 border-0 border-b border-b-light-gray">
                            <p className='font-semibold'>{langText.servviceFee[lang]}</p>
                            <p>{serviceFee}</p>
                        </div>
                        <div className="flex items-center justify-between py-2 border-0 ">
                            <p className='font-semibold '>{langText.totalAmountEGP[lang]}</p>
                            <p className="text-xl text-primary">{getTotalPrice()+deliveryFee+serviceFee}</p>
                        </div>
                    </div>
        </div>
      </div>

      <div className="fixed w-full left-0 border-t border-t-light-gray bottom-0 py-3 flex items-center justify-between gap-2 bg-white shadow">
                          <button onClick={()=>navigate('/')} className='py-3 cursor-pointer mx-auto mt-5 border-primary border text-primary rounded-full w-2/5'>{langText.addItem[lang]}</button>
                          <button onClick={()=>{getTotalPrice()<80 ? toast.error(langText.yourOrderMustBeAtLeast80EGP[lang]):setCheackOutPopUpOpen(true)}} className='py-3 cursor-pointer mx-auto mt-5 bg-primary text-white rounded-full w-2/5'>{langText.checkout[lang]}</button>

      </div>
      {cheackOutPopUpOpen && <CheackOutPopUp onClose={()=>setCheackOutPopUpOpen(false)}/>}
    </div>
  );
}

export default MobileCart;


// function CheackOutPopUp({onClose,lang}) {
//   const MIN_MINUTES = 20;

//   const [days, setDays] = useState(0);
//   const [hours, setHours] = useState(0);
//   const [minutes, setMinutes] = useState(MIN_MINUTES);
//   const [fullDuration, setFullDuration] = useState("");
//   const { getTotalPrice, serviceFee, deliveryFee } = useCartStore();
//           const {address,setAddress,isAddressMap,setIsAddressMap}=useAddressStore();
  


//   const totalMinutes = days * 1440 + hours * 60 + minutes;

//     function handelCheackout(formData) {
//     console.log({...formData,deliveryDuration:fullDuration,totalPrice:getTotalPrice()+deliveryFee+serviceFee,address,isAddressMap});

//   }
//   const cheackoutSchema = Yup.object().shape({
//   phone: Yup.string()
//     .required(langText.phoneNumberIsRequired[lang])
//     .matches(/^0?(10|11|12|15)[0-9]{8}$/, langText.pleaseEnterAValidPhoneNumber[lang]),
//      address: Yup.string()
//         .required(langText.addressIsRequired[lang])
//   });
//   let formik = useFormik({
//     initialValues: {
//       phone: "",
//       address: "",
//     },
//     onSubmit: handelCheackout,
//     validationSchema: cheackoutSchema,
//   });

//   useEffect(() => {
//     // Enforce minimum duration
//     if (totalMinutes < MIN_MINUTES) {
//       setDays(0);
//       setHours(0);
//       setMinutes(MIN_MINUTES);
//       return;
//     }

//     setFullDuration({
//       days,
//       hours,
//       minutes,
//       totalMinutes,
//       isoDuration: `P${days}DT${hours}H${minutes}M`,
//     });
//     console.log({
//       days,
//       hours,
//       minutes,
//       totalMinutes,
//       isoDuration: `P${days}DT${hours}H${minutes}M`,
//       date: new Date(Date.now() + totalMinutes * 60000),
//     });
    
//   }, [days, hours, minutes]);

//   return (
//     <div className=" fixed w-screen p-9 h-screen top-0 left-0 bg-[#00000066] flex items-center justify-center z-50">
//         <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-3 max-w-md w-full">
//           <div className="ms-auto" onClick={onClose}>
//           <svg
//         xmlns="http://www.w3.org/2000/svg"
//         fill="none"
//         viewBox="0 0 24 24"
//         strokeWidth={1.5}
//         stroke="currentColor"
//         className="w-6 h-6"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M6 18L18 6M6 6l12 12"
//         />
//       </svg>
//           </div>
//           <p className="text-center font-semibold text-2xl mb-5">{langText.checkout[lang]}</p>
//           <div className="flex gap-4 items-end test-sm mb-6">

//     <p className="font-medium text-nowrap">{langText.deliveryAfter[lang]}</p>


//     <div className="grid shrink grid-cols-3 border-0 border-b text-sm border-b-light-gray ">
//       <Input label={langText.days[lang]} value={days} onChange={setDays} min={0} />
//       <Input label={langText.hours[lang]} value={hours} onChange={setHours} min={0} max={23} />
//       <Input
//         label={langText.minutes[lang]}
//         value={minutes}
//         onChange={setMinutes}
//         min={0}
//         max={59}
//         />

//     </div>
//         </div>
//                   <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
//                     <FormInput
//                       name="phone"
//                       handleChange={formik.handleChange}
//                       handleBlur={formik.handleBlur}
//                       value={formik.values.phone}
//                       errors={formik.errors.phone}
//                       touched={formik.touched.phone}
//                       type="text"
//                       placeholder={langText.phoneNumber[lang]}
//                     />
//                     <FormInput
//                       name="address"
//                       handleChange={formik.handleChange}
//                       handleBlur={formik.handleBlur}
//                       value={formik.values.address}
//                       errors={formik.errors.address}
//                       touched={formik.touched.address}
//                       type="text"
//                       placeholder={langText.deliveryAddress[lang]}
//                     />
//                     <textarea
//                       className="w-full py-3 px-2 border border-light-gray rounded-lg focus:outline-none focus:border-primary resize-none"
//                       rows={3}
//                       placeholder={langText.additionalNotesInstructions[lang]}
//                     ></textarea>

//                     <div className="w-full flex flex-col gap-4">
//                         <div className="flex items-center justify-between py-2 border-0 border-b border-b-light-gray">
//                             <p className='font-semibold'>{langText.subtotal[lang]}</p>
//                             <p>{getTotalPrice()}</p>
//                         </div>
//                         <div className="flex items-center justify-between py-2 border-0 border-b border-b-light-gray">
//                             <p className='font-semibold'>{langText.deliveryFee[lang]} {!isAddressMap?"(min)":null}</p>
//                             <p>{deliveryFee}</p>
//                         </div>
//                         <div className="flex items-center justify-between py-2 border-0 border-b border-b-light-gray">
//                             <p className='font-semibold'>{langText.servviceFee[lang]}</p>
//                             <p>{serviceFee}</p>
//                         </div>
//                         <div className="flex items-center justify-between py-2 border-0 ">
//                             <p className='font-semibold '>{langText.totalAmountEGP[lang]}</p>
//                             <p className="text-xl text-primary">{getTotalPrice()+deliveryFee+serviceFee}</p>
//                         </div>
//                     </div>

//                     <button type="submit" className="bg-primary border border-primary hover:bg-white hover:text-primary transition w-full rounded-full py-2 text-lg text-center text-white cursor-pointer ">
//                       {langText.checkout[lang]}
//                     </button>
                    
//                     </form>
//         </div>
//         </div>
//   );
// }

// function Input({ label, value, onChange, min, max }) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-sm font-medium">{label}</label>
//       <input
//         type="number"
//         min={min}
//         max={max}
//         value={value}
//         onChange={(e) => onChange(Number(e.target.value) || 0)}
//         className=" px-3 py-2  focus:outline-none border-0 focus:border-b focus:border-b-primary"
//       />
//     </div>
//   );
// }

            //     {cart.map((item)=>{return (

            //       <div key={item?.FoodMenuItemId} className="py-2 border-0 border-b border-b-light-gray flex items-center w-full justify-between">
            //       <div className="flex items-center gap-3">
            //     <div className="w-6 h-6 flex cursor-pointer items-center justify-center bg-primary rounded-full" onClick={()=>updateQuantity(item?.FoodMenuItemId,item?.quantity -1)}>
            //         <FaMinus className='text-white text-md' />
            //     </div>
            //     <span className="text-secondary font-semibold">{item?.quantity}</span>
            //                     <div className="w-6 h-6 flex cursor-pointer items-center justify-center bg-primary rounded-full">
            //         <FaPlus className='text-white text-md' onClick={()=>updateQuantity(item?.FoodMenuItemId,item?.quantity + 1)}/>
            //     </div>
            //      </div>
            //      <div className="flex flex-col-reverse xl:flex-row items-center gap-3">
            // <h4 className="text-sm text-center">{item?.FoodMenuItemName}</h4>
            // <div className="w-11 h-11 ">
            //     <img src="/images/shawarma.webp" alt="" className='w-full h-full object-cover object-center' />
            // </div>
            //      </div>
            //     </div>
            //       )
            //     })}