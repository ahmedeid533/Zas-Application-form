import { useState } from "react";
import { langText } from "../../assets/constants/lang";
import { useLangStore } from "../../assets/store/langStore";
import { useNavigate } from "react-router-dom";
import { useAddressStore } from "../../assets/store/addressStore";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useCartStore } from "../../assets/store/cartStore";

export default function FormInput(props) {
    const [type, setType] = useState(props.type);
        const {lang,toggleLang} = useLangStore();
        const navigate = useNavigate();
        const {address,setAddress,isAddressMap,setIsAddressMap}=useAddressStore();
        const {setDeliveryFee}=useCartStore();
    
  return (
    <>
      <div className="w-full">
        <div className="relative w-full">
          <input
            type={type}
            name={props.name}
            id={props.name}
            className={`w-full h-9 py-1.5 border-0 border-b outline-0 border-[#E5E5E5] ${(props.name==="addressInput"||props.name==="password")&&"pe-8"}`}
            placeholder={props.placeholder}
              onChange={(e) => {
    props.handleChange(e); // ✅ ALWAYS

    if (props.name === "addressInput") {
      setIsAddressMap(false);
      setAddress(e.target.value);
      setDeliveryFee(10);
    }
  }}
            onBlur={props.handleBlur}
value={
    props.name === "addressInput" && isAddressMap
      ? address
      : props.value
  }            list={props.list}
          />
          {props.type === "password" && (
            <span
              onClick={() => setType(type === "password" ? "text" : props.type)}
              className={`absolute end-0 top-1/2 -translate-y-1/2 text-[#262626] text-xs z-10 cursor-pointer ${props.className}`}
            >
              {type === "password" ? langText.show[lang] : langText.hide[lang]}
            </span>
          )}
          {props.name === "addressInput" && (
            <span
              onClick={() => navigate("/map")}
              className={`absolute end-0 top-1/2 -translate-y-1/2 text-[#262626] text-xs z-10 cursor-pointer ${props.className}`}
            >
              <FaMapMarkerAlt className="text-lg text-primary hover:scale-125 transition-all duration-500" />
            </span>
          )}
        </div>
        {props.errors && props.touched ? (
          <p className="text-red-600 text-xs mt-0.5">{props.errors}</p>
        ) : null}
      </div>
    </>
  );
}