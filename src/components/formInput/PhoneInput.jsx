import { useLangStore } from "../../assets/store/langStore";
import { langText } from "../../assets/constants/lang";
import { useState } from "react";

export default function PhoneInput(props) {
  const { lang } = useLangStore();
//   const[countryCode,setCountryCode]=useState("+20");

  return (
    <div className="w-full">
      <div className="relative flex w-full items-center gap-2">
        
        {/* Country Code Selector */}
        <select
        //   name={props.countryName}
          value={props.countryCode}
          onChange={(e)=>props.setCountryCode(e.target.value)}
        //   onBlur={props.handleBlur}
          className="h-9 border-0 border-b outline-0 border-[#E5E5E5] bg-transparent text-sm w-20 cursor-pointer"
        >
          <option value="+20">+20</option>
          <option value="+44">+44</option>
          <option value="+49">+49</option>
          <option value="+971">+971</option>
          <option value="+964">+964</option>
          <option value="+966">+966</option>
        </select>

        {/* Phone Number Input */}
        <input
          type="tel"
          name={props.name}
          id={props.name}
          className="w-full h-9 py-1.5 border-0 border-b outline-0 border-[#E5E5E5]"
          placeholder={props.placeholder}
        //   onChange={(e) => {
        //     const fullNumber = countryCode + e.target.value;
        //     props.handleChange({
        //       target: { name: props.name, value: fullNumber },
        //     });
        //   }}
            onChange={props.handleChange}
          onBlur={props.handleBlur}
          value={props.values}
        />
      </div>

      {/* Error Message */}
      {props.errors && props.touched ? (
        <p className="text-red-600 text-xs mt-0.5">{props.errors}</p>
      ) : null}
    </div>
  );
}
