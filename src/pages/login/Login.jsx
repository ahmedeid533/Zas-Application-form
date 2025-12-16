import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormInput from "../../components/formInput/FormInput";
import { langText } from "../../assets/constants/lang";
import { useLangStore } from "../../assets/store/langStore";
import useAuthMutation from "../../assets/apis/auth/AuthMutation";

function Login() {
  const {loginMutation} = useAuthMutation();
  const navigate = useNavigate();
  const { lang } = useLangStore();
  function handelLogin(formData) {
    console.log(formData);
    loginMutation.mutate({username:formData.mobil,password:formData.password});
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
    <div className="justify-center items-center flex">
      <div className="bg-white w-full p-3 lg:max-w-[600px] mt-8">

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
          <p className="text-center text-[#262626] py-3 relative after:absolute after:w-[45%] after:h-px after:bg-[#e5e5e5] after:top-1/2 after:right-0 after:-translate-y-1/2 before:absolute before:w-[45%] before:h-px before:bg-[#e5e5e5] before:top-1/2 before:left-0 before:-translate-y-1/2">{langText.or[lang]}</p> */}
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
            <button className="bg-primary border border-primary hover:bg-white hover:text-primary transition w-full rounded-full py-2 text-lg text-center text-white cursor-pointer ">
              {langText.login[lang]}
            </button>
          </form>
          <p className="my-2 text-center">
            {langText.dontHaveAnAccount[lang]}{" "}
            <a
              onClick={() => {
                navigate("/register");
                onClose();
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

export default Login;