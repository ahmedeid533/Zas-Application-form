import React from "react";
import { langText } from "../assets/constants/lang";
import { useLangStore } from "../assets/store/langStore";
import { CiFaceSmile } from "react-icons/ci";

function Info() {
  const { lang } = useLangStore();
  return (
    <div className=" text-gray text-sm pe-2">
      <p className="text-[#262626] pb-5 text-lg font-semibold">
        {langText.SkyCulinaire[lang]}
      </p>
      <div className="py-4 border-0 border-t border-t-light-gray grid grid-cols-2 items-center">
        <p>{langText.minimumOrderAmount[lang]}</p>
        <p>{langText.EGP80[lang]}</p>
      </div>
      <div className="py-4 border-0 border-t border-t-light-gray grid grid-cols-2 items-center">
        <p>{langText.deliveryTime[lang]}</p>
        <p>{langText.mins3550[lang]}</p>
      </div>
      <div className="py-4 border-0 border-t border-t-light-gray grid grid-cols-2 items-center">
        <p>{langText.preOrder[lang]}</p>
        <p>{langText.yes[lang]}</p>
      </div>
      <div className="py-4 border-0 border-t border-t-light-gray grid grid-cols-2 items-center">
        <p>{langText.payment[lang]}</p>
        <div className="flex items-center gap-2">
                    <img src="/images/visa_blue.webp" alt="visa" className="w-8" />
                    <img src="/images/logo-mastercard.svg" alt="mastercard" className="w-8" />
                    <img src="/images/logo-cash.svg" alt="cash" className="w-8" />
                </div>
      </div>
      <div className="py-4 border-0 border-t border-t-light-gray grid grid-cols-2 items-center">
        <p>{langText.ratting[lang]}</p>
        <div className="flex  gap-2 items-center ">
                    <CiFaceSmile className='text-2xl ' />
                    <p className='text-xs  '>{langText.excellent[lang]}</p>
                </div>
      </div>
      <div className="py-4 border-0 border-t border-t-light-gray grid grid-cols-2 items-center">
        <p>{langText.cuisines[lang]}</p>
        <p>{langText.kindOfFood[lang]}</p>
      </div>
    </div>
  );
}

export default Info;
