import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormInput from "../../components/formInput/FormInput";
import { langText } from "../../assets/constants/lang";
import { useLangStore } from "../../assets/store/langStore";
import PhoneInput from "../../components/formInput/PhoneInput";
import { useState } from "react";
import useAuthMutation from "../../assets/apis/auth/AuthMutation";

function Register() {
  const navigate = useNavigate();
  const { lang } = useLangStore();
  // const[countryCode,setCountryCode]=useState("+20");
  const { registerMutation } = useAuthMutation();

  function handelRegister(formData) {
    console.log(formData);
    registerMutation.mutate(formData);
  }
const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required(langText.firstNameIsRequired[lang]),
  middleName: Yup.string().required(langText.middleNameIsRequired[lang]),
  lastName: Yup.string().required(langText.lastNameIsRequired[lang]),

  email: Yup.string().when("Subscribe", {
    is: true,
    then: (schema) =>
      schema
        .required(langText.emailIsRequired[lang])
        .email(langText.pleaseEnterAValidEmailAddress[lang]),
    otherwise: (schema) => schema.notRequired(),
  }),

  password: Yup.string()
    .required(langText.PasswordIsRequired[lang])
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      langText.passwordMustContainAtLeast8CharactersOneUppercaseOneLowercaseOneNumberAndOneSpecialCharacter[lang]
    ),

  mobil: Yup.string()
    .required(langText.phoneNumberIsRequired[lang])
    .matches(/^0?(10|11|12|15)[0-9]{8}$/, langText.pleaseEnterAValidPhoneNumber[lang]),

  Subscribe: Yup.boolean(),
});

    let formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      mobil: "",
      Subscribe: false
    },
    onSubmit: handelRegister,
    validationSchema: RegisterSchema,
  });
  return (
    <div className="justify-center items-center flex">
      <div className="bg-white w-full p-3 lg:max-w-[600px] mt-8">
        <p className="text-4xl text-center py-4 ">
          {langText.createAnAccount[lang]}
        </p>
        <div className="flex flex-col gap-6 px-7 mt-3">
          {/* <button className="cursor-pointer flex border h-9 w-full items-center border-[#e5e5e5] text-[#212529]">
            <img
              src="/images/icon_goolge.svg"
              className="aspect-square h-full"
              alt="google"
            />
            <p className="flex-1 text-center text-sm">
              {langText.CotinueWithGoogle[lang]}
            </p>
          </button>
          <button className="cursor-pointer flex border h-9 w-full items-center py-1 pl-2 bg-[#5777b9] border-[#5777b9] text-[#212529]">
            <img
              src="/images/icon_fb.svg"
              className="aspect-square h-full"
              alt="facebook"
            />
            <p className="flex-1 text-white text-center text-sm">
              {langText.CotinueWithFacebook[lang]}
            </p>
          </button>
          <p className="text-center text-[#262626] py-3 relative after:absolute after:w-[45%] after:h-px after:bg-[#e5e5e5] after:top-1/2 after:right-0 after:-translate-y-1/2 before:absolute before:w-[45%] before:h-px before:bg-[#e5e5e5] before:top-1/2 before:left-0 before:-translate-y-1/2">{langText.or[lang]}</p> */}
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
            <FormInput
              name="firstName"
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.firstName}
              errors={formik.errors.firstName}
              touched={formik.touched.firstName}
              type="text"
              placeholder={langText.firstName[lang]}
            />
            <FormInput
              name="middleName"
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.middleName}
              errors={formik.errors.middleName}
              touched={formik.touched.middleName}
              type="text"
              placeholder={langText.middleName[lang]}
            />
            <FormInput
              name="lastName"
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.lastName}
              errors={formik.errors.lastName}
              touched={formik.touched.lastName}
              type="text"
              placeholder={langText.lastName[lang]}
            />
            <FormInput
              name="email"
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              value={formik.values.email}
              errors={formik.errors.email}
              touched={formik.touched.email}
              type="email"
              placeholder={langText.email[lang]}
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
            {/* <PhoneInput
              name="phone"
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              values={formik.values.phone}
              errors={formik.errors.phone}
              touched={formik.touched.phone}
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              placeholder={langText.phoneNumber[lang]}
            /> */}

            <div className="relative">
              
            </div>
            <div className="flex items-center gap-3">
              <label class="relative inline-flex items-center">
                <input
                  type="checkbox"
                  name="Subscribe"
                  id="Subscribe"
                  onChange={formik.handleChange}
                  checked={formik.values.Subscribe}
                  class="peer appearance-none w-4 h-4 border border-gray-400 rounded-xs bg-neutral-secondary-medium checked:bg-primary checked:border-primary"
                />
                <span class="pointer-events-none absolute text-white text-[10px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold opacity-0 peer-checked:opacity-100">
                  ✔
                </span>
              </label>
              <label htmlFor="Subscribe" className="text-[#6b6b6b] text-sm">
                {langText.SubscribeToOurNewsletter[lang]}
              </label>
            </div>
            <p className="flex flex-wrap text-sm text-nowrap gap-1 text-[#6b6b6b]">{langText.ByCreatingAnAccountYouAgreeToThe[lang]} <a target="_blanck" href="https://skyculinaire.com/privacy-policy.php" className="text-primary">{langText.PrivacyPolicy[lang]}</a> {langText.andToThe[lang]} <a target="_blanck" href="https://skyculinaire.com/website-terms.php" className="text-primary">{langText.termsOfUse[lang]}</a></p>
            <button className="bg-primary border border-primary hover:bg-white hover:text-primary transition w-full rounded-full py-2 text-lg text-center text-white cursor-pointer ">
              {langText.createAnAccount[lang]}
            </button>
          </form>
          <p className="my-2 text-center">
            {langText.alreadyHaveAnAccount[lang]}{" "}
            <a
              onClick={() => {
                navigate("/login");
                onClose();
              }}
              className="text-primary cursor-pointer text-nowrap"
            >
              {langText.login[lang]}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;