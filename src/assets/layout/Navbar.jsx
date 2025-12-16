import React, { useEffect, useRef, useState } from "react";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { FaBagShopping } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { HiOutlineMenu } from "react-icons/hi";
import { useLangStore } from "../store/langStore";
import { langText } from "../constants/lang";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormInput from "../../components/formInput/FormInput";
import { useNavigate } from "react-router-dom";
import { GiShoppingCart } from "react-icons/gi";
import { FaRegUser } from "react-icons/fa6";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import { useScreenViewStore } from "../store/screenViewStore";
import useCheckAuthUser from "../apis/auth/useCheckAuthUser";
import useAuthStore from "../store/authStore";
import useAuthMutation from "../apis/auth/AuthMutation";
import { useCartStore } from "../store/cartStore";

function Navbar() {
  const {setNavBarHeight}=useScreenViewStore();
  const ref =useRef(null);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const { lang, toggleLang } = useLangStore();
  const {user,logout}=useAuthStore();
  console.log("user",user);
  const{cart,getTotalItems,clearCart}=useCartStore();
  
  const isLogin =user ? true : false;
  const [userPopUp, setUserPopUp] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false); // My Account submenu in mobile panel
  const navigate = useNavigate();

  function closeAllPopups() {
    setIsCountryOpen(false);
    setUserPopUp(null);
  }
  function handelLogOut() {
    logout();
    clearCart();
    go("/");
  }

  // helper to navigate and close mobile menu
  const go = (path) => {
    navigate(path);
    setMobileOpen(false);
    setAccountOpen(false);
    closeAllPopups();
  };

  useEffect(() => {
    console.log("navbar height",ref.current.offsetHeight);
    
    setNavBarHeight(ref.current.offsetHeight);
    }, [ref]);

  return (
    <nav
      ref={ref}
      className={`bg-secondary  z-40  w-full ${
        mobileOpen ? "fixed " : "relative"
      }`}
    >
      {/* <p className=" animate-flash-text absolute lg:end-1 md:end-0 top-1/2 pr-2  -translate-y-1/2  text-sm text-center hidden lg:block">
        {langText.minOrder[lang]}
        <br/>
        {langText.EGP80[lang]}
      </p> */}
      <div className="container mx-auto ">
        <div className="flex items-center justify-between px-6 md:px-16 py-3">
          {/* start area: hamburger (mobile) + logo (clickable) */}
          <div className="flex items-center gap-4">
            {/* Hamburger only on mobile */}
            <button
              onClick={() => {
                setMobileOpen((s) => !s);
                // close other popups when opening mobile menu
                setIsCountryOpen(false);
                setUserPopUp(null);
              }}
              className="md:hidden p-2 rounded text-primary"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <IoMdClose className="text-2xl" />
              ) : (
                <HiOutlineMenu className="text-2xl" />
              )}
            </button>

            <a
              onClick={() => {
                navigate("/");
                setMobileOpen(false);
              }}
              className="w-44 md:w-56 cursor-pointer group relative hidden md:block"
            >
              <img src="/images/login-logo.png" className="w-full" alt="logo" />
              {/* <div
                className={`absolute start-full top-1/2 -translate-y-1/2  bg-[#F5F5F5] border rounded-lg transition duration-300  opacity-0 pointer-events-none group-hover:opacity-100 z-10 border-primary text-sm p-3 after:absolute after:start-0 after:top-1/2 ${
                  lang == "EN"
                    ? "after:-translate-x-1/2"
                    : "after:translate-x-1/2 after:rotate-z-180"
                } after:-translate-y-1/2 after:w-4 after:h-4 after:bg-[#F5F5F5] after:rotate-45 after:-skew-2 after:border pointer-events-none after:border-primary after:border-t-0 after:border-r-0 `}
              >
                <p className="text-nowrap">{langText.skyAddresses[lang]}</p>
                <p className="text-nowrap">{langText.kindOfFood[lang]}</p>
              </div> */}
            </a>
          </div>

          {/* end actions */}
          <div className="flex items-center gap-4">
            {/* Desktop actions (hidden on mobile) */}
            <div className="hidden md:flex items-center justify-end gap-8">
              <button
                onClick={toggleLang}
                className="bg-primary rounded-full flex items-center justify-center gap-3 text-white cursor-pointer py-2 px-4 h-10"
              >
                <span className="text-xl font-semibold">
                  {lang === "AR" ? "EN" : "AR"}
                </span>
                <AiOutlineGlobal className="text-2xl" />
              </button>

              <button
                onClick={() => {
                  setIsCountryOpen(!isCountryOpen);
                  setUserPopUp(null);
                }}
                className="bg-primary rounded-full flex items-center justify-center text-white cursor-pointer p-2 h-10 w-10 relative"
              >
                <img
                  src="/images/flag-eg.webp"
                  className="w-full"
                  alt="egypt flag"
                />

                <div
                  className={`absolute bg-white w-70 top-14 py-6 flex flex-col gap-6 border text-black after:w-3 after:h-3 after:border-t after:border-l after:bg-white after:absolute after:top-0 after:start-1/2 after:-translate-y-1/2 after:-translate-x-1/2 after:rotate-45 cursor-auto transition duration-300 ${
                    isCountryOpen
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="flex justify-between items-center  text-black px-5 py-3">
                    <p className="font-semibold ">
                      {langText.selectCountry[lang]}
                    </p>
                    <IoMdClose
                      onClick={() => setIsCountryOpen(false)}
                      className="text-xl cursor-pointer"
                    />
                  </div>
                  <ul>
                    <li
                      onClick={() => setIsCountryOpen(false)}
                      className="flex gap-6 items-center text-black px-5 py-3 hover:bg-gray-100 hover:text-primary cursor-pointer"
                    >
                      <img
                        src="/images/flag-eg.webp"
                        className="w-9"
                        alt="egypt flag"
                      />
                      <span>Egypt</span>
                    </li>

                  </ul>
                </div>
              </button>

              <button
                onClick={() => {
                  setUserPopUp(
                    userPopUp == null ? (isLogin ? "menu" : "popup") : null
                  );
                  setIsCountryOpen(false);
                }}
                className="bg-primary rounded-full flex items-center justify-center text-white cursor-pointer relative p-2 h-10 w-10"
              >
                <FaUser className="text-xl" />

                <div
                  className={`absolute bg-white w-70 top-14 py-6 flex flex-col gap-6 border text-black after:w-3 after:h-3 after:border-t after:border-l after:bg-white after:absolute after:top-0 after:start-1/2 after:-translate-y-1/2 after:-translate-x-1/2 after:rotate-45 cursor-auto transition duration-300 ${
                    userPopUp == "menu"
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <ul>
                    <li
                      onClick={() => {
                        navigate("/my-account/orders");
                        closeAllPopups();
                      }}
                      className="flex gap-6 items-center text-black px-5 py-3 hover:bg-gray-100 hover:text-primary cursor-pointer"
                    >
                      <GiShoppingCart className="text-primary text-3xl" />
                      <span>{langText.myOrders[lang]}</span>
                    </li>
                    <li
                      onClick={() => {
                        navigate("/my-account/summary");
                        closeAllPopups();
                      }}
                      className="flex gap-6 items-center text-black px-5 py-3 hover:bg-gray-100 hover:text-primary cursor-pointer"
                    >
                      <FaRegUser className="text-primary text-2xl" />
                      <span>{langText.accountInfo[lang]}</span>
                    </li>
                    <li
                      onClick={() => {
                        navigate("/my-account/savedaddr");
                        closeAllPopups();
                      }}
                      className="flex gap-6 items-center text-black px-5 py-3 hover:bg-gray-100 hover:text-primary cursor-pointer"
                    >
                      <FaMapLocationDot className="text-primary font-light text-2xl" />
                      <span>{langText.savedAddresses[lang]}</span>
                    </li>
                    {isLogin && (
                      <li
                        onClick={() => {
                          handelLogOut();
                        }}
                        className="flex gap-6 items-center text-black px-5 py-3 hover:bg-gray-100 hover:text-primary cursor-pointer"
                      >
                        <IoIosLogOut className="text-primary text-2xl" />
                        <span>{langText.logout[lang]}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </button>

              {isLogin && (

              <button
                onClick={() => {
                  navigate("/cart");
                }}
                className="relative bg-primary rounded-full flex items-center justify-center text-black cursor-pointer p-2 h-10 w-10"
              >
                <FaBagShopping className="text-xl" />
               {cart?.length > 0 && (<>
                <div className="w-7 h-7 rounded-full top-[65%] start-[65%] absolute bg-white border border-secondary flex items-center justify-center aspect-square">
                  {getTotalItems()}
                </div>
               </>)}
              </button>
            )}
                      <p className=" animate-flash-text text-sm text-center">
                        {langText.minOrder[lang]}
                        <br />
                        {langText.EGP80[lang]}
                      </p>
                  
            </div>

            {/* Mobile language & country shown always on right side */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleLang}
                className="bg-primary rounded-full flex items-center justify-center gap-2 text-white px-3 py-1"
              >
                <span className="font-semibold">{lang}</span>
                <AiOutlineGlobal />
              </button>

              <div className="relative">
                <button
                  onClick={() => {
                    setIsCountryOpen((s) => !s);
                    setUserPopUp(null);
                  }}
                  className="bg-primary rounded-full flex items-center justify-center text-white cursor-pointer p-2 h-10 w-10"
                >
                  <img
                    src="/images/flag-eg.webp"
                    className="w-full"
                    alt="egypt flag"
                  />
                </button>

                {/* mobile country dropdown (simple) */}
                <div
                  className={`absolute end-0 mt-2 bg-white border text-black w-56 py-4 transition-opacity duration-200 ${
                    isCountryOpen
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="px-4 flex justify-between items-center">
                    <p className="font-semibold">Select country</p>
                    <IoMdClose
                      onClick={() => setIsCountryOpen(false)}
                      className="cursor-pointer"
                    />
                  </div>
                  <ul className="mt-2">
                    <li
                      onClick={() => setIsCountryOpen(false)}
                      className="flex gap-3 items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <img
                        src="/images/flag-eg.webp"
                        className="w-8"
                        alt="egypt"
                      />
                      <span>Egypt</span>
                    </li>
                  </ul>
                </div>
              </div>
{isLogin && (

              <button
                onClick={() => {
                  navigate("/cart");
                }}
                className="relative bg-primary rounded-full flex items-center justify-center text-black cursor-pointer p-2 h-10 w-10"
              >
                <FaBagShopping className="text-xl" />
               {cart?.length > 0 && (<>
                <div className="w-7 h-7 rounded-full top-[65%] start-[65%] absolute bg-white border border-secondary flex items-center justify-center aspect-square">
                  {getTotalItems()}
                </div>
               </>)}
              </button>
            )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE EXPANDED MENU PANEL (appears under header, same bg-secondary) */}
      <div
        className={`md:hidden overflow-hidden transition-[max-height,min-height,height] duration-300 ease-in-out ${
          mobileOpen
            ? "h-[calc(100vh-64px)] max-h-[calc(100vh-64px)]"
            : "h-0 max-h-0"
        }`}
      >
        <div className="px-6 pb-6 bg-secondary h-full">
          <ul className="flex flex-col gap-4 text-primary pt-4">
            <li>
              <button
                onClick={() => go("/")}
                className="text-start w-full text-lg"
              >
                {langText.home && langText.home[lang]
                  ? langText.home[lang]
                  : "Home"}
              </button>
            </li>

            {isLogin ? (
              <li>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setAccountOpen((s) => !s)}
                    className="text-start w-full text-lg flex items-center gap-2"
                  >
                    {langText.myAccount && langText.myAccount[lang]
                      ? langText.myAccount[lang]
                      : "My Account"}
                  </button>
                  <button
                    onClick={() => setAccountOpen((s) => !s)}
                    className="text-xl px-2"
                  >
                    <svg
                      className={`w-4 h-4 transform transition-transform duration-300 ${
                        accountOpen ? "rotate-45" : "rotate-0"
                      }`}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>

                <div
                  className={`mt-2 ps-6 overflow-hidden transition-[max-height] duration-300 ${
                    accountOpen ? "max-h-60" : "max-h-0"
                  }`}
                >
                  <ul className="flex flex-col gap-2 text-sm text-primary">
                    <li>
                      <button
                        onClick={() => go("/my-account/orders")}
                        className="w-full text-start"
                      >
                        {langText.myOrders[lang]}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => go("/my-account/summary")}
                        className="w-full text-start"
                      >
                        {langText.accountInfo[lang]}
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => go("/my-account/savedaddr")}
                        className="w-full text-start"
                      >
                        {langText.savedAddresses[lang]}
                      </button>
                    </li>
                    {isLogin && (
                      <li>
                        <button
                          onClick={() => handelLogOut()}
                          className="w-full text-start"
                        >
                          {langText.logout[lang]}
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              </li>
            ) : (
              <li
                className="text-start w-full text-lg"
                onClick={() => {
                  setUserPopUp("popup");
                }}
              >
                {langText.login[lang]}
              </li>
            )}

            <li>
              <button
                onClick={() => go("/contact-us")}
                className="text-start w-full text-lg"
              >
                {langText.contactUs ? langText.contactUs[lang] : "Contact Us"}
              </button>
            </li>

            <li>
              <button
                onClick={() => go("/become-partner")}
                className="text-start w-full text-lg"
              >
                {langText.becomePartner
                  ? langText.becomePartner[lang]
                  : "Become a partner"}
              </button>
            </li>

            <li>
              <button
                onClick={() => go("/offers")}
                className="text-start w-full text-lg"
              >
                {langText.offers ? langText.offers[lang] : "Offers"}
              </button>
            </li>

            <li>
              <button
                onClick={() => go("/corporate")}
                className="text-start w-full text-lg"
              >
                {langText.corporate ? langText.corporate[lang] : "Corporate"}
              </button>
            </li>
            {isLogin && (
              <li>
                <button
                  onClick={() => handelLogOut()}
                  className="text-start w-full text-sm text-primary"
                >
                  {langText.logout[lang]}
                </button>
              </li>
            )}
            
          </ul>
        </div>
      </div>

      {/* keep your login popup if used */}
      {userPopUp == "popup" && (
        <LoginPopup onClose={closeAllPopups} lang={lang} go={go} />
      )}
    </nav>
  );
}

export default Navbar;


function LoginPopup({ lang, onClose,go }) {
  // const navigate = useNavigate();
  const {loginMutation}=useAuthMutation();
function handelLogin(formData) {
  console.log(formData);

  loginMutation.mutate(
    {
      username: formData.mobil,
      password: formData.password
    },
    {
      onSuccess: () => {
        onClose();
        go("/");
      },
      onError: (error) => {
        console.log("Login error:", error);
        toast.error(langText.somethingWentWrongTryAgain[lang], { id: 1 });
      },
    }
  );
}

  const loginSchema = Yup.object().shape({
  mobil: Yup.string()
    .required(langText.phoneNumberIsRequired[lang])
    .matches(/^0?(10|11|12|15)[0-9]{8}$/, langText.pleaseEnterAValidPhoneNumber[lang]),
     password: Yup.string()
        .required(langText.PasswordIsRequired[lang])
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          langText.passwordMustContainAtLeast8CharactersOneUppercaseOneLowercaseOneNumberAndOneSpecialCharacter[lang]
        ),
  });
  let formik = useFormik({
    initialValues: {
      mobil: "",
      password: "",
    },
    onSubmit: handelLogin,
    validationSchema: loginSchema,
  });
  return (
    <div className="fixed top-0 p-5 start-0 bg-[rgba(0,0,0,0.5)] h-screen w-screen  justify-center items-center flex z-50">
      <div className="bg-white w-full p-3 lg:max-w-[500px]">
        <div className="flex justify-end">
          <IoMdClose onClick={() => onClose()} className="text-xl cursor-pointer" />
        </div>
        <p className="text-4xl text-center py-4 ">{langText.login[lang]}</p>
        <div className="flex flex-col gap-6 px-7 mt-3">
          {/* <button className="cursor-pointer flex border h-9 w-full items-center border-[#e5e5e5] text-[#212529]">
            <img src="/images/icon_goolge.svg" className="aspect-square h-full" alt="google" />
            <p className="flex-1 text-center text-sm">{langText.CotinueWithGoogle[lang]}</p>
          </button>
          <button className="cursor-pointer flex border h-9 w-full items-center py-1 pl-2 bg-[#5777b9] border-[#5777b9] text-[#212529]">
            <img src="/images/icon_fb.svg" className="aspect-square h-full" alt="facebook" />
            <p className="flex-1 text-white text-center text-sm">{langText.CotinueWithFacebook[lang]}</p>
          </button>
          <p className="text-center text-[#262626] py-3">{langText.or[lang]}</p> */}
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
            <FormInput
                          name="mobil"
                          handleChange={formik.handleChange}
                          handleBlur={formik.handleBlur}
                          value={formik.values.mobil}
                          errors={formik.errors.mobil}
                          touched={formik.touched.mobil}
                          type="text"
                          placeholder={langText.phoneNumber[lang]}
                        />
            <FormInput
              name="password"
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.password}
              errors={formik.errors.password}
              touched={formik.touched.password}
              type="password"
              placeholder={langText.password[lang]}
            />
            <button className="w-fit cursor-pointer text-[#6b6b6b] text-sm mt-2">{langText.forgotPassword[lang]}</button>
            <button type="submit" className="bg-primary border border-primary hover:bg-white hover:text-primary transition w-full rounded-full py-2 text-lg text-center text-white cursor-pointer ">
              {langText.login[lang]}
            </button>
          </form>
          <p className="my-6 text-center">
            {langText.dontHaveAnAccount[lang]}{" "}
            <a
              onClick={() => {
                go("/register");
                // onClose();
              }}
              className="text-primary cursor-pointer text-nowrap"
            >
              {langText.createAnAccount[lang]}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
