// MobileMenu.jsx
import React from 'react';
import { useLangStore } from '../../assets/store/langStore';
import { langText } from '../../assets/constants/lang';
import { IoIosArrowForward } from "react-icons/io";
import { FaPlus } from 'react-icons/fa6';
import { useCartStore } from '../../assets/store/cartStore';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../assets/store/authStore';
import toast from 'react-hot-toast';

function MobileMenu({ data, registerItemRef }) {
  const { lang } = useLangStore();
  const{addToCart}=useCartStore();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className='py-5 px-5'>
      {data?.map((grandGroup, idx) => (
        <div
          key={grandGroup?.FoodMenuGrandGroupId ?? idx}
          ref={(el) => registerItemRef(el, idx)}   // مهم
          className="mt-5"
        >
          <h2 className='text-2xl font-semibold'>{grandGroup?.FoodMenuGrandGroupName}</h2>
          {/* <p className='text-gray text-md mt-1'>{langText.trendingItemsWeThinkYoullLove[lang]}</p> */}

          <div className="grid grid-cols-2 gap-5 mt-4" >
          {grandGroup?.mainGroup?.map((mainGroup, mIdx) => (
              mainGroup?.itemDatas?.map((item) => (
                <div key={item.FoodMenuItemId}>
                  <div className="w-full h-35 rounded-3xl relative overflow-hidden">
                    <img src="/images/shawarma.webp" alt="food1" className='w-full h-full object-cover ' />
                    <div className={`absolute end-2 bottom-2 rounded-full bg-white w-11 h-11 border border-primary flex items-center justify-center text-primary cursor-pointer ${lang=="AR"&&"rotate-180"} `}>
                      <FaPlus className=' text-xl' onClick={() => {
                            if (!user) {
                              toast.error(langText.pleaseLoginFirst[lang], {
                                id: 1,
                              });
                              navigate("/login");
                              return;
                            }

                            addToCart({...item, quantity: 1})
                          }}/>
                    </div>
                  </div>
                  <h3 className='text-lg leading-5 font-semibold mt-2'>{item?.FoodMenuItemName}</h3>
                  <p className='text-gray text-lg font-semibold mt-1'>{item?.FoodMenuItemPrice} EGP</p>
                </div>
              ))
            ))}
            </div>
        </div>
      ))}
    </div>
  );
}

export default MobileMenu;
