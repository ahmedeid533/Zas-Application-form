import React, { useEffect, useMemo, useRef, useState } from 'react'
import Accordion from './Accordion'
import AccordionItem from './AccordionItem'
import { IoIosSearch } from "react-icons/io";
import { langText } from '../assets/constants/lang';
import { useLangStore } from '../assets/store/langStore';
import { FaPlus } from "react-icons/fa";
import { useQuery } from '@tanstack/react-query';
import { GetAllProducts } from '../assets/apis/product/PeoductApi';
import { useCartStore } from '../assets/store/cartStore';
import useAuthStore from '../assets/store/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loading from '../pages/loading/Loading';


function Menu() {
        const { lang } = useLangStore();
        const [activeIndex, setActiveIndex] = useState(null);
        const {addToCart,cart}=useCartStore();
        const [data,setData]=useState([]);
        const navigate =useNavigate();
        const user = useAuthStore((state) => state.user);
const [search, setSearch] = useState("");

        const{data:items,isLoading}=useQuery({
            queryKey:['products'],
            queryFn:GetAllProducts,
            staleTime:Infinity,
            cacheTime:Infinity,
            retry:5,
        })
        useEffect(()=>{
            if(data){
                console.log("data",data);
            }
        },[data])


  // عند الضغط على زر تصنيف نعيّن activeIndex
  const onCategoryClick = (idx) => {
    setActiveIndex(idx);
  };
const accordionItems = useMemo(() => {
  // if (!data) {
  //   return [
  //     {
  //       header: (
  //         <h2 className="text-lg text-heading">
  //           {langText.pickForYou[lang]}
  //         </h2>
  //       ),
  //       body: (
  //         <>
  //           {/* محتوى افتراضي */}
  //         </>
  //       ),
  //     },
  //   ];
  // }

  // تأكد إن groups مصفوفة حتى لو عاد السيرفر كائن واحد
  const groups = Array.isArray(data) ? data : [data];

  // نكوّن مصفوفة عناصر الأكورديون من الـ grand groups
  const groupItems = groups.map((grandGroup) => {
    // نحصل على مصفوفة كل العناصر عبر flatMap (يجمع كل itemDatas)
    const itemsFlat = (grandGroup?.mainGroup ?? []).flatMap(
      (mainGroup) => mainGroup?.itemDatas ?? []
    );







    return {
      header: (
        <h2 className="text-lg text-heading" key={`g-${grandGroup?.FoodMenuGrandGroupId ?? grandGroup?.FoodMenuGrandGroupName}`}>
          {grandGroup?.FoodMenuGrandGroupName}
        </h2>
      ),
      body: (
        <div key={`body-${grandGroup?.FoodMenuGrandGroupId ?? grandGroup?.FoodMenuGrandGroupName}`}>
          {itemsFlat.length === 0 ? (
            <p className="text-sm text-gray">No items</p>
          ) : (
            itemsFlat.map((item) => (
              <div
                className="py-4 md:py-5 flex gap-3 border-0 border-b border-b-light-gray"
                key={item.FoodMenuItemId}
              >
                <div className="w-16 h-16 p-1 border border-light-gray">
                  <img
                    src="/images/shawarma.webp"
                    alt={item.FoodMenuItemName}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="w-1/2">
                  <h2 className="">{item?.FoodMenuItemName}</h2>
                  <p className="text-gray text-xs">
                    {item?.FoodMenuItemDescription || ""}
                  </p>
                </div>

                <div className="ml-auto">
                  <p>EGP {item?.FoodMenuItemPrice}</p>
                </div>

                <div className="self-end">
                  <div className="w-6 h-6 flex cursor-pointer items-center justify-center bg-primary rounded-full"                           onClick={() => {
                            if (!user) {
                              toast.error(langText.pleaseLoginFirst[lang], {
                                id: 1,
                              });
                              navigate("/login");
                              return;
                            }

                            addToCart({...item, quantity: 1});
                          }}>
                    <FaPlus className="text-white text-md" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ),
    };
  });

  // عنصر pickForYou تضعه في البداية (أو في النهاية حسب ما تريده)
//   const pickForYou = {
//     header: (
//         <h2 className="text-lg text-heading">
//           {langText.pickForYou[lang]}
//         </h2>
//       ),
//       body: (
//         <>
//         <div className="py-4 md:py-5 flex gap-3 border-0 border-b border-b-light-gray">
//             <div className="w-16 h-16 p-1 border border-light-gray">
//                 <img src="/images/shawarma.webp" alt="" className='w-full h-full object-cover object-center' />
//             </div>
//             <div className="w-1/2">

//             <h2 className="">Al Tabtaba Box Offer</h2>
//             <p className='text-gray text-xs'>2 Large saj chicken shawerma, 1 large saj kofta, 6 mini hawawshi, fries, sesame paste, garlic dip, pickles, Al Reem sauce, fried bread and Coca-Cola liter</p>
//             </div>
//             <div className='ml-auto'>
//                 <p>EGP 340.00</p>
//             </div>
//             <div className='self-end'>
//                 <div className="w-6 h-6 flex cursor-pointer items-center justify-center bg-primary rounded-full">
//                     <FaPlus className='text-white text-md' />
//                 </div>
//             </div>
//         </div>
 
//         </>
    //   )
//   };

  // نرجع مصفوفة مسطّحة من العناصر: [pickForYou, ...groupItems]
  return [ ...groupItems];
}, [data, lang, langText]);

const searchInGrandGroups = (dataArray, searchText) => {
  return dataArray
    .map(grandGroup => {
      const filteredMainGroup = grandGroup.mainGroup
        .map(group => {
          const matchedItems = group.itemDatas.filter(item =>
            item.FoodMenuItemName
              .toLowerCase()
              .includes(searchText.toLowerCase())
          );

          return matchedItems.length
            ? { ...group, itemDatas: matchedItems }
            : null;
        })
        .filter(Boolean);

      return filteredMainGroup.length
        ? { ...grandGroup, mainGroup: filteredMainGroup }
        : null;
    })
    .filter(Boolean);
};


useEffect(() => {
  if (!items) return;

  if (search.trim() === "") {
    setData(items);
  } else {
    const filteredData = searchInGrandGroups(items, search);
    setData(filteredData);
  }
}, [items, search]);

if(isLoading){
  return <Loading  />;
}
    
  return (
    <div className="w-full flex">
                        <div className="lg:w-1/3 hidden lg:block pe-2 ">
                        <div className="border-[#0000001f] border-[0.5px] rounded-xs shadow-md p-4 flex flex-col gap-4 sticky top-2" >
                            <p className=''>{langText.categories[lang]}</p>
                            {data?.map((grandGroup,idx)=>(
                                <p key={grandGroup?.FoodMenuGrandGroupId} onClick={() => onCategoryClick(idx)}  className='text-[#767676] text-xs cursor-pointer'>{grandGroup?.FoodMenuGrandGroupName}</p>
                            ))}
                            {/* <p className='text-[#767676] text-xs cursor-pointer'>{langText.pickForYou[lang]}</p>
                            <p className='text-[#767676] text-xs cursor-pointer'>{langText.offers[lang]}</p>
                            <p className='text-[#767676] text-xs cursor-pointer'>{langText.sandwiches[lang]}</p>
                            <p className='text-[#767676] text-xs cursor-pointer'>{langText.meals[lang]}</p>
                            <p className='text-[#767676] text-xs cursor-pointer'>{langText.grills[lang]}</p>
                            <p className='text-[#767676] text-xs cursor-pointer'>{langText.desserts[lang]}</p>
                            <p className='text-[#767676] text-xs cursor-pointer'>{langText.desserts[lang]}</p>
                            <p className='text-[#767676] text-xs cursor-pointer'>{langText.drinks[lang]}</p>
                            <p className='text-[#767676] text-xs cursor-pointer'>{langText.salads[lang]}</p> */}
                        </div>
                        </div>
                        <div className="lg:w-2/3 w-full lg:px-2 flex flex-col gap-2">
                        <div className='relative w-full'>
                        <input onChange={(e) => setSearch(e.target.value)} onFocus={(e)=>{e.target.style.borderColor="#B88E52"}} onBlur={(e)=>{e.target.style.borderColor="#767675"}} type="text" placeholder={langText.searchMenuItems[lang]} className='w-full  h-10 p-2.5 pr-8 border border-[#767675] rounded-xs shadow-md outline-0' />
                        <IoIosSearch className='end-4 text-[#767676] top-1/2 transform -translate-y-1/2 absolute text-2xl cursor-pointer'/>
                        </div>
                        <div className="flex flex-col gap-2">
                            
<Accordion allowMultiple={true} activeIndex={activeIndex}>
                    {accordionItems.map((item, idx) => (
                      <AccordionItem key={idx} idPrefix="accordion-open" index={idx}>
                        {{
                          header: item.header,
                          body: item.body
                        }}
                      </AccordionItem>
                    ))}
                  </Accordion>

                        </div>
                        </div>
                    </div>
  )
}

export default Menu
