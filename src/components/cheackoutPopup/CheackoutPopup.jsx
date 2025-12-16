import { useEffect, useState } from "react";
import { useAddressStore } from "../../assets/store/addressStore";
import { useCartStore } from "../../assets/store/cartStore";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { langText } from "../../assets/constants/lang";
import { useLangStore } from "../../assets/store/langStore";
import FormInput from "../formInput/FormInput";
import orderMutation from "../../assets/apis/order/OrderMutation";
import useAuthStore from "../../assets/store/authStore";
function CheackOutPopUp({onClose}) {
  const MIN_MINUTES = 20;
  const { lang } = useLangStore();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(MIN_MINUTES);
  const [fullDuration, setFullDuration] = useState("");
  const { getTotalPrice, serviceFee, deliveryFee,cart } = useCartStore();
  const {address,setAddress,isAddressMap,setIsAddressMap}=useAddressStore();
  const {CreateIndividualMutation,SaveIndividuaItemslMutation}=orderMutation({onClose});
  const {quatationData}=useAuthStore();
  console.log("cart",cart);
  
  


  const totalMinutes = days * 1440 + hours * 60 + minutes;

    function handelCheackout(formData) {
    console.log({...formData,deliveryDuration:fullDuration,totalPrice:getTotalPrice()+deliveryFee+serviceFee,address,isAddressMap});

CreateIndividualMutation.mutate({
orderHeaderAddPercent: 0,
orderHeaderDeliveryDateTime: fullDuration.date,
orderHeaderDiscountPercent: 0,
orderHeaderEmailAddress: "Test",
orderHeaderHasTransportaion: false,
orderHeaderId: 0,
orderHeaderMobileNumber: formData.phone,
orderHeaderOrderdByNotes: formData.note,
orderHeaderPriceListId: 0,
orderHeaderRemarks: null,
orderHeaderTransportationPercent: 0,
orderHeaderWhatsAppNumber: "",
orderHeaderAddress:address,
});
// SaveIndividuaItemslMutation.mutate([cart.map((item) => ({
//     orderDetailsId: 0,
//     orderDetailsHeaderId: quatationData?.header?.orderHeaderId||0,
//     orderDetailsItemId: item.FoodMenuItemId,
//     orderDetailsName: item.FoodMenuItemName,
//     orderDetailsPcking: "Standard Packing",
//     orderDetailsQty: item.quantity,
//     orderDetailsPackingId: 1,
//     orderDetailsPriceEgp: item.FoodMenuItemPrice,
// }))]);
    //
console.log("res",res);
    // loginMutation.mutate({username:formData.mobil,password:formData.password});
  }
  const cheackoutSchema = Yup.object().shape({
  phone: Yup.string()
    .required(langText.phoneNumberIsRequired[lang])
    .matches(/^0?(10|11|12|15)[0-9]{8}$/, langText.pleaseEnterAValidPhoneNumber[lang]),
addressInput: Yup.string().required(langText.addressIsRequired[lang]),
note:Yup.string()
  });
  let formik = useFormik({
    initialValues: {
      phone: "",
      addressInput: "",
      note:""
    },
    onSubmit: handelCheackout,
    validationSchema: cheackoutSchema,
  });

  useEffect(() => {
    // Enforce minimum duration
    if (totalMinutes < MIN_MINUTES) {
      setDays(0);
      setHours(0);
      setMinutes(MIN_MINUTES);
      return;
    }

    setFullDuration({
      days,
      hours,
      minutes,
      totalMinutes,
      isoDuration: `P${days}DT${hours}H${minutes}M`,
      date: new Date(Date.now() + totalMinutes * 60000),
    });
    console.log({
      days,
      hours,
      minutes,
      totalMinutes,
      isoDuration: `P${days}DT${hours}H${minutes}M`,
      date: new Date(Date.now() + totalMinutes * 60000),
    });
    
  }, [days, hours, minutes]);

  return (
    <div className=" fixed w-screen p-9 h-screen top-0 left-0 bg-[#00000066] flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col gap-3 max-w-lg w-full">
        <div className="ms-auto" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <p className="text-center font-semibold text-2xl mb-5">
          {langText.checkout[lang]}
        </p>
        <div className="flex gap-4 items-end test-sm mb-6">
          <p className="font-medium text-nowrap">
            {langText.deliveryAfter[lang]}
          </p>

          <div className="grid shrink grid-cols-3 border-0 border-b text-sm border-b-light-gray ">
            <Input
              label={langText.days[lang]}
              value={days}
              onChange={setDays}
              min={0}
            />
            <Input
              label={langText.hours[lang]}
              value={hours}
              onChange={setHours}
              min={0}
              max={23}
            />
            <Input
              label={langText.minutes[lang]}
              value={minutes}
              onChange={setMinutes}
              min={0}
              max={59}
            />
          </div>
        </div>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
          <FormInput
            name="phone"
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            value={formik.values.phone}
            errors={formik.errors.phone}
            touched={formik.touched.phone}
            type="text"
            placeholder={langText.phoneNumber[lang]}
          />
          <FormInput
            name="addressInput"
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            value={formik.values.addressInput}
            errors={formik.errors.addressInput}
            touched={formik.touched.addressInput}
            type="text"
            placeholder={langText.deliveryAddress[lang]}
          />
          <textarea
            className="w-full py-3 px-2 border border-light-gray rounded-lg focus:outline-none focus:border-primary resize-none"
            rows={3}
            placeholder={langText.additionalNotesInstructions[lang]}
            name="note"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.note}
          />

          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between py-2 border-0 border-b border-b-light-gray">
              <p className="font-semibold">{langText.subtotal[lang]}</p>
              <p>{getTotalPrice()}</p>
            </div>
            <div className="flex items-center justify-between py-2 border-0 border-b border-b-light-gray">
              <p className="font-semibold">
                {langText.deliveryFee[lang]} {!isAddressMap ? "(min)" : null}
              </p>
              <p>{deliveryFee}</p>
            </div>
            <div className="flex items-center justify-between py-2 border-0 border-b border-b-light-gray">
              <p className="font-semibold">{langText.servviceFee[lang]}</p>
              <p>{serviceFee}</p>
            </div>
            <div className="flex items-center justify-between py-2 border-0 ">
              <p className="font-semibold ">{langText.totalAmountEGP[lang]}</p>
              <p className="text-xl text-primary">
                {getTotalPrice() + deliveryFee + serviceFee}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary border border-primary hover:bg-white hover:text-primary transition w-full rounded-full py-2 text-lg text-center text-white cursor-pointer "
          >
            {langText.checkout[lang]}
          </button>
        </form>
      </div>
    </div>
  );
}
export default CheackOutPopUp;
function Input({ label, value, onChange, min, max }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className=" px-3 py-2  focus:outline-none border-0 focus:border-b focus:border-b-primary"
      />
    </div>
  );
}