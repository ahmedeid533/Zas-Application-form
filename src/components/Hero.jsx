import { CiFaceSmile } from "react-icons/ci";
import { useLangStore } from '../assets/store/langStore';
import { langText } from "../assets/constants/lang";

function Hero() {
    const { lang } = useLangStore();
    
  return (
            <div className="flex items-end md:justify-between flex-col md:flex-row w-full md:w-auto">
            <div className="flex gap-3 w-full md:w-auto">
                <div className="w-30 md:w-60">

                <img src='/images/logo.png' alt='logo' className='w-full' />
                </div>
                <div className="flex flex-col gap-2 grow md:grow-0">
                    <h1 className='md:text-2xl text-lg text-[#262626] font-semibold'>{langText.SkyCulinaire[lang]}</h1>
                    <p className='md:text-sm text-xs text-gray'>{langText.skyAddresses[lang]}</p>
                    <p className='md:text-sm text-xs text-gray'>{langText.kindOfFood[lang]}</p>
                                   <div className="flex md:hidden gap-2 items-center justify-start md:justify-end text-gray">
                    <CiFaceSmile className='text-2xl ' />
                    <p className='text-xs  '>{langText.excellent[lang]}</p>
                </div>
                <div className="flex items-center justify-between">
                    <p className='md:text-sm text-xs text-gray'>{langText.minOrder[lang]}</p>
                    <div className="flex md:hidden items-center gap-2">
                    <img src="/images/visa_blue.webp" alt="visa" className="w-4" />
                    <img src="/images/logo-mastercard.svg" alt="mastercard" className="w-4" />
                    <img src="/images/logo-cash.svg" alt="cash" className="w-4" />
                </div>
                </div>
                </div>
            </div>
            <div className="md:flex hidden flex-col justify-start md:justify-end gap-3">
                <div className="flex gap-2 items-center justify-start md:justify-end text-gray">
                    <CiFaceSmile className='text-2xl ' />
                    <p className='text-xs  '>{langText.excellent[lang]}</p>
                </div>
                <div className="flex items-center gap-2">
                    <img src="/images/visa_blue.webp" alt="visa" className="w-8" />
                    <img src="/images/logo-mastercard.svg" alt="mastercard" className="w-8" />
                    <img src="/images/logo-cash.svg" alt="cash" className="w-8" />
                </div>
            </div>
        </div>
  )
}

export default Hero
