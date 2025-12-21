import React, { useEffect, useMemo, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray, useFormikContext } from "formik";
import * as Yup from "yup";
import { FaTrashAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { GetDepartments, GetDepartment,GetGenders,GetLocations,GetJobs, GetCountries, GetHowDoYouKnow, GetSocials } from "../../assets/apis/applyingJob/ApplyingJobApi";
import { useQuery } from "@tanstack/react-query";
import { IoCheckmarkSharp } from "react-icons/io5";
import { useScreenViewStore } from "../../assets/store/screenViewStore";
import { uploadToCloudinary } from "../../cloudinary/cloudinary";
import toast from "react-hot-toast";

/**
 * ApplyingForm — React component (code/react)
 * - Tailwind CSS utility classes assumed
 * - Sends data as FormData to API (cv + photo included as files)
 * - Live summary updates on every field change (uses Formik `values`)
 * - Submit sends to API_URL; on success shows a thank-you message
 *
 * Added features in this version:
 * - Repeatable `experiences` array (company, years, role) with Add / Delete
 * - Repeatable `education` array (institution, degree, year) with Add / Delete
 * - Location split into three parts: country, city, area
 */

const API_URL = "https://apitest.skyculinaire.com/api/CV/CVTransaction/NewEmployee"; 

// Minimal country list (can be extended to full list easily)
const COUNTRY_CODES = [
  { code: "+1", label: "US / Canada" },
  { code: "+44", label: "United Kingdom" },
  { code: "+49", label: "Germany" },
  { code: "+33", label: "France" },
  { code: "+39", label: "Italy" },
  { code: "+34", label: "Spain" },
  { code: "+31", label: "Netherlands" },
  { code: "+46", label: "Sweden" },
  { code: "+47", label: "Norway" },
  { code: "+45", label: "Denmark" },
  { code: "+48", label: "Poland" },
  { code: "+90", label: "Turkey" },
  { code: "+91", label: "India" },
  { code: "+61", label: "Australia" },
  { code: "+64", label: "New Zealand" },
  { code: "+81", label: "Japan" },
  { code: "+82", label: "South Korea" },
  { code: "+86", label: "China" },
  { code: "+971", label: "UAE" },
  { code: "+966", label: "Saudi Arabia" },
  { code: "+20", label: "Egypt" },
  { code: "+57", label: "Colombia" },
  { code: "+54", label: "Argentina" },
  { code: "+55", label: "Brazil" },
  { code: "+60", label: "Malaysia" },
  { code: "+63", label: "Philippines" },
  { code: "+66", label: "Thailand" },
  { code: "+62", label: "Indonesia" },
  { code: "+51", label: "Peru" },
  { code: "+351", label: "Portugal" },
  { code: "+351", label: "Portugal" },
  { code: "+358", label: "Finland" },
  { code: "+372", label: "Estonia" },
  { code: "+371", label: "Latvia" },
  { code: "+370", label: "Lithuania" },
  { code: "+421", label: "Slovakia" },
  { code: "+420", label: "Czech Republic" },
  { code: "+30", label: "Greece" },
  { code: "+45", label: "Denmark" },
  { code: "+372", label: "Estonia" },
  { code: "+63", label: "Philippines" },
  { code: "+48", label: "Poland" },
  { code: "+420", label: "Czech Republic" },
  { code: "+351", label: "Portugal" },
  { code: "+65", label: "Singapore" },
  { code: "+47", label: "Norway" },
  { code: "+41", label: "Switzerland" },
  { code: "+351", label: "Portugal" },
  { code: "+385", label: "Croatia" },
  { code: "+64", label: "New Zealand" },
  { code: "+256", label: "Uganda" },
  { code: "+254", label: "Kenya" },
  { code: "+27", label: "South Africa" },
  { code: "+43", label: "Austria" },
  { code: "+36", label: "Hungary" },
  { code: "+32", label: "Belgium" },
  { code: "+353", label: "Ireland" },
  { code: "+354", label: "Iceland" },
  { code: "+373", label: "Moldova" },
  { code: "+376", label: "Andorra" },
  { code: "+41", label: "Switzerland" },
  { code: "+992", label: "Tajikistan" },
  { code: "+996", label: "Kyrgyzstan" },
  { code: "+7", label: "Russia" },
  { code: "+998", label: "Uzbekistan" }
];

export default function ApplyingForm() {
  const fileRef = useRef(null);
  const photoRef = useRef(null);
  const [submitted, setSubmitted] = useState(null); // will hold last-submitted metadata
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [selectedArea, setSelectedArea] = useState(null);
  const {footerHeight,navBarHeight}=useScreenViewStore();

  const { data: departments, isLoading: loadingDeps } = useQuery({
    queryKey: ["departments"],
    queryFn: GetDepartments,
  });
  const { data: jobs, isLoading: loadingJobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: GetJobs,
  });

    const { data: socials, isLoading: loadingSocials } = useQuery({
    queryKey: ["socials"],
    queryFn: GetSocials,
  });

  const { data: genders, isLoading: loadingGenders } = useQuery({
    queryKey: ["genders"],
    queryFn: GetGenders,
  });
    const { data: countries, isLoading: loadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: GetCountries,
  });

      const { data: howDoYouKnew, isLoading: loadingHowDoYouKnew } = useQuery({
    queryKey: ["howDoYouKnew"],
    queryFn: GetHowDoYouKnow,
  });

  useEffect(() => {
    console.log("socials",socials);
    
  }, [socials]);

  // validation
  const SUPPORTED_CV = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const SUPPORTED_IMAGES = ["image/jpeg", "image/png", "image/webp"];

  const experienceSchema = Yup.object().shape({
    company: Yup.string().trim().required("Company is required"),
    years: Yup.number().typeError("Must be a number").min(0, "Invalid years").required("Years required"),
    role: Yup.string().trim().required("Role is required"),
  });

  const educationSchema = Yup.object().shape({
    institution: Yup.string().trim().required("Institution is required"),
    degree: Yup.string().trim().required("Degree is required"),
    year: Yup.number().typeError("Must be a year").min(1900, "Invalid year").max(new Date().getFullYear(), "Invalid year").required("Year required"),
  });

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().trim().required("First name is required"),
    middleName: Yup.string().trim().required("Middle name is required"),
    lastName: Yup.string().trim().required("Last name is required"),
    birthDate: Yup.date().required("Birth date is required").max(new Date(), "Invalid date"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneCode: Yup.string().required("Code"),
    secondPhoneCode: Yup.string(),
    phone: Yup.string().trim().required("Phone is required").min(5, "Invalid phone"),
    secondPhone: Yup.string().trim().min(5, "Invalid phone"),
    location: Yup.object().shape({
      country: Yup.string().required("Country is required"),
      city: Yup.string().trim().required("City is required"),
      area: Yup.string().trim().required("Area is required"),
      address: Yup.string().trim().required("Address is required"),
    }),
    linkedin: Yup.string().url("Invalid URL"),
    github: Yup.string().url("Invalid URL"),
    source: Yup.string(),
    department: Yup.string().required("Department is required"),
    position: Yup.string().required("Position is required"),
    socialStatus: Yup.string().required("Social status is required"),
    cover: Yup.string(),
    gender: Yup.string().required("Gender is required"),
    experiences: Yup.array().of(experienceSchema).min(0),
    education: Yup.array().of(educationSchema).min(0),
    photo: Yup.mixed()
      .nullable()
      .test("fileType", "Photo must be JPEG/PNG/WebP", (value) => {
        if (!value) return true; // optional
        return value && SUPPORTED_IMAGES.includes(value.type);
      }),
    cv: Yup.mixed()
      .required("CV is required")
      .test("fileType", "CV must be PDF/DOC/DOCX", (value) => {
        return value && SUPPORTED_CV.includes(value.type);
      })
      .test("fileSize", "Max file size is 5MB", (value) => {
        return value && value.size <= 5 * 1024 * 1024;
      }),
  });

  const initialValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    email: "",
    phoneCode: "+20",
    secondPhoneCode: "+20",
    phone: "",
    secondPhone: "",
    socialStatus:"",
    // location is now an object with 3 parts
    location: { country: "", city: "", area: "", address: "" },
    linkedin: "",
    github: "",
    source: "",
    department: "",
    position: "",
    cover: "",
    photo: null,
    cv: null,
    gender: "",
    // repeatable sections
    experiences: [
      // { company: "", years: "", role: "" },
    ],
    education: [
      // { institution: "", degree: "", year: "" },
    ],
  };

const getUniqueItems = (data, key) => {
  // تأكد من أننا نعمل على مصفوفة فعلية
  const arr = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
  const uniqueItems = [];
  const seenKeys = new Set();

  for (const item of arr) {
    if (!item || !(key in item)) continue; // تجاهل العناصر الغير متوقعة
    const keyValue = item[key];
    if (!seenKeys.has(keyValue)) {
      seenKeys.add(keyValue);
      uniqueItems.push(item);
    }
  }

  return uniqueItems;
};


// تحديثات صغيرة في الحالة/المعالجة
const handleCountryChange = (value, setFieldValue) => {
  // استخدم string لأن قيم الـ select عادةً سترسل string
  const v = value || "";
  setSelectedCountry(v);
  setSelectedCity(null);
  setSelectedArea(null);
  // امسح حقول المدينة والمنطقة في formik
  if (setFieldValue) {
    setFieldValue("location.city", "");
    setFieldValue("location.area", "");
  }
};

const handleCityChange = (value, setFieldValue) => {
  const v = value || "";
  setSelectedCity(v);
  setSelectedArea(null);
  if (setFieldValue) {
    setFieldValue("location.area", "");
  }
};


  const countriesArray = Array.isArray(countries) ? countries : (countries && Array.isArray(countries.data) ? countries.data : []);

const uniqueCountries = useMemo(() => {
  return getUniqueItems(countriesArray, "countryID");
}, [countries]);

const uniqueCities = useMemo(() => {
  if (!selectedCountry) return [];
  return getUniqueItems(
    countries.filter(
      (item) => item.countryID === Number(selectedCountry)
    ),
    "cityID"
  );
}, [countries, selectedCountry]);


const uniqueAreas = useMemo(() => {
  return getUniqueItems(
    countriesArray.filter((item) => item.countryID == selectedCountry && item.cityID == selectedCity),
    "ariaID"
  );
}, [countries, selectedCountry, selectedCity]);

function SubmitWatcher() {
  const { submitCount, errors } = useFormikContext();
  const shownRef = useRef(0);

  useEffect(() => {
    // لو في محاولة إرسال وفي أخطاء، نعرض toast مرة وحدة لكل submitCount
    if (submitCount > 0 && Object.keys(errors || {}).length > 0) {
      if (shownRef.current !== submitCount) {
        toast.error("Please fill all required fields correctly");
        shownRef.current = submitCount;
      }
    }
  }, [submitCount, errors]);

  return null;
}
useEffect(()=>{
  console.log("navBar :" , navBarHeight,"footer:",footerHeight);
  
},navBarHeight,footerHeight)



if(apiSuccess) return (
  <div className="flex flex-col items-center justify-center gap-1 text-center" style={{
  height: `calc( 100vh - ${(navBarHeight + footerHeight)}px)`
}}>
    <IoCheckmarkSharp className="text-[300px] text-green-500"/>
    <p className="text-3xl font-bold">Thank You!</p>
    <p className="sm:text-2xl text-xl">Your application was successfully submitted</p>
    <p className="text-xl text-gray-600">We will contact you soon</p>
  </div>
)

  return (
    <div className="min-h-screen flex items-start justify-center p-6 bg-gradient-to-b from-white to-gray-50">
      <div className="w-full max-w-5xl">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            setApiError(null);
            setApiSuccess(null);

            const personalImage=values.photo?await uploadToCloudinary(values.photo):"";
            const cv=values.cv?await uploadToCloudinary(values.cv):"";
            console.log(personalImage,cv);
            

            // build FormData
            try {
              const res = await fetch(API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  body: JSON.stringify({
    personalId: 0,
    // personalName: `${values.firstName} ${values.middleName} ${values.lastName}`,
    PersonalCvFirstName : values.firstName,
    PersonalCvMedilName  : values.middleName,
    PersonalCvLastName : values.lastName,
    personalDepartmentId: Number(values.department),
    personalJopId: Number(values.position),
    personalBerthDate: values.birthDate,
    personalMoble: `${values.secondPhoneCode} ${values.secondPhone}`,
    personalPhone: `${values.phoneCode} ${values.phone}`,
    personalMail: values.email,
    personalCountryId: Number(values.location.country),
    personalCityId: Number(values.location.city),
    // personalCityName: uniqueCities.find(item => item.cityID === Number(values.location.city))?.cityName,
    personalCityAreaId: Number(values.location.area),
    personalStreet: values.location.address,
    personalGenderId: Number(values.gender),
    personalCvLinkedInProfile: values.linkedin,
    personalCvGithubProfile: values.github,
    personalCvCoverNote: values.cover,
    personalCvHowNowAboutUsId: Number(values.source),
    personalSocialId: Number(values.socialStatus),
    personalCvUploadPickt:personalImage,
    personalCvUploadCV: cv,
    personalCvsWorkExperiences: values.experiences?.map(e => ({
      personalCvsWorkExperienceCompanyName: e.company,
      personalCvsWorkExperienceRole: e.role,
      personalCvsWorkExperienceYear: Number(e.years),
    })) || [],
    peronalCvsEducations: values.education?.map(e => ({
      peronalCvEducationInstitution: e.institution,
      peronalCvEducationDegree: Number(e.degree),
      peronalCvEducationGraduationYear: Number(e.year),
    })) || [],
  }),
});


              const data = await res.json().catch(() => null);

              if (res.ok) {
                // show thank you message
                setApiSuccess(true);

                // store submitted summary metadata (files replaced with lightweight metadata)
                const summary = { ...values };
                if (values.cv)
                  summary.cv = { name: values.cv.name, size: values.cv.size };
                if (values.photo)
                  summary.photo = {
                    name: values.photo.name,
                    size: values.photo.size,
                  };
                setSubmitted(summary);

                // reset the form if you want (comment out if you prefer to keep the values)
                actions.resetForm();
              } else {
                setApiError(
                  (data && data.message) ||
                    `Submission failed (status ${res.status})`
                );
                toast.error("something went wrong");
              }
            } catch (err) {
              setApiError(err.message || "Network error");
              toast.error("something went wrong");
            } finally {
              actions.setSubmitting(false);
            }
          }}
        >
          {({
            setFieldValue,
            isSubmitting,
            values,
            errors,
            touched,
            resetForm,
          }) => (
            <>
            <SubmitWatcher/>
            <Form className="bg-white border rounded-2xl py-6 md:px-6 px-2 shadow-sm border-light-gray">
              <h2 className="text-xl font-semibold text-secondary">
                Job Application
              </h2>
              <p className="text-sm text-gray mt-1">
                Complete the form and upload your CV
              </p>

              {/* show API messages */}
              {/* {apiError && (
                <div className="mt-4 p-3 rounded-md bg-rose-50 text-danger border border-rose-100">
                  {apiError}
                </div>
              )}

              {apiSuccess && (
                <div className="mt-4 p-3 rounded-md bg-green-50 text-green-700 border border-green-100">
                  {apiSuccess}
                </div>
              )} */}

              {/* Personal Data card */}
              <section className="mt-6  rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-light-gray p-4 rounded-lg flex flex-col gap-2.5 ">
                    <h3 className="text-sm font-semibold text-secondary mb-3">
                      Personal Data
                    </h3>
                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        First Name{" "}
                        <span className="ms-1 font-semibold text-danger">(required)</span>
                      </label>
                      <Field
                        name="firstName"
                        placeholder="First"
                        className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.12)] focus:border-primary ${
                          errors.firstName && touched.firstName
                            ? "border-danger"
                            : "border-gray-200"
                        }`}
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        Middle Name
                        <span className="ms-1 font-semibold text-danger">(required)</span>
                      </label>
                      <Field
                        name="middleName"
                        placeholder="Middle"
                        className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary ${
                          errors.middleName && touched.middleName
                            ? "border-danger"
                            : "border-gray-200"
                        }`}
                      />
                      <ErrorMessage
                        name="middleName"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        Last Name{" "}
                        <span className="ms-1 font-semibold text-danger">(required)</span>
                      </label>
                      <Field
                        name="lastName"
                        placeholder="Last"
                        className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.12)] focus:border-primary ${
                          errors.lastName && touched.lastName
                            ? "border-danger"
                            : "border-gray-200"
                        }`}
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        Birth Date
                        <span className="ms-1 font-semibold text-danger">(required)</span>
                      </label>
                      <div className="relative">
                        <Field
                          name="birthDate"
                          type="date"
                          className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.12)] focus:border-primary ${
                            errors.birthDate && touched.birthDate
                              ? "border-danger"
                              : "border-gray-200"
                          }`}
                        />
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M7 10H9"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15 10H15.01"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M16 3V7"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8 3V7"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <ErrorMessage
                        name="birthDate"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>

                    {/* Row: First Name + Middle Name (inline two fields) */}
                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">

                </div> */}

                    {/* Row: Last Name + Birth Date */}
                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">



                </div> */}

                    {/* Photo + Gender (photo left small, gender right) */}
                    {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center"> */}

                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        Gender
                        <span className="ms-1 font-semibold text-danger">(required)</span>
                      </label>
                      <div className="relative">
                        <Field
                          as="select"
                          name="gender"
                          className={`w-full appearance-none rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary ${
                          errors.gender && touched.gender
                            ? "border-danger"
                            : "border-gray-200"
                        }`}
                        >
                          <option value="">Select Gender</option>
                          {genders &&
                            genders.length > 0 &&
                            genders.map((gender) => (
                              <option
                                className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
                                value={gender.personalGenderId}
                              >
                                {gender?.personalGenderName}
                              </option>
                            ))}
                        </Field>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
                          <IoIosArrowDown />
                        </span>
                      </div>
                      <ErrorMessage
                        name="gender"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        Social status
                        <span className="ms-1 font-semibold text-danger">(required)</span>
                      </label>
                      <div className="relative">
                        <Field
                          as="select"
                          name="socialStatus"
                          className={`w-full appearance-none rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary ${
                          errors.socialStatus && touched.socialStatus
                            ? "border-danger"
                            : "border-gray-200"
                        }`}
                        >
                          <option value="">Select Social Status</option>
                          {socials &&
                            socials.length > 0 &&
                            socials.map((social) => (
                              <option
                                className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
                                value={social.personalSocialId}
                              >
                                {social?.personalSocialName}
                              </option>
                            ))}
                        </Field>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
                          <IoIosArrowDown />
                        </span>
                      </div>
                      <ErrorMessage
                        name="socialStatus"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        Photo
                      </label>
                      <div
                        onClick={() => photoRef.current?.click()}
                        className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm flex items-center justify-between bg-white cursor-pointer"
                      >
                        <span className="text-gray">
                          {values.photo ? values.photo.name : "Upload photo"}
                        </span>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="text-gray"
                        >
                          <path
                            d="M12 16V8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 12L12 8L16 12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <input
                        ref={photoRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          setFieldValue(
                            "photo",
                            e.currentTarget.files?.[0] || null
                          )
                        }
                      />
                      <ErrorMessage
                        name="photo"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div className="bg-light-gray p-4 rounded-lg flex flex-col gap-2.5">
                    <h3 className="text-sm font-semibold text-secondary mb-3">
                      Address Information
                    </h3>
                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        Country{" "}
                        <span className="ms-1 font-semibold text-danger">(required)</span>
                      </label>
                      <div className="relative">
                        <Field
                          as="select"
                          name="location.country"
                          className={`w-full rounded-full border px-4 py-2 pr-10 text-sm bg-white
                      focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
                      focus:border-primary  appearance-none ${
                        errors.location?.country && touched.location?.country
                          ? "border-danger"
                          : "border-gray-200"
                      }`}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleCountryChange(value, setFieldValue);
                            setFieldValue("location.country", value);
                          }}
                        >
                          <option value="">Select country</option>
                          {uniqueCountries &&
                            uniqueCountries.map((c) => (
                              <option
                                className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
                                key={c.countryID}
                                value={c.countryID}
                              >
                                {c.countryName}
                              </option>
                            ))}
                        </Field>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
                          <IoIosArrowDown />
                        </span>
                      </div>
                      <ErrorMessage
                        name="location.country"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        City{" "}
                        <span className="ms-1 font-semibold text-danger">(required)</span>
                      </label>
                      <div className="relative">
                        <Field
                          as="select"
                          name="location.city"
                          disabled={!selectedCountry}
                          className={`w-full rounded-full border px-4 py-2 pr-10 text-sm ${
                            selectedCountry ? "bg-white" : "bg-gray-200"
                          } 
                      focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
                      focus:border-primary  appearance-none ${
                        errors.location?.city && touched.location?.city
                          ? "border-danger"
                          : "border-gray-200"
                      }`}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleCityChange(value, setFieldValue);
                            setFieldValue("location.city", value);
                          }}
                        >
                          <option value="">Select city</option>
                          {uniqueCities &&
                            uniqueCities.map((c) => (
                              <option
                                className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
                                key={c.cityID}
                                value={c.cityID}
                              >
                                {c.cityName}
                              </option>
                            ))}
                        </Field>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
                          <IoIosArrowDown />
                        </span>
                      </div>
                      <ErrorMessage
                        name="location.city"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        Area / District{" "}
                        <span className="ms-1 font-semibold text-danger">(required)</span>
                      </label>
                      <div className="relative">
                        <Field
                          as="select"
                          name="location.area"
                          disabled={!selectedCountry || !selectedCity}
                          className={`w-full rounded-full border px-4 py-2 pr-10 text-sm ${
                            !selectedCountry || !selectedCity
                              ? "bg-gray-200"
                              : "bg-white"
                          } 
                      focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
                      focus:border-primary  appearance-none ${
                        errors.location?.area && touched.location?.area
                          ? "border-danger"
                          : "border-gray-200"
                      }`}
                        >
                          <option value="">Select area</option>
                          {uniqueAreas &&
                            uniqueAreas.map((a) => (
                              <option
                                className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
                                key={a.ariaID}
                                value={a.ariaID}
                              >
                                {a.ariaName}
                              </option>
                            ))}
                        </Field>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
                          <IoIosArrowDown />
                        </span>
                      </div>
                      <ErrorMessage
                        name="location.area"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        Address{" "}
                        <span className="ms-1 font-semibold text-danger">(required)</span>
                      </label>
                      <Field
                        name="location.address"
                        placeholder="address"
                        className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.12)] focus:border-primary ${
                          errors.location?.address && touched.location?.address
                            ? "border-danger"
                            : "border-gray-200"
                        }`}
                      />
                      <ErrorMessage
                        name="location.address"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div className="bg-light-gray p-4 rounded-lg flex flex-col gap-2.5">
                    <h3 className="text-sm font-semibold text-secondary mb-3">
                      Contact Info
                    </h3>
                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        Email{" "}
                        <span className="ms-1 font-semibold text-danger">(required)</span>
                      </label>
                      <Field
                        name="email"
                        type="email"
                        placeholder="you@domain.com"
                        className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.12)] focus:border-primary ${
                          errors.email && touched.email
                            ? "border-danger"
                            : "border-gray-200"
                        }`}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        Phone{" "}
                        <span className="ms-1 font-semibold text-danger">(required)</span>
                      </label>
                      <div
                        className={`flex items-center w-full rounded-full border bg-white overflow-hidden
      focus-within:ring-2 focus-within:ring-[rgba(184,142,82,0.12)]
      ${errors.phone && touched.phone ? "border-danger" : "border-gray-200"}`}
                      >
                        {/* Country code */}
                        <Field
                          as="select"
                          name="phoneCode"
                          className="h-full bg-transparent px-3 py-2 text-sm text-secondary border-r border-gray-200 focus:outline-none"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option
                              className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white justify-between"
                              key={c.code}
                              value={c.code}
                            >
                              {window.innerWidth >500 && <span>{c.label}</span>}
                              <span>{c.code}</span>
                            </option>
                          ))}
                        </Field>

                        {/* Phone number */}
                        <Field
                          name="phone"
                          placeholder="xxx xxx xxxx"
                          className="flex-1 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
                        />
                      </div>

                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        Second Phone{" "}
                      </label>
                      <div
                        className={`flex items-center w-full rounded-full border bg-white overflow-hidden
      focus-within:ring-2 focus-within:ring-[rgba(184,142,82,0.12)]
      ${errors.secondPhone && touched.secondPhone ? "border-danger" : "border-gray-200"}`}
                      >
                        {/* Country code */}
                        <Field
                          as="select"
                          name="secondPhoneCode"
                          className="h-full bg-transparent px-3 py-2 text-sm text-secondary border-r border-gray-200 focus:outline-none"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option
                              className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white justify-between"
                              key={c.code}
                              value={c.code}
                            >
{window.innerWidth > 500 && <span>{c.label}</span>}
                              <span>{c.code}</span>
                            </option>
                          ))}
                        </Field>

                        {/* Phone number */}
                        <Field
                          name="secondPhone"
                          placeholder="xxx xxx xxxx"
                          className="flex-1 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
                        />
                      </div>

                      <ErrorMessage
                        name="secondPhone"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        LinkedIn Profile
                      </label>
                      <Field
                        name="linkedin"
                        placeholder="https://linkedin.com/in/you"
                        className="w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary border-gray-200"
                      />
                      <ErrorMessage
                        name="linkedin"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        Github Profile
                      </label>
                      <Field
                        name="github"
                        placeholder="https://github.com/you"
                        className="w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary border-gray-200"
                      />
                      <ErrorMessage
                        name="github"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div className="bg-light-gray p-4 rounded-lg flex flex-col gap-2.5">
                    <h3 className="text-sm font-semibold text-secondary mb-3">
                      Application Details
                    </h3>

                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        How did you hear about us?
                      </label>
                      <div className="relative">
                        <Field
                          as="select"
                          name="source"
                          className="w-full rounded-full border px-4 py-2 pr-10 text-sm bg-white
                      focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
                      focus:border-primary border-gray-200 appearance-none"
                        >
                          <option
                            className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
                            value=""
                          >
                            Select...
                          </option>
                          {howDoYouKnew && howDoYouKnew.map((item) => (
                            <option
                            className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
                            value={item?.personalHowNowAboutUsId}
                          >
                            {item?.personalHowNowAboutUsName}
                          </option>
                          ))}
                        </Field>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
                          <IoIosArrowDown />
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        Department{" "}
                        <span className="ms-1 font-semibold text-danger">(required)</span>
                      </label>
                      <div className="relative">
                        <Field
                          as="select"
                          name="department"
                          className={`w-full rounded-full border px-4 py-2 pr-10 text-sm bg-white
                        focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
                        focus:border-primary appearance-none ${
                          errors.department && touched.department
                            ? "border-danger"
                            : "border-gray-200"
                        }`}
                        >
                          <option
                            className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
                            value=""
                          >
                            Select department
                          </option>
                          {departments &&
                            departments.length > 0 &&
                            departments.map((dept) => (
                              <option
                                className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
                                value={dept.departmentId}
                              >
                                {dept?.departmentName}
                              </option>
                            ))}
                        </Field>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
                          <IoIosArrowDown />
                        </span>
                      </div>
                      <ErrorMessage
                        name="department"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-secondary text-sm mb-1">
                        Position Applying For{" "}
                        <span className="ms-1 font-semibold text-danger">(required)</span>
                      </label>
                      <div className="relative">
                        <Field
                          as="select"
                          name="position"
                          className={`w-full rounded-full border px-4 py-2 pr-10 text-sm bg-white
                        focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
                        focus:border-primary appearance-none ${
                          errors.position && touched.position
                            ? "border-danger"
                            : "border-gray-200"
                        }`}
                        >
                          <option
                            className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
                            value=""
                          >
                            Select position
                          </option>
                          {jobs &&
                            jobs.length > 0 &&
                            jobs.map((jop) => (
                              <option
                                className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
                                value={jop.jopId}
                              >
                                {jop?.jopName}
                              </option>
                            ))}
                        </Field>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
                          <IoIosArrowDown />
                        </span>
                      </div>
                      <ErrorMessage
                        name="position"
                        component="div"
                        className="text-danger text-xs mt-1"
                      />
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </section>

              {/* Contact & Job details */}
              <section className="mt-6 bg-light-gray rounded-xl p-4">
                <div className="mb-3">
                  <label className="block text-secondary text-sm mb-1">
                    Cover Note / Additional Information
                  </label>
                  <Field
                    as="textarea"
                    name="cover"
                    placeholder="A short note about you"
                    rows={4}
                    className="w-full rounded-xl border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary"
                  />
                </div>

                {/* Experiences - repeatable */}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-secondary">
                      Work Experience
                    </h4>
                    <FieldArray name="experiences">
                      {({ push, remove }) => (
                        <div
                          className={`${
                            values.experiences.length == 3 ? "hidden" : ""
                          } `}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              push({ company: "", years: "", role: "" })
                            }
                            className="text-sm rounded-full px-3 py-1 border"
                            style={{
                              background: "var(--color-secondary)",
                              color: "white",
                            }}
                          >
                            + Add
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <FieldArray name="experiences">
                    {({ remove, push }) => (
                      <div className="space-y-3">
                        {values.experiences &&
                          values.experiences.length > 0 &&
                          values.experiences.map((exp, idx) => (
                            <div className="">
                              <div className="text-xs flex justify-between grid-cols-12 mt-5 mb-2">
                                <h4 className="">Experience No {idx + 1}</h4>
                                <button
                                  type="button"
                                  onClick={() => remove(idx)}
                                  className="text-sm text-red-500 md:hidden"
                                >
                                  <FaTrashAlt />
                                </button>
                              </div>
                              <div
                                key={idx}
                                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center "
                              >
                                <div className="md:col-span-5">
                                  <Field
                                    name={`experiences.${idx}.company`}
                                    placeholder="Company name"
                                    className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
                                  />
                                  <ErrorMessage
                                    name={`experiences.${idx}.company`}
                                    component="div"
                                    className="text-danger text-xs mt-1 md:hidden"
                                  />
                                </div>

                                <div className="md:col-span-3">
                                  <Field
                                    name={`experiences.${idx}.role`}
                                    placeholder="Role / Title"
                                    className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
                                  />
                                  <ErrorMessage
                                    name={`experiences.${idx}.role`}
                                    component="div"
                                    className="text-danger text-xs mt-1 md:hidden"
                                  />
                                </div>
                                <div className="md:col-span-3">
                                  <Field
                                    name={`experiences.${idx}.years`}
                                    placeholder="Years of experience"
                                    className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
                                  />
                                  <ErrorMessage
                                    name={`experiences.${idx}.years`}
                                    component="div"
                                    className="text-danger text-xs mt-1 md:hidden"
                                  />
                                </div>

                                <div className="md:col-span-1 md:flex justify-end hidden">
                                  <button
                                    type="button"
                                    onClick={() => remove(idx)}
                                    className="text-sm text-red-500"
                                  >
                                    <FaTrashAlt />
                                  </button>
                                </div>
                              </div>
                              <div className="hidden md:grid md:grid-cols-12 gap-3 items-center ">
                                <div className="col-span-5">
                                  <ErrorMessage
                                    name={`experiences.${idx}.company`}
                                    component="div"
                                    className="text-danger text-xs mt-1 "
                                  />
                                </div>
                                <div className="col-span-3">
                                  <ErrorMessage
                                    name={`experiences.${idx}.role`}
                                    component="div"
                                    className="text-danger text-xs mt-1 "
                                  />
                                </div>
                                <div className="col-span-3">
                                  <ErrorMessage
                                    name={`experiences.${idx}.years`}
                                    component="div"
                                    className="text-danger text-xs mt-1 "
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Education - repeatable */}
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-secondary">
                      Education
                    </h4>
                    <FieldArray name="education">
                      {({ push }) => (
                        <div
                          className={`${
                            values.education.length == 3 ? "hidden" : ""
                          } `}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              push({ institution: "", degree: "", year: "" })
                            }
                            className="text-sm rounded-full px-3 py-1 border"
                            style={{
                              background: "var(--color-secondary)",
                              color: "white",
                            }}
                          >
                            + Add
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <FieldArray name="education">
                    {({ remove }) => (
                      <div className="space-y-3">
                        {values.education &&
                          values.education.length > 0 &&
                          values.education.map((edu, idx) => (
                            <div className="">
                              <div className="text-xs flex justify-between grid-cols-12 mt-5 mb-2">
                                <h4 className="">Education No {idx + 1}</h4>
                                <button
                                  type="button"
                                  onClick={() => remove(idx)}
                                  className="text-sm text-red-500 md:hidden"
                                >
                                  <FaTrashAlt />
                                </button>
                              </div>
                              <div
                                key={idx}
                                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                              >
                                <div className="md:col-span-5">
                                  <Field
                                    name={`education.${idx}.institution`}
                                    placeholder="Institution"
                                    className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
                                  />
                                  <ErrorMessage
                                    name={`education.${idx}.institution`}
                                    component="div"
                                    className="text-danger text-xs mt-1 md:hidden"
                                  />
                                </div>

                                <div className="md:col-span-3">
                                  <Field
                                    name={`education.${idx}.degree`}
                                    placeholder="Degree / Major"
                                    className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
                                  />
                                  <ErrorMessage
                                    name={`education.${idx}.degree`}
                                    component="div"
                                    className="text-danger text-xs mt-1 md:hidden"
                                  />
                                </div>

                                <div className="md:col-span-3">
                                  <Field
                                    name={`education.${idx}.year`}
                                    placeholder="Graduation Year"
                                    className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
                                  />
                                  <ErrorMessage
                                    name={`education.${idx}.year`}
                                    component="div"
                                    className="text-danger text-xs mt-1 md:hidden"
                                  />
                                </div>

                                <div className="md:col-span-1 md:flex justify-end hidden">
                                  <button
                                    type="button"
                                    onClick={() => remove(idx)}
                                    className="text-sm text-red-500"
                                  >
                                    <FaTrashAlt />
                                  </button>
                                </div>
                              </div>
                              <div className="hidden md:grid md:grid-cols-12 gap-3 items-center">
                                <div className="col-span-5">
                                  <ErrorMessage
                                    name={`education.${idx}.institution`}
                                    component="div"
                                    className="text-danger text-xs mt-1 "
                                  />
                                </div>
                                <div className="col-span-3">
                                  <ErrorMessage
                                    name={`education.${idx}.degree`}
                                    component="div"
                                    className="text-danger text-xs mt-1 "
                                  />
                                </div>
                                <div className="col-span-3">
                                  <ErrorMessage
                                    name={`education.${idx}.year`}
                                    component="div"
                                    className="text-danger text-xs mt-1 "
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* CV Upload */}
                <div className="mt-2">
                  <label className="block text-secondary text-sm mb-1">
                    Upload CV{" "}
                    <span className="ms-1 font-semibold text-danger">(required)</span>
                  </label>

                  <div
                    onClick={() => fileRef.current?.click()}
                    className={`w-full rounded-full border px-4 py-2 text-sm bg-white flex items-center justify-between cursor-pointer ${
                      errors.cv && touched.cv
                        ? "border-danger"
                        : "border-dashed border-light-gray"
                    }`}
                  >
                    <span className="text-gray">
                      {values.cv
                        ? values.cv.name
                        : "Drag & drop or click to upload CV (PDF/DOC/DOCX)"}
                    </span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-gray"
                    >
                      <path
                        d="M12 16V8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 12L12 8L16 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) =>
                      setFieldValue("cv", e.currentTarget.files?.[0] || null)
                    }
                  />
                  <ErrorMessage
                    name="cv"
                    component="div"
                    className="text-danger text-xs mt-1"
                  />
                </div>
              </section>

              {/* Actions */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`rounded-full px-5 py-2 text-white font-semibold ${isSubmitting?"bg-[#B88E5299] pointer-events-none":"bg-primary"}`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setApiError(null);
                    setApiSuccess(null);
                    setSubmitted(null);
                    resetForm();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="rounded-full px-5 py-2 border "
                >
                  Reset
                </button>
              </div>

              {/* Live Application Summary - updates on every field change */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-secondary">
                  Live Application Preview
                </h3>
                <div className="mt-2 bg-white border rounded-lg p-4">
                  <ul className="text-sm text-gray space-y-1">
                    <li>
                      <strong className="text-secondary">Name:</strong>{" "}
                      {values.firstName}{" "}
                      {values.middleName ? values.middleName + " " : ""}
                      {values.lastName}
                    </li>
                      <li>
                      <strong className="text-secondary">Birth Date:</strong>{" "}
                      {values.birthDate || "—"}
                    </li>
                      <li>
                      <strong className="text-secondary">Gender:</strong>{" "}
                      {values.gender ? genders.find((g) => g.personalGenderId == values.gender)?.personalGenderName : "—"}
                    </li>
                    <li>
                      <strong className="text-secondary">Email:</strong>{" "}
                      {values.email || "—"}
                    </li>
                    <li>
                      <strong className="text-secondary">Phone:</strong>{" "}
                      {values.phoneCode} {values.phone || "—"}
                    </li>
                    <li>
                      <strong className="text-secondary">Second Phone:</strong>{" "}
                      {values.secondPhoneCode} {values.secondPhone || "—"}
                    </li>
                    <li>
                      <strong className="text-secondary">Linked in:</strong>{" "}
                      {values.linkedin || "—"}
                    </li>
                    <li>
                      <strong className="text-secondary">GitHub:</strong>{" "}
                      {values.github || "—"}
                    </li>


                    <li>
                      <strong className="text-secondary">Location:</strong>{" "}
                      {uniqueCountries.find(
                        (c) => c.countryID == values.location?.country
                      )?.countryName || "—"}
                      {values.location?.city ? `, ${uniqueCities.find((c) => c.cityID == values.location?.city)?.cityName}` : ""}
                      {values.location?.area
                        ? ` — ${uniqueAreas.find((a) => a.ariaID == values.location?.area)?.ariaName}`
                        : ""}
                        {values.location?.address ? `, ${values.location?.address}` : ""}
                    </li>
                    <li>
                      <strong className="text-secondary">Department:</strong>{" "}
                      {values.department ? departments.find((d) => d.departmentId == values.department)?.departmentName : "—"}
                    </li>
                    <li>
                      <strong className="text-secondary">Position:</strong>{" "}
                      {values.position ? jobs.find((j) => j.jopId == values.position)?.jopName : "—"}
                    </li>
                    <li>
                      <strong className="text-secondary">CV:</strong>{" "}
                      {values.cv ? values.cv.name : "—"}
                    </li>
                    <li>
                      <strong className="text-secondary">Photo:</strong>{" "}
                      {values.photo ? values.photo.name : "—"}
                    </li>
                    <li>
                      <strong className="text-secondary">Experience:</strong>
                      <ul className="pl-4 list-disc mt-1">
                        {values.experiences && values.experiences.length > 0 ? (
                          values.experiences.map((e, i) => (
                            <li key={i} className="text-sm text-gray">
                              {e.company || "—"} — {e.role || "—"} (
                              {e.years || "—"} yrs)
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray">—</li>
                        )}
                      </ul>
                    </li>

                    <li>
                      <strong className="text-secondary">Education:</strong>
                      <ul className="pl-4 list-disc mt-1">
                        {values.education && values.education.length > 0 ? (
                          values.education.map((ed, i) => (
                            <li key={i} className="text-sm text-gray">
                              {ed.institution || "—"} — {ed.degree || "—"} (
                              {ed.year || "—"})
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-gray">—</li>
                        )}
                      </ul>
                    </li>
                    <li>
                      <strong className="text-secondary">Cover Note / Additional Information:</strong>{" "}
                      {values.cover || "—"}
                    </li>
                  </ul>
                </div>
              </div>
            </Form>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
}


























// import React, { useRef, useState } from "react";
// import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
// import * as Yup from "yup";
// import { FaTrashAlt } from "react-icons/fa";
// import { IoIosArrowDown } from "react-icons/io";

// /**
//  * ApplyingForm — React component (code/react)
//  * - Tailwind CSS utility classes assumed
//  * - Sends data as FormData to API (cv + photo included as files)
//  * - Live summary updates on every field change (uses Formik `values`)
//  * - Submit sends to API_URL; on success shows a thank-you message
//  *
//  * Added features in this version:
//  * - Repeatable `experiences` array (company, years, role) with Add / Delete
//  * - Repeatable `education` array (institution, degree, year) with Add / Delete
//  * - Location split into three parts: country, city, area
//  */

// const API_URL = "/api/apply"; // <-- Replace with your real endpoint

// // Minimal country list (can be extended to full list easily)
// const COUNTRY_CODES = [
//   { code: "+1", label: "US / Canada" },
//   { code: "+44", label: "United Kingdom" },
//   { code: "+49", label: "Germany" },
//   { code: "+33", label: "France" },
//   { code: "+39", label: "Italy" },
//   { code: "+34", label: "Spain" },
//   { code: "+31", label: "Netherlands" },
//   { code: "+46", label: "Sweden" },
//   { code: "+47", label: "Norway" },
//   { code: "+45", label: "Denmark" },
//   { code: "+48", label: "Poland" },
//   { code: "+90", label: "Turkey" },
//   { code: "+91", label: "India" },
//   { code: "+61", label: "Australia" },
//   { code: "+64", label: "New Zealand" },
//   { code: "+81", label: "Japan" },
//   { code: "+82", label: "South Korea" },
//   { code: "+86", label: "China" },
//   { code: "+971", label: "UAE" },
//   { code: "+966", label: "Saudi Arabia" },
//   { code: "+20", label: "Egypt" },
//   { code: "+57", label: "Colombia" },
//   { code: "+54", label: "Argentina" },
//   { code: "+55", label: "Brazil" },
//   { code: "+60", label: "Malaysia" },
//   { code: "+63", label: "Philippines" },
//   { code: "+66", label: "Thailand" },
//   { code: "+62", label: "Indonesia" },
//   { code: "+51", label: "Peru" },
//   { code: "+351", label: "Portugal" },
//   { code: "+351", label: "Portugal" },
//   { code: "+358", label: "Finland" },
//   { code: "+372", label: "Estonia" },
//   { code: "+371", label: "Latvia" },
//   { code: "+370", label: "Lithuania" },
//   { code: "+421", label: "Slovakia" },
//   { code: "+420", label: "Czech Republic" },
//   { code: "+30", label: "Greece" },
//   { code: "+45", label: "Denmark" },
//   { code: "+372", label: "Estonia" },
//   { code: "+63", label: "Philippines" },
//   { code: "+48", label: "Poland" },
//   { code: "+420", label: "Czech Republic" },
//   { code: "+351", label: "Portugal" },
//   { code: "+65", label: "Singapore" },
//   { code: "+47", label: "Norway" },
//   { code: "+41", label: "Switzerland" },
//   { code: "+351", label: "Portugal" },
//   { code: "+385", label: "Croatia" },
//   { code: "+64", label: "New Zealand" },
//   { code: "+256", label: "Uganda" },
//   { code: "+254", label: "Kenya" },
//   { code: "+27", label: "South Africa" },
//   { code: "+43", label: "Austria" },
//   { code: "+36", label: "Hungary" },
//   { code: "+32", label: "Belgium" },
//   { code: "+353", label: "Ireland" },
//   { code: "+354", label: "Iceland" },
//   { code: "+373", label: "Moldova" },
//   { code: "+376", label: "Andorra" },
//   { code: "+41", label: "Switzerland" },
//   { code: "+992", label: "Tajikistan" },
//   { code: "+996", label: "Kyrgyzstan" },
//   { code: "+7", label: "Russia" },
//   { code: "+998", label: "Uzbekistan" }
// ];

// export default function ApplyingForm() {
//   const fileRef = useRef(null);
//   const photoRef = useRef(null);
//   const [submitted, setSubmitted] = useState(null); // will hold last-submitted metadata
//   const [apiError, setApiError] = useState(null);
//   const [apiSuccess, setApiSuccess] = useState(null);

//   // validation
//   const SUPPORTED_CV = [
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   ];
//   const SUPPORTED_IMAGES = ["image/jpeg", "image/png", "image/webp"];

//   const experienceSchema = Yup.object().shape({
//     company: Yup.string().trim().required("Company is required"),
//     years: Yup.number().typeError("Must be a number").min(0, "Invalid years").required("Years required"),
//     role: Yup.string().trim().required("Role is required"),
//   });

//   const educationSchema = Yup.object().shape({
//     institution: Yup.string().trim().required("Institution is required"),
//     degree: Yup.string().trim().required("Degree is required"),
//     year: Yup.number().typeError("Must be a year").min(1900, "Invalid year").max(new Date().getFullYear(), "Invalid year").required("Year required"),
//   });

//   const validationSchema = Yup.object().shape({
//     firstName: Yup.string().trim().required("First name is required"),
//     middleName: Yup.string().trim(),
//     lastName: Yup.string().trim().required("Last name is required"),
//     birthDate: Yup.date().nullable(),
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     phoneCode: Yup.string().required("Code"),
//     phone: Yup.string().trim().required("Phone is required"),
//     location: Yup.object().shape({
//       country: Yup.string().required("Country is required"),
//       city: Yup.string().trim().required("City is required"),
//       area: Yup.string().trim().required("Area is required"),
//     }),
//     linkedin: Yup.string().url("Invalid URL"),
//     source: Yup.string(),
//     department: Yup.string().required("Department is required"),
//     position: Yup.string().required("Position is required"),
//     cover: Yup.string(),
//     gender: Yup.string(),
//     experiences: Yup.array().of(experienceSchema).min(0),
//     education: Yup.array().of(educationSchema).min(0),
//     photo: Yup.mixed()
//       .nullable()
//       .test("fileType", "Photo must be JPEG/PNG/WebP", (value) => {
//         if (!value) return true; // optional
//         return value && SUPPORTED_IMAGES.includes(value.type);
//       }),
//     cv: Yup.mixed()
//       .required("CV is required")
//       .test("fileType", "CV must be PDF/DOC/DOCX", (value) => {
//         return value && SUPPORTED_CV.includes(value.type);
//       })
//       .test("fileSize", "Max file size is 5MB", (value) => {
//         return value && value.size <= 5 * 1024 * 1024;
//       }),
//   });

//   const initialValues = {
//     firstName: "",
//     middleName: "",
//     lastName: "",
//     birthDate: "",
//     email: "",
//     phoneCode: "+20",
//     phone: "",
//     // location is now an object with 3 parts
//     location: { country: "", city: "", area: "" },
//     linkedin: "",
//     source: "",
//     department: "",
//     position: "",
//     cover: "",
//     photo: null,
//     cv: null,
//     gender: "",
//     // repeatable sections
//     experiences: [
//       // { company: "", years: "", role: "" },
//     ],
//     education: [
//       // { institution: "", degree: "", year: "" },
//     ],
//   };

//   return (
//     <div className="min-h-screen flex items-start justify-center p-6 bg-gradient-to-b from-white to-gray-50">
//       <div className="w-full max-w-5xl">
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={async (values, actions) => {
//             setApiError(null);
//             setApiSuccess(null);

//             // build FormData
//             try {
//               const formData = new FormData();

//               // append primitive fields
//               Object.entries(values).forEach(([key, val]) => {
//                 if (val === null || val === undefined) return;

//                 // files handled separately
//                 if (key === "cv" || key === "photo") return;

//                 // convert boolean/objects to string (objects/arrays will be JSON-stringified)
//                 formData.append(
//                   key,
//                   typeof val === "object" ? JSON.stringify(val) : String(val)
//                 );
//               });

//               // append files
//               if (values.cv) formData.append("cv", values.cv, values.cv.name);
//               if (values.photo)
//                 formData.append("photo", values.photo, values.photo.name);

//               // debug helper (can't stringify FormData directly in console reliably)
//               // console.log('formData entries:', Array.from(formData.entries()));

//               // POST to API
//               const res = await fetch(API_URL, {
//                 method: "POST",
//                 body: formData,
//                 // Do not set Content-Type; browser will set multipart/form-data boundary
//                 headers: {
//                   Accept: "application/json",
//                 },
//               });

//               const data = await res.json().catch(() => null);

//               if (res.ok) {
//                 // show thank you message
//                 setApiSuccess(
//                   (data && data.message) ||
//                     "Thank you — your application was submitted successfully."
//                 );

//                 // store submitted summary metadata (files replaced with lightweight metadata)
//                 const summary = { ...values };
//                 if (values.cv)
//                   summary.cv = { name: values.cv.name, size: values.cv.size };
//                 if (values.photo)
//                   summary.photo = {
//                     name: values.photo.name,
//                     size: values.photo.size,
//                   };
//                 setSubmitted(summary);

//                 // reset the form if you want (comment out if you prefer to keep the values)
//                 actions.resetForm();
//               } else {
//                 setApiError(
//                   (data && data.message) ||
//                     `Submission failed (status ${res.status})`
//                 );
//               }
//             } catch (err) {
//               setApiError(err.message || "Network error");
//             } finally {
//               actions.setSubmitting(false);
//             }
//           }}
//         >
//           {({
//             setFieldValue,
//             isSubmitting,
//             values,
//             errors,
//             touched,
//             resetForm,
//           }) => (
//             <Form className="bg-white border rounded-2xl p-6 shadow-sm border-light-gray">
//               <h2 className="text-xl font-semibold text-secondary">
//                 Job Application
//               </h2>
//               <p className="text-sm text-gray mt-1">
//                 Complete the form and upload your CV
//               </p>

//               {/* show API messages */}
//               {apiError && (
//                 <div className="mt-4 p-3 rounded-md bg-rose-50 text-danger border border-rose-100">
//                   {apiError}
//                 </div>
//               )}

//               {apiSuccess && (
//                 <div className="mt-4 p-3 rounded-md bg-green-50 text-green-700 border border-green-100">
//                   {apiSuccess}
//                 </div>
//               )}

//               {/* Personal Data card */}
//               <section className="mt-6 bg-light-gray rounded-xl p-4">
//                 <h3 className="text-sm font-semibold text-secondary mb-3">
//                   Personal Data
//                 </h3>

//                 {/* Row: First Name + Middle Name (inline two fields) */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
//                   <div>
//                     <label className="block text-secondary text-sm mb-1">
//                       First Name{" "}
//                       <span className="ms-1 font-semibold text-danger">(required)</span>
//                     </label>
//                     <Field
//                       name="firstName"
//                       placeholder="First"
//                       className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.12)] focus:border-primary ${
//                         errors.firstName && touched.firstName
//                           ? "border-danger"
//                           : "border-gray-200"
//                       }`}
//                     />
//                     <ErrorMessage
//                       name="firstName"
//                       component="div"
//                       className="text-danger text-xs mt-1"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-secondary text-sm mb-1">
//                       Middle Name
//                     </label>
//                     <Field
//                       name="middleName"
//                       placeholder="Middle"
//                       className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary ${
//                         errors.middleName && touched.middleName
//                           ? "border-danger"
//                           : "border-gray-200"
//                       }`}
//                     />
//                     <ErrorMessage
//                       name="middleName"
//                       component="div"
//                       className="text-danger text-xs mt-1"
//                     />
//                   </div>
//                 </div>

//                 {/* Row: Last Name + Birth Date */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
//                   <div>
//                     <label className="block text-secondary text-sm mb-1">
//                       Last Name{" "}
//                       <span className="ms-1 font-semibold text-danger">(required)</span>
//                     </label>
//                     <Field
//                       name="lastName"
//                       placeholder="Last"
//                       className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.12)] focus:border-primary ${
//                         errors.lastName && touched.lastName
//                           ? "border-danger"
//                           : "border-gray-200"
//                       }`}
//                     />
//                     <ErrorMessage
//                       name="lastName"
//                       component="div"
//                       className="text-danger text-xs mt-1"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-secondary text-sm mb-1">
//                       Birth Date
//                     </label>
//                     <div className="relative">
//                       <Field
//                         name="birthDate"
//                         type="date"
//                         className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.12)] focus:border-primary ${
//                           errors.birthDate && touched.birthDate
//                             ? "border-danger"
//                             : "border-gray-200"
//                         }`}
//                       />
//                       <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray">
//                         <svg
//                           width="18"
//                           height="18"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             d="M7 10H9"
//                             stroke="currentColor"
//                             strokeWidth="1.5"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                           <path
//                             d="M15 10H15.01"
//                             stroke="currentColor"
//                             strokeWidth="1.5"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                           <path
//                             d="M21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7"
//                             stroke="currentColor"
//                             strokeWidth="1.5"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                           <path
//                             d="M16 3V7"
//                             stroke="currentColor"
//                             strokeWidth="1.5"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                           <path
//                             d="M8 3V7"
//                             stroke="currentColor"
//                             strokeWidth="1.5"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                         </svg>
//                       </div>
//                     </div>
//                     <ErrorMessage
//                       name="birthDate"
//                       component="div"
//                       className="text-danger text-xs mt-1"
//                     />
//                   </div>
//                 </div>

//                 {/* Photo + Gender (photo left small, gender right) */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
//                   <div>
//                     <label className="block text-secondary text-sm mb-1">
//                       Photo
//                     </label>
//                     <div
//                       onClick={() => photoRef.current?.click()}
//                       className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm flex items-center justify-between bg-white cursor-pointer"
//                     >
//                       <span className="text-gray">
//                         {values.photo ? values.photo.name : "Upload photo"}
//                       </span>
//                       <svg
//                         width="18"
//                         height="18"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="text-gray"
//                       >
//                         <path
//                           d="M12 16V8"
//                           stroke="currentColor"
//                           strokeWidth="1.5"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                         <path
//                           d="M8 12L12 8L16 12"
//                           stroke="currentColor"
//                           strokeWidth="1.5"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                         <path
//                           d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15"
//                           stroke="currentColor"
//                           strokeWidth="1.5"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                         />
//                       </svg>
//                     </div>
//                     <input
//                       ref={photoRef}
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={(e) =>
//                         setFieldValue(
//                           "photo",
//                           e.currentTarget.files?.[0] || null
//                         )
//                       }
//                     />
//                     <ErrorMessage
//                       name="photo"
//                       component="div"
//                       className="text-danger text-xs mt-1"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-secondary text-sm mb-1">
//                       Gender
//                     </label>
//                     <div className="relative">

//                     <Field
//                       as="select"
//                       name="gender"
//                       className="w-full rounded-full border px-4 py-2 pr-10 text-sm bg-white
//                       focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
//                       focus:border-primary border-gray-200 appearance-none"
//                       >
//                       <option className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white" value="">Prefer not to say</option>
//                       <option className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white" value="male">Male</option>
//                       <option className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white" value="female">Female</option>
//                     </Field>
//                                           <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
//                         <IoIosArrowDown />
//                       </span>
//                       </div>
//                   </div>
//                 </div>
//               </section>

//               {/* Contact & Job details */}
//               <section className="mt-6 bg-light-gray rounded-xl p-4">
//                 <h3 className="text-sm font-semibold text-secondary mb-3">
//                   Contact & Application
//                 </h3>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
//                   <div>
//                     <label className="block text-secondary text-sm mb-1">
//                       Email{" "}
//                       <span className="ms-1 font-semibold text-danger">(required)</span>
//                     </label>
//                     <Field
//                       name="email"
//                       type="email"
//                       placeholder="you@domain.com"
//                       className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.12)] focus:border-primary ${
//                         errors.email && touched.email
//                           ? "border-danger"
//                           : "border-gray-200"
//                       }`}
//                     />
//                     <ErrorMessage
//                       name="email"
//                       component="div"
//                       className="text-danger text-xs mt-1"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-secondary text-sm mb-1">
//                       Phone{" "}
//                       <span className="ms-1 font-semibold text-danger">(required)</span>
//                     </label>
//                     <div
//                       className={`flex items-center w-full rounded-full border bg-white overflow-hidden
//       focus-within:ring-2 focus-within:ring-[rgba(184,142,82,0.12)]
//       ${errors.phone && touched.phone ? "border-danger" : "border-gray-200"}`}
//                     >
//                       {/* Country code */}
//                       <Field
//                         as="select"
//                         name="phoneCode"
//                         className="h-full bg-transparent px-3 py-2 text-sm text-secondary border-r border-gray-200 focus:outline-none"
//                       >
//                         {COUNTRY_CODES.map((c) => (
//                           <option className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white justify-between" key={c.code} value={c.code}>
//                               <span>{c.label}</span>
//                               <span>{c.code}</span>
                            
//                           </option>
//                         ))}
//                       </Field>

//                       {/* Phone number */}
//                       <Field
//                         name="phone"
//                         placeholder="555 555 5555"
//                         className="flex-1 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
//                       />
//                     </div>

//                     <ErrorMessage
//                       name="phone"
//                       component="div"
//                       className="text-danger text-xs mt-1"
//                     />
//                   </div>
//                 </div>

//                 {/* Location split into country / city / area */}
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
//                   <div>
//                     <label className="block text-secondary text-sm mb-1">
//                       Country{" "}
//                       <span className="ms-1 font-semibold text-danger">(required)</span>
//                     </label>
//                     <div className="relative">

//                     <Field
//                       as="select"
//                       name="location.country"
//                       className={`w-full rounded-full border px-4 py-2 pr-10 text-sm bg-white
//                       focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
//                       focus:border-primary  appearance-none ${
//                         errors.location?.country && touched.location?.country
//                         ? "border-danger"
//                         : "border-gray-200"
//                       }`}
//                       >
//                       <option value="">Select country</option>
//                       {COUNTRY_CODES.map((c) => (
//                         <option className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white" key={c.code} value={c.label}>
//                           {c.label}
//                         </option>
//                       ))}
//                     </Field>
//                                           <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
//                         <IoIosArrowDown />
//                       </span>
//                       </div>
//                     <ErrorMessage
//                       name="location.country"
//                       component="div"
//                       className="text-danger text-xs mt-1"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-secondary text-sm mb-1">
//                       City<span className="ms-1 font-semibold text-danger">(required)</span>
//                     </label>
//                     <Field
//                       name="location.city"
//                       placeholder="City"
//                       className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary
//                         ${
//                           errors.location?.city && touched.location?.city
//                             ? "border-danger"
//                             : "border-gray-200"
//                         }`}
//                     />
//                     <ErrorMessage
//                       name="location.city"
//                       component="div"
//                       className="text-danger text-xs mt-1"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-secondary text-sm mb-1">
//                       Area / District
//                       <span className="ms-1 font-semibold text-danger">(required)</span>
//                     </label>
//                     <Field
//                       name="location.area"
//                       placeholder="Area / District"
//                       className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary
//                         ${
//                           errors.location?.area && touched.location?.area
//                             ? "border-danger"
//                             : "border-gray-200"
//                         }`}
//                     />
//                     <ErrorMessage
//                       name="location.area"
//                       component="div"
//                       className="text-danger text-xs mt-1"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
//                   <div>
//                     <label className="block text-secondary text-sm mb-1">
//                       LinkedIn Profile
//                     </label>
//                     <Field
//                       name="linkedin"
//                       placeholder="https://linkedin.com/in/you"
//                       className="w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary border-gray-200"
//                     />
//                     <ErrorMessage
//                       name="linkedin"
//                       component="div"
//                       className="text-danger text-xs mt-1"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-secondary text-sm mb-1">
//                       How did you hear about us?
//                     </label>
//                     <div className="relative">
//                       <Field
//                         as="select"
//                         name="source"
//                         className="w-full rounded-full border px-4 py-2 pr-10 text-sm bg-white
//                       focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
//                       focus:border-primary border-gray-200 appearance-none"
//                       >
//                         <option
//                           className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                           value=""
//                         >
//                           Select...
//                         </option>
//                         <option
//                           className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                           value="LinkedIn"
//                         >
//                           LinkedIn
//                         </option>
//                         <option
//                           className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                           value="Company Website"
//                         >
//                           Company Website
//                         </option>
//                         <option
//                           className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                           value="Employee Referral"
//                         >
//                           Employee Referral
//                         </option>
//                         <option
//                           className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                           value="Job Fair"
//                         >
//                           Job Fair
//                         </option>
//                         <option
//                           className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                           value="Other"
//                         >
//                           Other
//                         </option>
//                       </Field>
//                       <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
//                         <IoIosArrowDown />
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
//                   <div>
//                     <label className="block text-secondary text-sm mb-1">
//                       Department{" "}
//                       <span className="ms-1 font-semibold text-danger">(required)</span>
//                     </label>
//                     <div className="relative">

//                     <Field
//                       as="select"
//                       name="department"
//                       className={`w-full rounded-full border px-4 py-2 pr-10 text-sm bg-white
//                         focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
//                         focus:border-primary appearance-none ${
//                           errors.department && touched.department
//                           ? "border-danger"
//                           : "border-gray-200"
//                         }`}
//                         >
//                       <option className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white" value="">Select department</option>
//                       <option className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white" value="Technology/IT">Technology/IT</option>
//                       <option className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white" value="Marketing">Marketing</option>
//                       <option className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white" value="Sales">Sales</option>
//                       <option className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white" value="Finance">Finance</option>
//                       <option className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white" value="HR">HR</option>
//                     </Field>
//                                           <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
//                         <IoIosArrowDown />
//                       </span>
//                       </div>
//                     <ErrorMessage
//                       name="department"
//                       component="div"
//                       className="text-danger text-xs mt-1"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-secondary text-sm mb-1">
//                       Position Applying For{" "}
//                       <span className="ms-1 font-semibold text-danger">(required)</span>
//                     </label>
//                     <Field
//                       name="position"
//                       placeholder="e.g. Senior Software Developer"
//                       className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.12)] focus:border-primary ${
//                         errors.position && touched.position
//                           ? "border-danger"
//                           : "border-gray-200"
//                       }`}
//                     />
//                     <ErrorMessage
//                       name="position"
//                       component="div"
//                       className="text-danger text-xs mt-1"
//                     />
//                   </div>
//                 </div>

//                 <div className="mb-3">
//                   <label className="block text-secondary text-sm mb-1">
//                     Cover Note / Additional Information
//                   </label>
//                   <Field
//                     as="textarea"
//                     name="cover"
//                     placeholder="A short note about you"
//                     rows={4}
//                     className="w-full rounded-xl border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary"
//                   />
//                 </div>

//                 {/* Experiences - repeatable */}
//                 <div className="mb-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="text-sm font-semibold text-secondary">
//                       Work Experience
//                     </h4>
//                     <FieldArray name="experiences">
//                       {({ push, remove }) => (
//                         <div>
//                           <button
//                             type="button"
//                             onClick={() =>
//                               push({ company: "", years: "", role: "" })
//                             }
//                             className="text-sm rounded-full px-3 py-1 border"
//                             style={{
//                               background: "var(--color-secondary)",
//                               color: "white",
//                             }}
//                           >
//                             + Add
//                           </button>
//                         </div>
//                       )}
//                     </FieldArray>
//                   </div>

//                   <FieldArray name="experiences">
//                     {({ remove, push }) => (
//                       <div className="space-y-3">
//                         {values.experiences &&
//                           values.experiences.length > 0 &&
//                           values.experiences.map((exp, idx) => (
//                             <div className="">
//                               <div
//                                 key={idx}
//                                 className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white rounded-full "
//                               >
//                                 <div className="md:col-span-5">
//                                   <Field
//                                     name={`experiences.${idx}.company`}
//                                     placeholder="Company name"
//                                     className="w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
//                                   />
//                                   <ErrorMessage
//                                     name={`experiences.${idx}.company`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 md:hidden"
//                                   />
//                                 </div>

//                                 <div className="md:col-span-4">
//                                   <Field
//                                     name={`experiences.${idx}.role`}
//                                     placeholder="Role / Title"
//                                     className="w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
//                                   />
//                                   <ErrorMessage
//                                     name={`experiences.${idx}.role`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 md:hidden"
//                                   />
//                                 </div>
//                                 <div className="md:col-span-2">
//                                   <Field
//                                     name={`experiences.${idx}.years`}
//                                     placeholder="Years of experience"
//                                     className="w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
//                                   />
//                                   <ErrorMessage
//                                     name={`experiences.${idx}.years`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 md:hidden"
//                                   />
//                                 </div>

//                                 <div className="md:col-span-1 flex justify-end">
//                                   <button
//                                     type="button"
//                                     onClick={() => remove(idx)}
//                                     className="text-sm text-red-500"
//                                   >
//                                     <FaTrashAlt />
//                                   </button>
//                                 </div>
//                               </div>
//                               <div className="hidden md:grid md:grid-cols-12 gap-3 items-center bg-white rounded-full">
//                                 <div className="col-span-5">
//                                   <ErrorMessage
//                                     name={`experiences.${idx}.company`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 "
//                                   />
//                                 </div>
//                                 <div className="col-span-4">
//                                   <ErrorMessage
//                                     name={`experiences.${idx}.role`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 "
//                                   />
//                                 </div>
//                                 <div className="col-span-2">
//                                   <ErrorMessage
//                                     name={`experiences.${idx}.years`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 "
//                                   />
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                       </div>
//                     )}
//                   </FieldArray>
//                 </div>

//                 {/* Education - repeatable */}
//                 <div className="mb-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="text-sm font-semibold text-secondary">
//                       Education
//                     </h4>
//                     <FieldArray name="education">
//                       {({ push }) => (
//                         <div>
//                           <button
//                             type="button"
//                             onClick={() =>
//                               push({ institution: "", degree: "", year: "" })
//                             }
//                             className="text-sm rounded-full px-3 py-1 border"
//                             style={{
//                               background: "var(--color-secondary)",
//                               color: "white",
//                             }}
//                           >
//                             + Add
//                           </button>
//                         </div>
//                       )}
//                     </FieldArray>
//                   </div>

//                   <FieldArray name="education">
//                     {({ remove }) => (
//                       <div className="space-y-3">
//                         {values.education &&
//                           values.education.length > 0 &&
//                           values.education.map((edu, idx) => (
//                             <div className="">
//                               <div
//                                 key={idx}
//                                 className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
//                               >
//                                 <div className="md:col-span-5">
//                                   <Field
//                                     name={`education.${idx}.institution`}
//                                     placeholder="Institution"
//                                     className="w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
//                                   />
//                                   <ErrorMessage
//                                     name={`education.${idx}.institution`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 md:hidden"
//                                   />
//                                 </div>

//                                 <div className="md:col-span-4">
//                                   <Field
//                                     name={`education.${idx}.degree`}
//                                     placeholder="Degree / Major"
//                                     className="w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
//                                   />
//                                   <ErrorMessage
//                                     name={`education.${idx}.degree`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 md:hidden"
//                                   />
//                                 </div>

//                                 <div className="md:col-span-2">
//                                   <Field
//                                     name={`education.${idx}.year`}
//                                     placeholder="Year"
//                                     className="w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
//                                   />
//                                   <ErrorMessage
//                                     name={`education.${idx}.year`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 md:hidden"
//                                   />
//                                 </div>

//                                 <div className="md:col-span-1 flex justify-end">
//                                   <button
//                                     type="button"
//                                     onClick={() => remove(idx)}
//                                     className="text-sm text-red-500"
//                                   >
//                                     <FaTrashAlt />
//                                   </button>
//                                 </div>
//                               </div>
//                               <div className="hidden md:grid md:grid-cols-12 gap-3 items-center bg-white rounded-full">
//                                 <div className="col-span-5">
//                                   <ErrorMessage
//                                     name={`education.${idx}.institution`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 "
//                                   />
//                                 </div>
//                                 <div className="col-span-4">
//                                   <ErrorMessage
//                                     name={`education.${idx}.degree`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 "
//                                   />
//                                 </div>
//                                 <div className="col-span-2">
//                                   <ErrorMessage
//                                     name={`education.${idx}.year`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 "
//                                   />
//                                 </div>
//                               </div>
//                             </div>
//                           ))}
//                       </div>
//                     )}
//                   </FieldArray>
//                 </div>

//                 {/* CV Upload */}
//                 <div className="mt-2">
//                   <label className="block text-secondary text-sm mb-1">
//                     Upload CV{" "}
//                     <span className="ms-1 font-semibold text-danger">(required)</span>
//                   </label>

//                   <div
//                     onClick={() => fileRef.current?.click()}
//                     className={`w-full rounded-full border px-4 py-2 text-sm bg-white flex items-center justify-between cursor-pointer ${
//                       errors.cv && touched.cv
//                         ? "border-danger"
//                         : "border-dashed border-light-gray"
//                     }`}
//                   >
//                     <span className="text-gray">
//                       {values.cv
//                         ? values.cv.name
//                         : "Drag & drop or click to upload CV (PDF/DOC/DOCX)"}
//                     </span>
//                     <svg
//                       width="18"
//                       height="18"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="text-gray"
//                     >
//                       <path
//                         d="M12 16V8"
//                         stroke="currentColor"
//                         strokeWidth="1.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                       <path
//                         d="M8 12L12 8L16 12"
//                         stroke="currentColor"
//                         strokeWidth="1.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                       <path
//                         d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15"
//                         stroke="currentColor"
//                         strokeWidth="1.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   </div>

//                   <input
//                     ref={fileRef}
//                     type="file"
//                     accept=".pdf,.doc,.docx"
//                     className="hidden"
//                     onChange={(e) =>
//                       setFieldValue("cv", e.currentTarget.files?.[0] || null)
//                     }
//                   />
//                   <ErrorMessage
//                     name="cv"
//                     component="div"
//                     className="text-danger text-xs mt-1"
//                   />
//                 </div>
//               </section>

//               {/* Actions */}
//               <div className="mt-6 flex gap-3">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="rounded-full px-5 py-2 text-white font-semibold"
//                   style={{ background: "var(--color-primary)" }}
//                 >
//                   {isSubmitting ? "Submitting..." : "Submit Application"}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setApiError(null);
//                     setApiSuccess(null);
//                     setSubmitted(null);
//                     resetForm();
//                     window.scrollTo({ top: 0, behavior: "smooth" });
//                   }}
//                   className="rounded-full px-5 py-2 border"
//                 >
//                   Reset
//                 </button>
//               </div>

//               {/* Live Application Summary - updates on every field change */}
//               <div className="mt-8">
//                 <h3 className="text-sm font-semibold text-secondary">
//                   Live Application preview
//                 </h3>
//                 <div className="mt-2 bg-white border rounded-lg p-4">
//                   <ul className="text-sm text-gray space-y-1">
//                     <li>
//                       <strong className="text-secondary">Name:</strong>{" "}
//                       {values.firstName}{" "}
//                       {values.middleName ? values.middleName + " " : ""}
//                       {values.lastName}
//                     </li>
//                     <li>
//                       <strong className="text-secondary">Email:</strong>{" "}
//                       {values.email || "—"}
//                     </li>
//                     <li>
//                       <strong className="text-secondary">Phone:</strong>{" "}
//                       {values.phoneCode} {values.phone || "—"}
//                     </li>
//                     <li>
//                       <strong className="text-secondary">Location:</strong>{" "}
//                       {values.location?.country || "—"}
//                       {values.location?.city ? `, ${values.location.city}` : ""}
//                       {values.location?.area
//                         ? ` — ${values.location.area}`
//                         : ""}
//                     </li>
//                     <li>
//                       <strong className="text-secondary">Department:</strong>{" "}
//                       {values.department || "—"}
//                     </li>
//                     <li>
//                       <strong className="text-secondary">Position:</strong>{" "}
//                       {values.position || "—"}
//                     </li>
//                     <li>
//                       <strong className="text-secondary">CV:</strong>{" "}
//                       {values.cv ? values.cv.name : "—"}
//                     </li>
//                     <li>
//                       <strong className="text-secondary">Photo:</strong>{" "}
//                       {values.photo ? values.photo.name : "—"}
//                     </li>
//                     <li>
//                       <strong className="text-secondary">Experience:</strong>
//                       <ul className="pl-4 list-disc mt-1">
//                         {values.experiences && values.experiences.length > 0 ? (
//                           values.experiences.map((e, i) => (
//                             <li key={i} className="text-sm text-gray">
//                               {e.company || "—"} — {e.role || "—"} (
//                               {e.years || "—"} yrs)
//                             </li>
//                           ))
//                         ) : (
//                           <li className="text-sm text-gray">—</li>
//                         )}
//                       </ul>
//                     </li>

//                     <li>
//                       <strong className="text-secondary">Education:</strong>
//                       <ul className="pl-4 list-disc mt-1">
//                         {values.education && values.education.length > 0 ? (
//                           values.education.map((ed, i) => (
//                             <li key={i} className="text-sm text-gray">
//                               {ed.institution || "—"} — {ed.degree || "—"} (
//                               {ed.year || "—"})
//                             </li>
//                           ))
//                         ) : (
//                           <li className="text-sm text-gray">—</li>
//                         )}
//                       </ul>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// }
