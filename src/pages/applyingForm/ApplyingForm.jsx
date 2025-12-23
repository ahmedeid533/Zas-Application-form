// ApplyingForm.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray, useFormikContext } from "formik";
import * as Yup from "yup";
import { FaTrashAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { GetDepartments, GetDepartment, GetGenders, GetLocations, GetJobs, GetCountries, GetHowDoYouKnow, GetSocials } from "../../assets/apis/applyingJob/ApplyingJobApi";
import { useQuery } from "@tanstack/react-query";
import { IoCheckmarkSharp } from "react-icons/io5";
import { useScreenViewStore } from "../../assets/store/screenViewStore";
import { uploadToCloudinary } from "../../cloudinary/cloudinary";
import toast from "react-hot-toast";

/**
 * Updated ApplyingForm.jsx
 * - CV upload moved to the start of Step 0 and triggers autofill on selection
 * - Prevent jumping forward via top tabs unless previous steps valid
 * - Improved autofill: email, phone (tolerant), name, linkedin, github, address
 * - CV remains optional
 */

const API_URL = "https://apitest.skyculinaire.com/api/CV/CVTransaction/NewEmployee";

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
  { code: "+65", label: "Singapore" },
  { code: "+41", label: "Switzerland" },
  { code: "+27", label: "South Africa" },
  { code: "+7", label: "Russia" },
  { code: "+998", label: "Uzbekistan" },
  // ... keep the full list if you had more
];

export default function ApplyingForm() {
  const fileRef = useRef(null);
  const photoRef = useRef(null);
  const { footerHeight, navBarHeight } = useScreenViewStore();

  const [submitted, setSubmitted] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  const { data: departments } = useQuery({ queryKey: ["departments"], queryFn: GetDepartments });
  const { data: jobs } = useQuery({ queryKey: ["jobs"], queryFn: GetJobs });
  const { data: socials } = useQuery({ queryKey: ["socials"], queryFn: GetSocials });
  const { data: genders } = useQuery({ queryKey: ["genders"], queryFn: GetGenders });
  const { data: countries } = useQuery({ queryKey: ["countries"], queryFn: GetCountries });
  const { data: howDoYouKnew } = useQuery({ queryKey: ["howDoYouKnew"], queryFn: GetHowDoYouKnow });

  const getUniqueItems = (data, key) => {
    const arr = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
    const uniqueItems = [];
    const seen = new Set();
    for (const item of arr) {
      if (!item || !(key in item)) continue;
      const val = item[key];
      if (!seen.has(val)) {
        seen.add(val);
        uniqueItems.push(item);
      }
    }
    return uniqueItems;
  };

  const countriesArray = Array.isArray(countries) ? countries : (countries && Array.isArray(countries.data) ? countries.data : []);
  const uniqueCountries = useMemo(() => getUniqueItems(countriesArray, "countryID"), [countries]);
  const uniqueCities = useMemo(() => {
    if (!selectedCountry) return [];
    return getUniqueItems(countriesArray.filter((item) => item.countryID === Number(selectedCountry)), "cityID");
  }, [countries, selectedCountry]);
  const uniqueAreas = useMemo(() => getUniqueItems(countriesArray.filter((item) => item.countryID == selectedCountry && item.cityID == selectedCity), "ariaID"), [countriesArray, selectedCountry, selectedCity]);

  const SUPPORTED_CV = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
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
birthDate: Yup.date()
  .required("Birth date is required")
  .max(new Date(new Date().setFullYear(new Date().getFullYear() - 16)), "Invalid date"),
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
        if (!value) return true;
        return value && SUPPORTED_IMAGES.includes(value.type);
      }),
    cv: Yup.mixed()
      .nullable()
      .test("fileType", "CV must be PDF/DOC/DOCX/TXT", (value) => {
        if (!value) return true;
        return value && SUPPORTED_CV.includes(value.type);
      })
      .test("fileSize", "Max file size is 5MB", (value) => {
        if (!value) return true;
        return value && value.size <= 5 * 1024 * 1024;
      }),
  });

  const initialValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split('T')[0],
    email: "",
    phoneCode: "+20",
    secondPhoneCode: "+20",
    phone: "",
    secondPhone: "",
    socialStatus: "",
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
    experiences: [],
    education: [],
  };

  // --- STEP WIZARD STATE & settings ---
  const [currentStep, setCurrentStep] = useState(0);
  const steps = ["Personal", "Contact & Address", "Job Details", "Review & Submit"];

  // map which fields belong to each step (used for per-step validation)
  const stepFields = [
    // step 0 - Personal (cv is optional and intentionally not required)
    ["firstName", "middleName", "lastName", "birthDate", "gender", "socialStatus", "photo"],
    // step 1 - Contact & Address
    ["email", "phoneCode", "phone", "secondPhone", "location.country", "location.city", "location.area", "location.address", "linkedin", "github"],
    // step 2 - Job Details
    ["department", "position", "cover", "experiences", "education", "cv"],
    // step 3 - Review & Submit -> no specific fields (full form validated on submit)
    []
  ];

  function SubmitWatcher() {
    const { submitCount, errors } = useFormikContext();
    const shownRef = useRef(0);
    useEffect(() => {
      if (submitCount > 0 && Object.keys(errors || {}).length > 0) {
        if (shownRef.current !== submitCount) {
          toast.error("Please fill all required fields correctly");
          shownRef.current = submitCount;
        }
      }
    }, [submitCount, errors]);
    return null;
  }

  // helper: check nested error for a path (errors object from Formik)
  const hasErrorForPath = (errorsObj, path) => {
    const parts = path.split(".");
    let cur = errorsObj;
    for (const p of parts) {
      if (!cur) return false;
      cur = cur[p];
    }
    return !!cur;
  };

  // Handle clicking on a top tab: allow only backward always; forward only if previous steps valid
  const handleStepClick = async (targetIndex, validateForm, values, setTouched) => {
    if (targetIndex <= currentStep) {
      setCurrentStep(targetIndex);
      return;
    }
    const errors = await validateForm();
    const requiredPaths = stepFields.slice(0, targetIndex).flat();
    const stepHasErrors = requiredPaths.some(path => hasErrorForPath(errors, path));
    if (stepHasErrors) {
      // mark touched for previous required fields so errors show
      const touchedObj = {};
      requiredPaths.forEach((path) => {
        const parts = path.split(".");
        let cur = touchedObj;
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i];
          if (i === parts.length - 1) {
            cur[p] = true;
          } else {
            cur[p] = cur[p] || {};
            cur = cur[p];
          }
        }
      });
      setTouched((prev) => ({ ...prev, ...touchedObj }));
      toast.error("Please complete required fields in previous steps before going forward.");
      return;
    }
    setCurrentStep(targetIndex);
  };

  // **Autofill from CV** — improved, tolerant regexes and heuristics
const handleAutofillFromCV = async (file, setFieldValue) => {
  if (!file) {
    toast.error("No CV chosen");
    return;
  }

  // Helper function to extract data from text
  const processText = (txt) => {
    console.log("Processing CV text...");
    const raw = String(txt || "").replace(/\s+/g, " ");
    const lines = txt.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    
    // DEBUG: Show what we're working with
    console.log("First 3 lines:", lines.slice(0, 3));
    console.log("Full text (first 1000 chars):", raw.substring(0, 1000));

    // ========== EXTRACT NAME ==========
    // Method 1: Look for name pattern in first few lines
    let extractedName = null;
    
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      console.log(`Checking line ${i}: "${line}"`);
      
      // Clean the line
      const cleanLine = line.replace(/[#\*•\-–\|]/g, " ").replace(/\s+/g, " ").trim();
      
      // Skip if too short or too long
      if (cleanLine.length < 4 || cleanLine.length > 50) continue;
      
      // Skip if contains email, phone, or URL
      if (/@|http|www|\.com|github|linkedin|\d{10,}/i.test(cleanLine)) continue;
      
      // Split into words
      const words = cleanLine.split(" ").filter(w => w.length > 0);
      
      // Should have 2-3 words for a name
      if (words.length < 2 || words.length > 4) continue;
      
      // Check if words look like names (start with capital letter)
      const looksLikeName = words.every(word => 
        /^[A-Z][a-z]*$/.test(word) || 
        /^[A-Z]$/.test(word) || // Single letter initial
        /^[A-Z][a-z]*[A-Z][a-z]*$/.test(word) // CamelCase
      );
      
      if (looksLikeName && !/\d/.test(cleanLine)) {
        extractedName = cleanLine;
        console.log("✅ Found name:", extractedName);
        break;
      }
    }
    
    // Method 2: If not found, try to find the largest text (usually name)
    if (!extractedName && lines.length > 0) {
      // Just take the first non-empty line that doesn't look like other info
      for (const line of lines.slice(0, 3)) {
        const cleanLine = line.replace(/[#\*]/g, "").trim();
        const words = cleanLine.split(" ").filter(w => w.length > 0);
        
        if (words.length === 2 && 
            !/\d/.test(cleanLine) && 
            !/@/.test(cleanLine) &&
            !/http/.test(cleanLine)) {
          
          extractedName = cleanLine;
          console.log("✅ Found name (fallback):", extractedName);
          break;
        }
      }
    }
    
    // Set name fields
    if (extractedName) {
      const nameParts = extractedName.split(" ").filter(p => p.length > 0);
      setFieldValue("firstName", nameParts[0] || "");
      
      if (nameParts.length === 2) {
        setFieldValue("lastName", nameParts[1] || "");
      } else if (nameParts.length >= 3) {
        setFieldValue("middleName", nameParts.slice(1, -1).join(" "));
        setFieldValue("lastName", nameParts[nameParts.length - 1] || "");
      }
    }

    // ========== EXTRACT EMAIL ==========
    const emailMatch = txt.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    if (emailMatch) {
      setFieldValue("email", emailMatch[0]);
      console.log("✅ Found email:", emailMatch[0]);
    }

    // ========== EXTRACT PHONE ==========
    // Egyptian phone patterns
    const phonePatterns = [
      /01[0-2|5]\d{8}/g,  // Egyptian mobile
      /(?:\+?20)?1[0-2|5]\d{8}/g, // With country code
      /\b\d{10,11}\b/g    // Any 10-11 digit number
    ];
    
    let phoneFound = null;
    for (const pattern of phonePatterns) {
      const matches = txt.match(pattern);
      if (matches && matches.length > 0) {
        phoneFound = matches[0].replace(/\D/g, ""); // Keep only digits
        break;
      }
    }
    
    if (phoneFound) {
      setFieldValue("phoneCode", "+20");
      setFieldValue("phone", phoneFound);
      console.log("✅ Found phone:", phoneFound);
    }

    // ========== EXTRACT LINKEDIN ==========
    const linkedinRegex = /(?:linkedin\.com\/[^\s]+|linkedin\.com\/in\/[^\s]+)/gi;
    const linkedinMatch = txt.match(linkedinRegex);
    if (linkedinMatch) {
      let linkedinUrl = linkedinMatch[0];
      if (!linkedinUrl.startsWith("http")) {
        linkedinUrl = "https://" + linkedinUrl;
      }
      setFieldValue("linkedin", linkedinUrl);
      console.log("✅ Found LinkedIn:", linkedinUrl);
    }

    // ========== EXTRACT GITHUB ==========
    const githubRegex = /(?:github\.com\/[^\s]+)/gi;
    const githubMatch = txt.match(githubRegex);
    if (githubMatch) {
      let githubUrl = githubMatch[0];
      if (!githubUrl.startsWith("http")) {
        githubUrl = "https://" + githubUrl;
      }
      setFieldValue("github", githubUrl);
      console.log("✅ Found GitHub:", githubUrl);
    }

    // ========== EXTRACT ADDRESS ==========
    // Look for Egyptian cities
    const egyptianCities = [
      "Damanhour", "Cairo", "Alexandria", "Giza", "Luxor", 
      "Aswan", "Port Said", "Suez", "Ismailia", "Mansoura"
    ];
    
    for (const city of egyptianCities) {
      if (txt.includes(city)) {
        setFieldValue("location.address", city);
        console.log("✅ Found address/city:", city);
        break;
      }
    }
  };

  // ========== FILE READING ==========
  try {
    console.log("Reading file:", file.name, "Type:", file.type);
    
    // For all file types, try to read as text first
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target.result;
        console.log("File read successfully, length:", result.length);
        
        if (result.length === 0) {
          toast.error("File appears to be empty");
          return;
        }
        
        // Try to process as text
        processText(String(result));
        
        // If we found at least one field, show success
        toast.success("Autofill completed! Please verify the information.");
        
      } catch (processError) {
        console.error("Error processing file:", processError);
        toast.error("Error processing file content");
      }
    };
    
    reader.onerror = (e) => {
      console.error("FileReader error:", e);
      toast.error("Failed to read file");
    };
    
    // Try different reading methods
    if (file.type === 'application/pdf') {
      // For PDFs, we need to handle binary data
      console.log("Reading PDF file...");
      
      // First try: Read as ArrayBuffer and convert
      const arrayBufferReader = new FileReader();
      
      arrayBufferReader.onload = (e) => {
        try {
          const buffer = e.target.result;
          const uint8Array = new Uint8Array(buffer);
          
          // Convert to string (may contain binary data)
          let text = '';
          for (let i = 0; i < Math.min(uint8Array.length, 100000); i++) {
            // Only include printable characters
            if (uint8Array[i] >= 32 && uint8Array[i] <= 126) {
              text += String.fromCharCode(uint8Array[i]);
            } else if (uint8Array[i] === 10 || uint8Array[i] === 13) {
              text += '\n';
            } else {
              text += ' ';
            }
          }
          
          console.log("Extracted PDF text (first 500 chars):", text.substring(0, 500));
          processText(text);
          toast.success("PDF processed successfully!");
          
        } catch (pdfError) {
          console.error("PDF processing error:", pdfError);
          toast.error("Could not extract text from PDF");
        }
      };
      
      arrayBufferReader.readAsArrayBuffer(file);
      
    } else {
      // For text-based files (DOC, DOCX, TXT)
      console.log("Reading text-based file...");
      reader.readAsText(file);
    }
    
  } catch (error) {
    console.error("General file reading error:", error);
    toast.error("Unable to process the file");
  }
};

  // helper to check per-step errors and mark touched for current step
  const validateStepAndProceed = async (validateForm, values, setTouched) => {
    const errors = await validateForm();
    const fields = stepFields[currentStep] || [];
    const stepHasErrors = fields.some((path) => {
      const parts = path.split(".");
      let v = errors;
      for (const p of parts) {
        if (!v) return false;
        v = v[p];
      }
      return !!v;
    });

    if (stepHasErrors) {
      // mark the step fields as touched to show validation messages
      const touchedObj = {};
      fields.forEach((path) => {
        const parts = path.split(".");
        let cur = touchedObj;
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i];
          if (i === parts.length - 1) {
            cur[p] = true;
          } else {
            cur[p] = cur[p] || {};
            cur = cur[p];
          }
        }
      });
      setTouched((prev) => ({ ...prev, ...touchedObj }));
      toast.error("Please fix required fields in this step before continuing");
      return false;
    }
    return true;
  };

  useEffect(() => {
    // placeholder if you want side-effects on nav/footer sizes
  }, [navBarHeight, footerHeight]);

  if (apiSuccess) return (
    <div className="flex flex-col items-center justify-center gap-1 text-center" style={{
      height: `calc( 100vh - ${(navBarHeight + footerHeight)}px)`
    }}>
      <IoCheckmarkSharp className="text-[300px] text-green-500"/>
      <p className="text-3xl font-bold">Thank You!</p>
      <p className="sm:text-2xl text-xl">Your application was successfully submitted</p>
      <p className="text-xl text-gray-600">We will contact you soon</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-start justify-center p-6 bg-gradient-to-b from-white to-gray-50 pt-26">
      <div className="w-full max-w-5xl">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            setApiError(null);
            setApiSuccess(null);
            try {
              const personalImage = values.photo ? await uploadToCloudinary(values.photo) : "";
              const cvUpload = values.cv ? await uploadToCloudinary(values.cv) : "";
              const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "*/*" },
                body: JSON.stringify({
                  personalId: 0,
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
                  personalCityAreaId: Number(values.location.area),
                  personalStreet: values.location.address,
                  personalGenderId: Number(values.gender),
                  personalCvLinkedInProfile: values.linkedin,
                  personalCvGithubProfile: values.github,
                  personalCvCoverNote: values.cover,
                  personalCvHowNowAboutUsId: Number(values.source),
                  personalSocialId: Number(values.socialStatus),
                  personalCvUploadPickt: personalImage,
                  personalCvUploadCV: cvUpload,
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
                })
              });

              const data = await res.json().catch(()=>null);
              if (res.ok) {
                setApiSuccess(true);
                const summary = { ...values };
                if (values.cv) summary.cv = { name: values.cv.name, size: values.cv.size };
                if (values.photo) summary.photo = { name: values.photo.name, size: values.photo.size };
                setSubmitted(summary);
                actions.resetForm();
                setCurrentStep(0);
              } else {
                setApiError((data && data.message) || `Submission failed (status ${res.status})`);
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
          {({ setFieldValue, isSubmitting, values, errors, touched, validateForm, setTouched }) => (
            <>
              <SubmitWatcher />
              <Form className="bg-white border rounded-2xl py-6 md:px-6 px-2 shadow-sm border-light-gray">
                <h2 className="text-xl font-semibold text-secondary">Job Application</h2>
                <p className="text-sm text-gray mt-1">Complete the form — step {currentStep + 1} of {steps.length}</p>

                {/* STEP INDICATOR */}
                <div className="mt-4 flex items-center gap-3">
                  {steps.map((s, i) => (
                    <div
                      key={s}
                      className={`flex-1 text-center py-2 rounded-full cursor-pointer ${i === currentStep ? "bg-primary text-white" : i < currentStep ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600" }`}
                      onClick={() => handleStepClick(i, validateForm, values, setTouched)}
                    >
                      {s}
                    </div>
                  ))}
                </div>

                {/* STEP CONTENT */}
                <div className="mt-6">
                  {currentStep === 0 && (
                    <section className="rounded-xl flex gap-6 items-center md:flex-row-reverse flex-col">
                      {/* === CV Upload placed at the top for immediate autofill === */}
                      <div className="mb-4">
                        <label className="block text-secondary text-sm mb-1">Upload CV (optional) — we will attempt to autofill fields</label>
                        <div onClick={() => fileRef.current?.click()} className={`w-full rounded-full border px-4 py-2 text-sm bg-white flex items-center justify-between cursor-pointer ${errors.cv && touched.cv ? "border-danger" : "border-dashed border-light-gray"}`}>
                          <span className="text-gray">{values.cv ? values.cv.name : "Click to upload CV (PDF / DOC / DOCX / TXT)"}</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 12L12 8L16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <input
                          ref={fileRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          className="hidden"
                          onChange={async (e) => {
                            const f = e.currentTarget.files?.[0] || null;
                            setFieldValue("cv", f);
                            if (f) {
                              // attempt autofill immediately
                              await handleAutofillFromCV(f, setFieldValue);
                            }
                          }}
                        />
                        <ErrorMessage name="cv" component="div" className="text-danger text-xs mt-1" />
                        {values.cv && (
                          <div className="mt-2 flex gap-2">
                            <button type="button" onClick={() => handleAutofillFromCV(values.cv, setFieldValue)} className="px-3 py-1 border rounded-full">Autofill from CV</button>
                            <button type="button" onClick={() => { setFieldValue("cv", null); }} className="px-3 py-1 border rounded-full">Remove CV</button>
                          </div>
                        )}
                      </div>

                      {/* Personal Data (same fields as before) */}
                      <div className="grid flex-1 grid-cols-1 w-full  gap-5">
                        <div className="bg-light-gray p-4 rounded-lg flex flex-col gap-2.5 ">
                          <h3 className="text-sm font-semibold text-secondary mb-3">Personal Data</h3>
                          <div>
                            <label className="block text-secondary text-sm mb-1">First Name <span className="ms-1 font-semibold text-danger">(required)</span></label>
                            <Field name="firstName" placeholder="First" className={`w-full rounded-full border px-4 py-2 text-sm ${errors.firstName && touched.firstName ? "border-danger" : "border-gray-200"}`} />
                            <ErrorMessage name="firstName" component="div" className="text-danger text-xs mt-1" />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">Middle Name <span className="ms-1 font-semibold text-danger">(required)</span></label>
                            <Field name="middleName" placeholder="Middle" className={`w-full rounded-full border px-4 py-2 text-sm ${errors.middleName && touched.middleName ? "border-danger" : "border-gray-200"}`} />
                            <ErrorMessage name="middleName" component="div" className="text-danger text-xs mt-1" />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">Last Name <span className="ms-1 font-semibold text-danger">(required)</span></label>
                            <Field name="lastName" placeholder="Last" className={`w-full rounded-full border px-4 py-2 text-sm ${errors.lastName && touched.lastName ? "border-danger" : "border-gray-200"}`} />
                            <ErrorMessage name="lastName" component="div" className="text-danger text-xs mt-1" />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">Birth Date <span className="ms-1 font-semibold text-danger">(required)</span></label>
                            <Field name="birthDate" type="date" placeholder="Birth Date"  className={`w-full rounded-full border px-4 py-2 text-sm ${errors.birthDate && touched.birthDate ? "border-danger" : "border-gray-200"}`} />
                            <ErrorMessage name="birthDate" component="div" className="text-danger text-xs mt-1" />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">Gender <span className="ms-1 font-semibold text-danger">(required)</span></label>
                            <Field as="select" name="gender" className={`w-full appearance-none rounded-full border px-4 py-2 text-sm ${errors.gender && touched.gender ? "border-danger" : "border-gray-200"}`}>
                              <option value="">Select Gender</option>
                              {genders && genders.map(g => <option value={g.personalGenderId} key={g.personalGenderId}>{g.personalGenderName}</option>)}
                            </Field>
                            <ErrorMessage name="gender" component="div" className="text-danger text-xs mt-1" />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">Social status <span className="ms-1 font-semibold text-danger">(required)</span></label>
                            <Field as="select" name="socialStatus" className={`w-full rounded-full border px-4 py-2 text-sm ${errors.socialStatus && touched.socialStatus ? "border-danger" : "border-gray-200"}`}>
                              <option value="">Select Social Status</option>
                              {socials && socials.map(s => <option value={s.personalSocialId} key={s.personalSocialId}>{s.personalSocialName}</option>)}
                            </Field>
                            <ErrorMessage name="socialStatus" component="div" className="text-danger text-xs mt-1" />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">Photo</label>
                            <div onClick={() => photoRef.current?.click()} className="w-full rounded-full border px-4 py-2 text-sm bg-white flex items-center justify-between cursor-pointer">
                              <span className="text-gray">{values.photo ? values.photo.name : "Upload photo"}</span>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 12L12 8L16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e)=> setFieldValue("photo", e.currentTarget.files?.[0] || null)} />
                            <ErrorMessage name="photo" component="div" className="text-danger text-xs mt-1" />
                          </div>
                        </div>
                        {/* empty right column or other content if needed */}
                      </div>
                    </section>
                  )}

                  {currentStep === 1 && (
                    <section>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-light-gray p-4 rounded-lg">
                          <h3 className="text-sm font-semibold text-secondary mb-3">Address Information</h3>

                          <div>
                            <label className="block text-secondary text-sm mb-1">Country <span className="ms-1 font-semibold text-danger">(required)</span></label>
                            <div className="relative">
                              <Field as="select" name="location.country" onChange={(e)=>{ setSelectedCountry(e.target.value); setFieldValue("location.country", e.target.value); setFieldValue("location.city", ""); setFieldValue("location.area", ""); }} className={`w-full rounded-full border px-4 py-2 pr-10 text-sm ${errors.location?.country && touched.location?.country ? "border-danger" : "border-gray-200"}`}>
                                <option value="">Select country</option>
                                {uniqueCountries && uniqueCountries.map(c => <option value={c.countryID} key={c.countryID}>{c.countryName}</option>)}
                              </Field>
                            </div>
                            <ErrorMessage name="location.country" component="div" className="text-danger text-xs mt-1" />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">City <span className="ms-1 font-semibold text-danger">(required)</span></label>
                            <Field as="select" name="location.city" disabled={!selectedCountry} onChange={(e)=>{ setSelectedCity(e.target.value); setFieldValue("location.city", e.target.value); setFieldValue("location.area", ""); }} className={`w-full rounded-full border px-4 py-2 pr-10 text-sm ${errors.location?.city && touched.location?.city ? "border-danger" : "border-gray-200"}`}>
                              <option value="">Select city</option>
                              {uniqueCities && uniqueCities.map(c => <option value={c.cityID} key={c.cityID}>{c.cityName}</option>)}
                            </Field>
                            <ErrorMessage name="location.city" component="div" className="text-danger text-xs mt-1" />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">Area / District <span className="ms-1 font-semibold text-danger">(required)</span></label>
                            <Field as="select" name="location.area" disabled={!selectedCountry || !selectedCity} className={`w-full rounded-full border px-4 py-2 pr-10 text-sm ${errors.location?.area && touched.location?.area ? "border-danger" : "border-gray-200"}`}>
                              <option value="">Select area</option>
                              {uniqueAreas && uniqueAreas.map(a => <option value={a.ariaID} key={a.ariaID}>{a.ariaName}</option>)}
                            </Field>
                            <ErrorMessage name="location.area" component="div" className="text-danger text-xs mt-1" />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">Address <span className="ms-1 font-semibold text-danger">(required)</span></label>
                            <Field name="location.address" placeholder="address" className={`w-full rounded-full border px-4 py-2 text-sm ${errors.location?.address && touched.location?.address ? "border-danger" : "border-gray-200"}`} />
                            <ErrorMessage name="location.address" component="div" className="text-danger text-xs mt-1" />
                          </div>
                        </div>

                        <div className="bg-light-gray p-4 rounded-lg">
                          <h3 className="text-sm font-semibold text-secondary mb-3">Contact Info</h3>
                          <div>
                            <label className="block text-secondary text-sm mb-1">Email <span className="ms-1 font-semibold text-danger">(required)</span></label>
                            <Field name="email" type="email" placeholder="you@domain.com" className={`w-full rounded-full border px-4 py-2 text-sm ${errors.email && touched.email ? "border-danger" : "border-gray-200"}`} />
                            <ErrorMessage name="email" component="div" className="text-danger text-xs mt-1" />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">Phone <span className="ms-1 font-semibold text-danger">(required)</span></label>
                            <div className={`flex items-center w-full rounded-full border bg-white overflow-hidden ${errors.phone && touched.phone ? "border-danger" : "border-gray-200"}`}>
                              <Field as="select" name="phoneCode" className="h-full bg-transparent px-3 py-2 text-sm text-secondary border-r border-gray-200 focus:outline-none">
                                {COUNTRY_CODES.map((c) => <option key={c.code} value={c.code}>{c.code}</option>)}
                              </Field>
                              <Field name="phone" placeholder="xxx xxx xxxx" className="flex-1 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none" />
                            </div>
                            <ErrorMessage name="phone" component="div" className="text-danger text-xs mt-1" />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">LinkedIn Profile</label>
                            <Field name="linkedin" placeholder="https://linkedin.com/in/you" className="w-full rounded-full border px-4 py-2 text-sm border-gray-200" />
                            <ErrorMessage name="linkedin" component="div" className="text-danger text-xs mt-1" />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">Github Profile</label>
                            <Field name="github" placeholder="https://github.com/you" className="w-full rounded-full border px-4 py-2 text-sm border-gray-200" />
                            <ErrorMessage name="github" component="div" className="text-danger text-xs mt-1" />
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {currentStep === 2 && (
                    <section className="mt-4 bg-light-gray rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-secondary mb-3">Application Details</h3>
                      <div>
                        <label className="block text-secondary text-sm mb-1">Department <span className="ms-1 font-semibold text-danger">(required)</span></label>
                        <Field as="select" name="department" className={`w-full rounded-full border px-4 py-2 pr-10 text-sm ${errors.department && touched.department ? "border-danger": "border-gray-200"}`}>
                          <option value="">Select department</option>
                          {departments && departments.map(d => <option value={d.departmentId} key={d.departmentId}>{d.departmentName}</option>)}
                        </Field>
                        <ErrorMessage name="department" component="div" className="text-danger text-xs mt-1" />
                      </div>

                      <div className="mt-3">
                        <label className="block text-secondary text-sm mb-1">Position Applying For <span className="ms-1 font-semibold text-danger">(required)</span></label>
                        <Field as="select" name="position" className={`w-full rounded-full border px-4 py-2 pr-10 text-sm ${errors.position && touched.position ? "border-danger": "border-gray-200"}`}>
                          <option value="">Select position</option>
                          {jobs && jobs.map(j => <option value={j.jopId} key={j.jopId}>{j.jopName}</option>)}
                        </Field>
                        <ErrorMessage name="position" component="div" className="text-danger text-xs mt-1" />
                      </div>

                      <div className="mt-4">
                        <label className="block text-secondary text-sm mb-1">Why we should hire you ?</label>
                        <Field as="textarea" name="cover" rows={4} className="w-full rounded-xl border px-4 py-2 text-sm bg-white placeholder-gray-400" />
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-secondary">Work Experience</h4>
                          <FieldArray name="experiences">{({ push }) => (
                            <div>
                              <button type="button" onClick={() => push({ company: "", years: "", role: "" })} className="text-sm rounded-full px-3 py-1 border" style={{background: "var(--color-secondary)", color:"white"}}>+ Add</button>
                            </div>
                          )}</FieldArray>
                        </div>
                        <FieldArray name="experiences">{({ remove, push }) => (
                          <div className="space-y-3">
                            {values.experiences && values.experiences.map((exp, idx) => (
                              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                                <div className="md:col-span-5"><Field name={`experiences.${idx}.company`} placeholder="Company name" className="w-full rounded-full border px-4 py-2 text-sm" /></div>
                                <div className="md:col-span-3"><Field name={`experiences.${idx}.role`} placeholder="Role / Title" className="w-full rounded-full border px-4 py-2 text-sm" /></div>
                                <div className="md:col-span-3"><Field name={`experiences.${idx}.years`} placeholder="Years of experience" className="w-full rounded-full border px-4 py-2 text-sm" /></div>
                                <div className="md:col-span-1"><button type="button" onClick={() => remove(idx)} className="text-red-500"><FaTrashAlt /></button></div>
                                <div className="col-span-12"><ErrorMessage name={`experiences.${idx}.company`} component="div" className="text-danger text-xs mt-1" /></div>
                              </div>
                            ))}
                          </div>
                        )}</FieldArray>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-secondary">Education</h4>
                          <FieldArray name="education">{({ push }) => (
                            <div><button type="button" onClick={() => push({ institution: "", degree: "", year: "" })} className="text-sm rounded-full px-3 py-1 border" style={{background: "var(--color-secondary)", color:"white"}}>+ Add</button></div>
                          )}</FieldArray>
                        </div>
                        <FieldArray name="education">{({ remove }) => (
                          <div className="space-y-3">
                            {values.education && values.education.map((ed, idx) => (
                              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                                <div className="md:col-span-5"><Field name={`education.${idx}.institution`} placeholder="Institution" className="w-full rounded-full border px-4 py-2 text-sm" /></div>
                                <div className="md:col-span-3"><Field name={`education.${idx}.degree`} placeholder="Degree / Major" className="w-full rounded-full border px-4 py-2 text-sm" /></div>
                                <div className="md:col-span-3"><Field name={`education.${idx}.year`} placeholder="Graduation Year" className="w-full rounded-full border px-4 py-2 text-sm" /></div>
                                <div className="md:col-span-1"><button type="button" onClick={() => remove(idx)} className="text-red-500"><FaTrashAlt /></button></div>
                              </div>
                            ))}
                          </div>
                        )}</FieldArray>
                      </div>

                    </section>
                  )}
{currentStep === 3 && (
  <section className="max-w-5xl mx-auto bg-white p-10 print:p-6 text-slate-800">
    <div className="grid grid-cols-12 gap-8">
      {/* LEFT COLUMN - narrow sidebar (photo, contacts, awards, skills) */}
      <aside className="col-span-4">
        <div className="flex flex-col items-center">
          {/* circular photo with accent ring */}
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary mb-4">
  {values.photo ? (
    <img
      src={
        typeof values.photo === "string"
          ? values.photo
          : URL.createObjectURL(values.photo)
      }
      alt="Candidate"
      className="w-full h-full object-cover"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
      No photo
    </div>
  )}
</div>


          {/* Contacts block */}
          <div className="w-full">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">Contacts</h3>
            <ul className="mt-3 text-sm text-slate-700 space-y-2">
              <li className="flex items-start gap-2"><span className="font-medium text-slate-500 w-20">Email</span><span>{values.email || "—"}</span></li>
              <li className="flex items-start gap-2"><span className="font-medium text-slate-500 w-20">Phone</span><span>{values.phoneCode} {values.phone || "—"}</span></li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-slate-500 w-20">Location</span>
                <span>
                  {uniqueCountries.find(c => c.countryID == values.location?.country)?.countryName || "—"}
                  {values.location?.city ? `, ${uniqueCities.find(c=>c.cityID==values.location?.city)?.cityName}` : ""}
                </span>
              </li>
              <li className="flex items-start gap-2 justify-center">{<span className="font-medium text-slate-500 w-20">{values?.location?.address || "—"}</span>}</li>
              <li className="flex items-start gap-2"><span className="font-medium text-slate-500 w-20">linkedin</span><a href={values.linkedin || "#"} target="_blanck" className="text-primary underline">{values.linkedin || "—"}</a></li>
              <li className="flex items-start gap-2"><span className="font-medium text-slate-500 w-20">github</span><a href={values.github || "#"} target="_blanck" className="text-primary underline">{values.github || "—"}</a></li>

              <li className="flex items-start gap-2"><span className="font-medium text-slate-500 w-20">CV</span><span>{values.cv ? values.cv.name : "—"}</span></li>
            </ul>
          </div>

          <hr className="my-5 border-slate-200 w-full" />

          {/* Awards (only rendered if data exists) */}
          {values.awards && values.awards.length > 0 && (
            <div className="w-full">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">Awards</h3>
              <ul className="mt-3 text-sm text-slate-700 space-y-3">
                {values.awards.map((a, idx) => (
                  <li key={idx}>
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-slate-500">{a.year || "—"}</div>
                  </li>
                ))}
              </ul>
              <hr className="my-5 border-slate-200 w-full" />
            </div>
          )}

          {/* Skills (visual bars) */}
          {values.skills && values.skills.length > 0 && (
            <div className="w-full">
              <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">Skills</h3>
              <ul className="mt-3 space-y-3">
                {values.skills.map((s, idx) => (
                  <li key={idx} className="text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-700">{s.name}</span>
                      {/* optional numeric indicator if available */}
                      <span className="text-xs text-slate-500">{s.level ? `${s.level}%` : ""}</span>
                    </div>
                    <div className="mt-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: s.level ? `${s.level}%` : "30%" }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      {/* RIGHT COLUMN - main CV content */}
      <main className="col-span-8 border-l border-slate-200 pl-8">
        {/* Name + Title row */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl leading-tight font-extrabold">
              <span className="text-slate-900">{values.firstName || ""} {values.middleName || ""}</span>
              {" "}
              <span className="text-primary">{values.lastName || ""}</span>
            </h1>
            <p className="text-lg text-slate-600 mt-1">
              {values.position ? jobs.find(j => j.jopId == values.position)?.jopName : "—"}
              {" - "}
              {values.department ? departments.find(d => d.departmentId == values.department)?.departmentName : "—"}
            </p>
          </div>

          {/* small contact column on right (optional) */}
          <div className="text-sm text-slate-500">
            <div>{values.email || ""}</div>
            <div className="mt-1">{values.phoneCode} {values.phone || ""}</div>
          </div>
        </div>

        <hr className="my-4 border-slate-200" />

        {/* Profile / Summary */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">Profile</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            {values.cover|| "—" }
          </p>
        </section>

        <hr className="my-4 border-slate-200" />

        {/* Education */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Education</h2>
          <div className="space-y-4 text-sm text-slate-700">
            {values.education && values.education.length > 0 ? (
              values.education.map((ed, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{ed.institution || "—"}</div>
                    <div className="text-xs text-slate-500">{ed.degree || "—"}</div>
                  </div>
                  <div className="text-xs text-slate-500">{ed.year || "—"}</div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">—</div>
            )}
          </div>
        </section>

        <hr className="my-4 border-slate-200" />

        {/* Work Experience */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Work Experience</h2>
          <div className="space-y-6 text-sm text-slate-700">
            {values.experiences && values.experiences.length > 0 ? (
              values.experiences.map((e, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{e.company || "—"}</div>
                      <div className="text-xs text-slate-500">{e.role || "—"}</div>
                    </div>
                    <div className="text-xs text-slate-500">{e.years ? `${e.years} yrs` : "—"}</div>
                  </div>
                  {e.description && <p className="mt-2 text-sm text-slate-600">{e.description}</p>}
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">—</div>
            )}
          </div>
        </section>

        <footer className="mt-10 text-xs text-slate-400">
          SkyCulinaire — Candidate Application
        </footer>
      </main>
    </div>
  </section>
)}



                </div>

                {/* Wizard navigation */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
                  <div className="flex gap-3">
                    {currentStep > 0 && <button type="button" onClick={() => setCurrentStep((s)=>s-1)} className="rounded-full px-5 py-2 border">Back</button>}
                  </div>

                  <div className="flex gap-3">
                    {currentStep < steps.length - 1 && (
                      <button type="button" onClick={async () => {
                        const ok = await validateStepAndProceed(validateForm, values, setTouched);
                        if (ok) setCurrentStep((s)=>s+1);
                      }} className="rounded-full px-5 py-2 text-white font-semibold bg-primary">Next</button>
                    )}

                    {currentStep === steps.length - 1 ? (
                      <button type="submit" disabled={isSubmitting} className={`rounded-full px-5 py-2 text-white font-semibold ${isSubmitting ? "bg-[#B88E5299]" : "bg-primary"}`}>
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </button>
                    ) : null}

                    <button type="button" onClick={() => { setApiError(null); setApiSuccess(null); setSubmitted(null); /* reset form - manual */ window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-full px-5 py-2 border">Reset</button>
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




















    // <section>
    //                   <h3 className="text-sm font-semibold text-secondary mb-3">Review your application</h3>
    //                   <div className="mt-2 bg-white border rounded-lg p-4">
    //                     <ul className="text-sm text-gray space-y-1">
    //                       <li><strong className="text-secondary">Name:</strong> {values.firstName} {values.middleName} {values.lastName}</li>
    //                       <li><strong className="text-secondary">Birth Date:</strong> {values.birthDate || "—"}</li>
    //                       <li><strong className="text-secondary">Gender:</strong> {values.gender || "—"}</li>
    //                       <li><strong className="text-secondary">Email:</strong> {values.email || "—"}</li>
    //                       <li><strong className="text-secondary">Phone:</strong> {values.phoneCode} {values.phone || "—"}</li>
    //                       <li><strong className="text-secondary">Location:</strong> {uniqueCountries.find(c=>c.countryID==values.location?.country)?.countryName || "—"} {values.location?.city ? `, ${uniqueCities.find(c=>c.cityID==values.location?.city)?.cityName}` : ""} {values.location?.area ? ` — ${uniqueAreas.find(a=>a.ariaID==values.location?.area)?.ariaName}` : ""} {values.location?.address ? `, ${values.location.address}` : ""}</li>
    //                       <li><strong className="text-secondary">Department:</strong> {values.department ? departments.find(d=>d.departmentId==values.department)?.departmentName : "—"}</li>
    //                       <li><strong className="text-secondary">Position:</strong> {values.position ? jobs.find(j=>j.jopId==values.position)?.jopName : "—"}</li>
    //                       <li><strong className="text-secondary">CV:</strong> {values.cv ? values.cv.name : "—"}</li>
    //                       <li><strong className="text-secondary">Photo:</strong> {values.photo ? values.photo.name : "—"}</li>
    //                       <li><strong className="text-secondary">Experience:</strong>
    //                         <ul className="pl-4 list-disc mt-1">
    //                           {values.experiences && values.experiences.length>0 ? values.experiences.map((e,i)=>(<li key={i}>{e.company} — {e.role} ({e.years || "—"} yrs)</li>)) : <li>—</li>}
    //                         </ul>
    //                       </li>
    //                       <li><strong className="text-secondary">Education:</strong>
    //                         <ul className="pl-4 list-disc mt-1">
    //                           {values.education && values.education.length>0 ? values.education.map((e,i)=>(<li key={i}>{e.institution} — {e.degree} ({e.year || "—"}</li>)) : <li>—</li>}
    //                         </ul>
    //                       </li>
    //                     </ul>
    //                   </div>
    //                 </section>


























// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Formik, Form, Field, ErrorMessage, FieldArray, useFormikContext } from "formik";
// import * as Yup from "yup";
// import { FaTrashAlt } from "react-icons/fa";
// import { IoIosArrowDown } from "react-icons/io";
// import { GetDepartments, GetDepartment,GetGenders,GetLocations,GetJobs, GetCountries, GetHowDoYouKnow, GetSocials } from "../../assets/apis/applyingJob/ApplyingJobApi";
// import { useQuery } from "@tanstack/react-query";
// import { IoCheckmarkSharp } from "react-icons/io5";
// import { useScreenViewStore } from "../../assets/store/screenViewStore";
// import { uploadToCloudinary } from "../../cloudinary/cloudinary";
// import toast from "react-hot-toast";

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

// const API_URL = "https://apitest.skyculinaire.com/api/CV/CVTransaction/NewEmployee"; 

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
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [selectedCity, setSelectedCity] = useState(null);

//   const [selectedArea, setSelectedArea] = useState(null);
//   const {footerHeight,navBarHeight}=useScreenViewStore();

//   const { data: departments, isLoading: loadingDeps } = useQuery({
//     queryKey: ["departments"],
//     queryFn: GetDepartments,
//   });
//   const { data: jobs, isLoading: loadingJobs } = useQuery({
//     queryKey: ["jobs"],
//     queryFn: GetJobs,
//   });

//     const { data: socials, isLoading: loadingSocials } = useQuery({
//     queryKey: ["socials"],
//     queryFn: GetSocials,
//   });

//   const { data: genders, isLoading: loadingGenders } = useQuery({
//     queryKey: ["genders"],
//     queryFn: GetGenders,
//   });
//     const { data: countries, isLoading: loadingCountries } = useQuery({
//     queryKey: ["countries"],
//     queryFn: GetCountries,
//   });

//       const { data: howDoYouKnew, isLoading: loadingHowDoYouKnew } = useQuery({
//     queryKey: ["howDoYouKnew"],
//     queryFn: GetHowDoYouKnow,
//   });

//   useEffect(() => {
//     console.log("socials",socials);
    
//   }, [socials]);

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
//     middleName: Yup.string().trim().required("Middle name is required"),
//     lastName: Yup.string().trim().required("Last name is required"),
//     birthDate: Yup.date().required("Birth date is required").max(new Date(), "Invalid date"),
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     phoneCode: Yup.string().required("Code"),
//     secondPhoneCode: Yup.string(),
//     phone: Yup.string().trim().required("Phone is required").min(5, "Invalid phone"),
//     secondPhone: Yup.string().trim().min(5, "Invalid phone"),
//     location: Yup.object().shape({
//       country: Yup.string().required("Country is required"),
//       city: Yup.string().trim().required("City is required"),
//       area: Yup.string().trim().required("Area is required"),
//       address: Yup.string().trim().required("Address is required"),
//     }),
//     linkedin: Yup.string().url("Invalid URL"),
//     github: Yup.string().url("Invalid URL"),
//     source: Yup.string(),
//     department: Yup.string().required("Department is required"),
//     position: Yup.string().required("Position is required"),
//     socialStatus: Yup.string().required("Social status is required"),
//     cover: Yup.string(),
//     gender: Yup.string().required("Gender is required"),
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
//     secondPhoneCode: "+20",
//     phone: "",
//     secondPhone: "",
//     socialStatus:"",
//     // location is now an object with 3 parts
//     location: { country: "", city: "", area: "", address: "" },
//     linkedin: "",
//     github: "",
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

// const getUniqueItems = (data, key) => {
//   // تأكد من أننا نعمل على مصفوفة فعلية
//   const arr = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
//   const uniqueItems = [];
//   const seenKeys = new Set();

//   for (const item of arr) {
//     if (!item || !(key in item)) continue; // تجاهل العناصر الغير متوقعة
//     const keyValue = item[key];
//     if (!seenKeys.has(keyValue)) {
//       seenKeys.add(keyValue);
//       uniqueItems.push(item);
//     }
//   }

//   return uniqueItems;
// };


// // تحديثات صغيرة في الحالة/المعالجة
// const handleCountryChange = (value, setFieldValue) => {
//   // استخدم string لأن قيم الـ select عادةً سترسل string
//   const v = value || "";
//   setSelectedCountry(v);
//   setSelectedCity(null);
//   setSelectedArea(null);
//   // امسح حقول المدينة والمنطقة في formik
//   if (setFieldValue) {
//     setFieldValue("location.city", "");
//     setFieldValue("location.area", "");
//   }
// };

// const handleCityChange = (value, setFieldValue) => {
//   const v = value || "";
//   setSelectedCity(v);
//   setSelectedArea(null);
//   if (setFieldValue) {
//     setFieldValue("location.area", "");
//   }
// };


//   const countriesArray = Array.isArray(countries) ? countries : (countries && Array.isArray(countries.data) ? countries.data : []);

// const uniqueCountries = useMemo(() => {
//   return getUniqueItems(countriesArray, "countryID");
// }, [countries]);

// const uniqueCities = useMemo(() => {
//   if (!selectedCountry) return [];
//   return getUniqueItems(
//     countries.filter(
//       (item) => item.countryID === Number(selectedCountry)
//     ),
//     "cityID"
//   );
// }, [countries, selectedCountry]);


// const uniqueAreas = useMemo(() => {
//   return getUniqueItems(
//     countriesArray.filter((item) => item.countryID == selectedCountry && item.cityID == selectedCity),
//     "ariaID"
//   );
// }, [countries, selectedCountry, selectedCity]);

// function SubmitWatcher() {
//   const { submitCount, errors } = useFormikContext();
//   const shownRef = useRef(0);

//   useEffect(() => {
//     // لو في محاولة إرسال وفي أخطاء، نعرض toast مرة وحدة لكل submitCount
//     if (submitCount > 0 && Object.keys(errors || {}).length > 0) {
//       if (shownRef.current !== submitCount) {
//         toast.error("Please fill all required fields correctly");
//         shownRef.current = submitCount;
//       }
//     }
//   }, [submitCount, errors]);

//   return null;
// }
// useEffect(()=>{
//   console.log("navBar :" , navBarHeight,"footer:",footerHeight);
  
// },navBarHeight,footerHeight)



// if(apiSuccess) return (
//   <div className="flex flex-col items-center justify-center gap-1 text-center" style={{
//   height: `calc( 100vh - ${(navBarHeight + footerHeight)}px)`
// }}>
//     <IoCheckmarkSharp className="text-[300px] text-green-500"/>
//     <p className="text-3xl font-bold">Thank You!</p>
//     <p className="sm:text-2xl text-xl">Your application was successfully submitted</p>
//     <p className="text-xl text-gray-600">We will contact you soon</p>
//   </div>
// )

//   return (
//     <div className="min-h-screen flex items-start justify-center p-6 bg-gradient-to-b from-white to-gray-50 pt-26">
//       <div className="w-full max-w-5xl">
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={async (values, actions) => {
//             setApiError(null);
//             setApiSuccess(null);

//             const personalImage=values.photo?await uploadToCloudinary(values.photo):"";
//             const cv=values.cv?await uploadToCloudinary(values.cv):"";
//             console.log(personalImage,cv);
            

//             // build FormData
//             try {
//               const res = await fetch(API_URL, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "*/*",
//   },
//   body: JSON.stringify({
//     personalId: 0,
//     // personalName: `${values.firstName} ${values.middleName} ${values.lastName}`,
//     PersonalCvFirstName : values.firstName,
//     PersonalCvMedilName  : values.middleName,
//     PersonalCvLastName : values.lastName,
//     personalDepartmentId: Number(values.department),
//     personalJopId: Number(values.position),
//     personalBerthDate: values.birthDate,
//     personalMoble: `${values.secondPhoneCode} ${values.secondPhone}`,
//     personalPhone: `${values.phoneCode} ${values.phone}`,
//     personalMail: values.email,
//     personalCountryId: Number(values.location.country),
//     personalCityId: Number(values.location.city),
//     // personalCityName: uniqueCities.find(item => item.cityID === Number(values.location.city))?.cityName,
//     personalCityAreaId: Number(values.location.area),
//     personalStreet: values.location.address,
//     personalGenderId: Number(values.gender),
//     personalCvLinkedInProfile: values.linkedin,
//     personalCvGithubProfile: values.github,
//     personalCvCoverNote: values.cover,
//     personalCvHowNowAboutUsId: Number(values.source),
//     personalSocialId: Number(values.socialStatus),
//     personalCvUploadPickt:personalImage,
//     personalCvUploadCV: cv,
//     personalCvsWorkExperiences: values.experiences?.map(e => ({
//       personalCvsWorkExperienceCompanyName: e.company,
//       personalCvsWorkExperienceRole: e.role,
//       personalCvsWorkExperienceYear: Number(e.years),
//     })) || [],
//     peronalCvsEducations: values.education?.map(e => ({
//       peronalCvEducationInstitution: e.institution,
//       peronalCvEducationDegree: Number(e.degree),
//       peronalCvEducationGraduationYear: Number(e.year),
//     })) || [],
//   }),
// });


//               const data = await res.json().catch(() => null);

//               if (res.ok) {
//                 // show thank you message
//                 setApiSuccess(true);

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
//                 toast.error("something went wrong");
//               }
//             } catch (err) {
//               setApiError(err.message || "Network error");
//               toast.error("something went wrong");
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
//             <>
//             <SubmitWatcher/>
//             <Form className="bg-white border rounded-2xl py-6 md:px-6 px-2 shadow-sm border-light-gray">
//               <h2 className="text-xl font-semibold text-secondary">
//                 Job Application
//               </h2>
//               <p className="text-sm text-gray mt-1">
//                 Complete the form and upload your CV
//               </p>

//               {/* show API messages */}
//               {/* {apiError && (
//                 <div className="mt-4 p-3 rounded-md bg-rose-50 text-danger border border-rose-100">
//                   {apiError}
//                 </div>
//               )}

//               {apiSuccess && (
//                 <div className="mt-4 p-3 rounded-md bg-green-50 text-green-700 border border-green-100">
//                   {apiSuccess}
//                 </div>
//               )} */}

//               {/* Personal Data card */}
//               <section className="mt-6  rounded-xl">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div className="bg-light-gray p-4 rounded-lg flex flex-col gap-2.5 ">
//                     <h3 className="text-sm font-semibold text-secondary mb-3">
//                       Personal Data
//                     </h3>
//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         First Name{" "}
//                         <span className="ms-1 font-semibold text-danger">(required)</span>
//                       </label>
//                       <Field
//                         name="firstName"
//                         placeholder="First"
//                         className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.12)] focus:border-primary ${
//                           errors.firstName && touched.firstName
//                             ? "border-danger"
//                             : "border-gray-200"
//                         }`}
//                       />
//                       <ErrorMessage
//                         name="firstName"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         Middle Name
//                         <span className="ms-1 font-semibold text-danger">(required)</span>
//                       </label>
//                       <Field
//                         name="middleName"
//                         placeholder="Middle"
//                         className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary ${
//                           errors.middleName && touched.middleName
//                             ? "border-danger"
//                             : "border-gray-200"
//                         }`}
//                       />
//                       <ErrorMessage
//                         name="middleName"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         Last Name{" "}
//                         <span className="ms-1 font-semibold text-danger">(required)</span>
//                       </label>
//                       <Field
//                         name="lastName"
//                         placeholder="Last"
//                         className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.12)] focus:border-primary ${
//                           errors.lastName && touched.lastName
//                             ? "border-danger"
//                             : "border-gray-200"
//                         }`}
//                       />
//                       <ErrorMessage
//                         name="lastName"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         Birth Date
//                         <span className="ms-1 font-semibold text-danger">(required)</span>
//                       </label>
//                       <div className="relative">
//                         <Field
//                           name="birthDate"
//                           type="date"
//                           className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.12)] focus:border-primary ${
//                             errors.birthDate && touched.birthDate
//                               ? "border-danger"
//                               : "border-gray-200"
//                           }`}
//                         />
//                         <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray">
//                           <svg
//                             width="18"
//                             height="18"
//                             viewBox="0 0 24 24"
//                             fill="none"
//                             xmlns="http://www.w3.org/2000/svg"
//                           >
//                             <path
//                               d="M7 10H9"
//                               stroke="currentColor"
//                               strokeWidth="1.5"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                             <path
//                               d="M15 10H15.01"
//                               stroke="currentColor"
//                               strokeWidth="1.5"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                             <path
//                               d="M21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7"
//                               stroke="currentColor"
//                               strokeWidth="1.5"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                             <path
//                               d="M16 3V7"
//                               stroke="currentColor"
//                               strokeWidth="1.5"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                             <path
//                               d="M8 3V7"
//                               stroke="currentColor"
//                               strokeWidth="1.5"
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                             />
//                           </svg>
//                         </div>
//                       </div>
//                       <ErrorMessage
//                         name="birthDate"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>

//                     {/* Row: First Name + Middle Name (inline two fields) */}
//                     {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">

//                 </div> */}

//                     {/* Row: Last Name + Birth Date */}
//                     {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">



//                 </div> */}

//                     {/* Photo + Gender (photo left small, gender right) */}
//                     {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center"> */}

//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         Gender
//                         <span className="ms-1 font-semibold text-danger">(required)</span>
//                       </label>
//                       <div className="relative">
//                         <Field
//                           as="select"
//                           name="gender"
//                           className={`w-full appearance-none rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary ${
//                           errors.gender && touched.gender
//                             ? "border-danger"
//                             : "border-gray-200"
//                         }`}
//                         >
//                           <option value="">Select Gender</option>
//                           {genders &&
//                             genders.length > 0 &&
//                             genders.map((gender) => (
//                               <option
//                                 className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                                 value={gender.personalGenderId}
//                               >
//                                 {gender?.personalGenderName}
//                               </option>
//                             ))}
//                         </Field>
//                         <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
//                           <IoIosArrowDown />
//                         </span>
//                       </div>
//                       <ErrorMessage
//                         name="gender"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         Social status
//                         <span className="ms-1 font-semibold text-danger">(required)</span>
//                       </label>
//                       <div className="relative">
//                         <Field
//                           as="select"
//                           name="socialStatus"
//                           className={`w-full appearance-none rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary ${
//                           errors.socialStatus && touched.socialStatus
//                             ? "border-danger"
//                             : "border-gray-200"
//                         }`}
//                         >
//                           <option value="">Select Social Status</option>
//                           {socials &&
//                             socials.length > 0 &&
//                             socials.map((social) => (
//                               <option
//                                 className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                                 value={social.personalSocialId}
//                               >
//                                 {social?.personalSocialName}
//                               </option>
//                             ))}
//                         </Field>
//                         <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
//                           <IoIosArrowDown />
//                         </span>
//                       </div>
//                       <ErrorMessage
//                         name="socialStatus"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         Photo
//                       </label>
//                       <div
//                         onClick={() => photoRef.current?.click()}
//                         className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm flex items-center justify-between bg-white cursor-pointer"
//                       >
//                         <span className="text-gray">
//                           {values.photo ? values.photo.name : "Upload photo"}
//                         </span>
//                         <svg
//                           width="18"
//                           height="18"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="text-gray"
//                         >
//                           <path
//                             d="M12 16V8"
//                             stroke="currentColor"
//                             strokeWidth="1.5"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                           <path
//                             d="M8 12L12 8L16 12"
//                             stroke="currentColor"
//                             strokeWidth="1.5"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                           <path
//                             d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15"
//                             stroke="currentColor"
//                             strokeWidth="1.5"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           />
//                         </svg>
//                       </div>
//                       <input
//                         ref={photoRef}
//                         type="file"
//                         accept="image/*"
//                         className="hidden"
//                         onChange={(e) =>
//                           setFieldValue(
//                             "photo",
//                             e.currentTarget.files?.[0] || null
//                           )
//                         }
//                       />
//                       <ErrorMessage
//                         name="photo"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>
//                   </div>

//                   <div className="bg-light-gray p-4 rounded-lg flex flex-col gap-2.5">
//                     <h3 className="text-sm font-semibold text-secondary mb-3">
//                       Address Information
//                     </h3>
//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         Country{" "}
//                         <span className="ms-1 font-semibold text-danger">(required)</span>
//                       </label>
//                       <div className="relative">
//                         <Field
//                           as="select"
//                           name="location.country"
//                           className={`w-full rounded-full border px-4 py-2 pr-10 text-sm bg-white
//                       focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
//                       focus:border-primary  appearance-none ${
//                         errors.location?.country && touched.location?.country
//                           ? "border-danger"
//                           : "border-gray-200"
//                       }`}
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             handleCountryChange(value, setFieldValue);
//                             setFieldValue("location.country", value);
//                           }}
//                         >
//                           <option value="">Select country</option>
//                           {uniqueCountries &&
//                             uniqueCountries.map((c) => (
//                               <option
//                                 className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                                 key={c.countryID}
//                                 value={c.countryID}
//                               >
//                                 {c.countryName}
//                               </option>
//                             ))}
//                         </Field>
//                         <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
//                           <IoIosArrowDown />
//                         </span>
//                       </div>
//                       <ErrorMessage
//                         name="location.country"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         City{" "}
//                         <span className="ms-1 font-semibold text-danger">(required)</span>
//                       </label>
//                       <div className="relative">
//                         <Field
//                           as="select"
//                           name="location.city"
//                           disabled={!selectedCountry}
//                           className={`w-full rounded-full border px-4 py-2 pr-10 text-sm ${
//                             selectedCountry ? "bg-white" : "bg-gray-200"
//                           } 
//                       focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
//                       focus:border-primary  appearance-none ${
//                         errors.location?.city && touched.location?.city
//                           ? "border-danger"
//                           : "border-gray-200"
//                       }`}
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             handleCityChange(value, setFieldValue);
//                             setFieldValue("location.city", value);
//                           }}
//                         >
//                           <option value="">Select city</option>
//                           {uniqueCities &&
//                             uniqueCities.map((c) => (
//                               <option
//                                 className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                                 key={c.cityID}
//                                 value={c.cityID}
//                               >
//                                 {c.cityName}
//                               </option>
//                             ))}
//                         </Field>
//                         <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
//                           <IoIosArrowDown />
//                         </span>
//                       </div>
//                       <ErrorMessage
//                         name="location.city"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         Area / District{" "}
//                         <span className="ms-1 font-semibold text-danger">(required)</span>
//                       </label>
//                       <div className="relative">
//                         <Field
//                           as="select"
//                           name="location.area"
//                           disabled={!selectedCountry || !selectedCity}
//                           className={`w-full rounded-full border px-4 py-2 pr-10 text-sm ${
//                             !selectedCountry || !selectedCity
//                               ? "bg-gray-200"
//                               : "bg-white"
//                           } 
//                       focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
//                       focus:border-primary  appearance-none ${
//                         errors.location?.area && touched.location?.area
//                           ? "border-danger"
//                           : "border-gray-200"
//                       }`}
//                         >
//                           <option value="">Select area</option>
//                           {uniqueAreas &&
//                             uniqueAreas.map((a) => (
//                               <option
//                                 className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                                 key={a.ariaID}
//                                 value={a.ariaID}
//                               >
//                                 {a.ariaName}
//                               </option>
//                             ))}
//                         </Field>
//                         <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
//                           <IoIosArrowDown />
//                         </span>
//                       </div>
//                       <ErrorMessage
//                         name="location.area"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         Address{" "}
//                         <span className="ms-1 font-semibold text-danger">(required)</span>
//                       </label>
//                       <Field
//                         name="location.address"
//                         placeholder="address"
//                         className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.12)] focus:border-primary ${
//                           errors.location?.address && touched.location?.address
//                             ? "border-danger"
//                             : "border-gray-200"
//                         }`}
//                       />
//                       <ErrorMessage
//                         name="location.address"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>
//                   </div>

//                   <div className="bg-light-gray p-4 rounded-lg flex flex-col gap-2.5">
//                     <h3 className="text-sm font-semibold text-secondary mb-3">
//                       Contact Info
//                     </h3>
//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         Email{" "}
//                         <span className="ms-1 font-semibold text-danger">(required)</span>
//                       </label>
//                       <Field
//                         name="email"
//                         type="email"
//                         placeholder="you@domain.com"
//                         className={`w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.12)] focus:border-primary ${
//                           errors.email && touched.email
//                             ? "border-danger"
//                             : "border-gray-200"
//                         }`}
//                       />
//                       <ErrorMessage
//                         name="email"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         Phone{" "}
//                         <span className="ms-1 font-semibold text-danger">(required)</span>
//                       </label>
//                       <div
//                         className={`flex items-center w-full rounded-full border bg-white overflow-hidden
//       focus-within:ring-2 focus-within:ring-[rgba(184,142,82,0.12)]
//       ${errors.phone && touched.phone ? "border-danger" : "border-gray-200"}`}
//                       >
//                         {/* Country code */}
//                         <Field
//                           as="select"
//                           name="phoneCode"
//                           className="h-full bg-transparent px-3 py-2 text-sm text-secondary border-r border-gray-200 focus:outline-none"
//                         >
//                           {COUNTRY_CODES.map((c) => (
//                             <option
//                               className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white justify-between"
//                               key={c.code}
//                               value={c.code}
//                             >
//                               {window.innerWidth >500 && <span>{c.label}</span>}
//                               <span>{c.code}</span>
//                             </option>
//                           ))}
//                         </Field>

//                         {/* Phone number */}
//                         <Field
//                           name="phone"
//                           placeholder="xxx xxx xxxx"
//                           className="flex-1 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
//                         />
//                       </div>

//                       <ErrorMessage
//                         name="phone"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         Second Phone{" "}
//                       </label>
//                       <div
//                         className={`flex items-center w-full rounded-full border bg-white overflow-hidden
//       focus-within:ring-2 focus-within:ring-[rgba(184,142,82,0.12)]
//       ${errors.secondPhone && touched.secondPhone ? "border-danger" : "border-gray-200"}`}
//                       >
//                         {/* Country code */}
//                         <Field
//                           as="select"
//                           name="secondPhoneCode"
//                           className="h-full bg-transparent px-3 py-2 text-sm text-secondary border-r border-gray-200 focus:outline-none"
//                         >
//                           {COUNTRY_CODES.map((c) => (
//                             <option
//                               className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white justify-between"
//                               key={c.code}
//                               value={c.code}
//                             >
// {window.innerWidth > 500 && <span>{c.label}</span>}
//                               <span>{c.code}</span>
//                             </option>
//                           ))}
//                         </Field>

//                         {/* Phone number */}
//                         <Field
//                           name="secondPhone"
//                           placeholder="xxx xxx xxxx"
//                           className="flex-1 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
//                         />
//                       </div>

//                       <ErrorMessage
//                         name="secondPhone"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         LinkedIn Profile
//                       </label>
//                       <Field
//                         name="linkedin"
//                         placeholder="https://linkedin.com/in/you"
//                         className="w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary border-gray-200"
//                       />
//                       <ErrorMessage
//                         name="linkedin"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         Github Profile
//                       </label>
//                       <Field
//                         name="github"
//                         placeholder="https://github.com/you"
//                         className="w-full rounded-full border px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)] focus:border-primary border-gray-200"
//                       />
//                       <ErrorMessage
//                         name="github"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>
//                   </div>

//                   <div className="bg-light-gray p-4 rounded-lg flex flex-col gap-2.5">
//                     <h3 className="text-sm font-semibold text-secondary mb-3">
//                       Application Details
//                     </h3>

//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         How did you hear about us?
//                       </label>
//                       <div className="relative">
//                         <Field
//                           as="select"
//                           name="source"
//                           className="w-full rounded-full border px-4 py-2 pr-10 text-sm bg-white
//                       focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
//                       focus:border-primary border-gray-200 appearance-none"
//                         >
//                           <option
//                             className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                             value=""
//                           >
//                             Select...
//                           </option>
//                           {howDoYouKnew && howDoYouKnew.map((item) => (
//                             <option
//                             className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                             value={item?.personalHowNowAboutUsId}
//                           >
//                             {item?.personalHowNowAboutUsName}
//                           </option>
//                           ))}
//                         </Field>
//                         <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
//                           <IoIosArrowDown />
//                         </span>
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         Department{" "}
//                         <span className="ms-1 font-semibold text-danger">(required)</span>
//                       </label>
//                       <div className="relative">
//                         <Field
//                           as="select"
//                           name="department"
//                           className={`w-full rounded-full border px-4 py-2 pr-10 text-sm bg-white
//                         focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
//                         focus:border-primary appearance-none ${
//                           errors.department && touched.department
//                             ? "border-danger"
//                             : "border-gray-200"
//                         }`}
//                         >
//                           <option
//                             className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                             value=""
//                           >
//                             Select department
//                           </option>
//                           {departments &&
//                             departments.length > 0 &&
//                             departments.map((dept) => (
//                               <option
//                                 className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                                 value={dept.departmentId}
//                               >
//                                 {dept?.departmentName}
//                               </option>
//                             ))}
//                         </Field>
//                         <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
//                           <IoIosArrowDown />
//                         </span>
//                       </div>
//                       <ErrorMessage
//                         name="department"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-secondary text-sm mb-1">
//                         Position Applying For{" "}
//                         <span className="ms-1 font-semibold text-danger">(required)</span>
//                       </label>
//                       <div className="relative">
//                         <Field
//                           as="select"
//                           name="position"
//                           className={`w-full rounded-full border px-4 py-2 pr-10 text-sm bg-white
//                         focus:outline-none focus:ring-2 focus:ring-[rgba(184,142,82,0.06)]
//                         focus:border-primary appearance-none ${
//                           errors.position && touched.position
//                             ? "border-danger"
//                             : "border-gray-200"
//                         }`}
//                         >
//                           <option
//                             className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                             value=""
//                           >
//                             Select position
//                           </option>
//                           {jobs &&
//                             jobs.length > 0 &&
//                             jobs.map((jop) => (
//                               <option
//                                 className="checked:bg-primary checked:text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white active:bg-primary active:text-white"
//                                 value={jop.jopId}
//                               >
//                                 {jop?.jopName}
//                               </option>
//                             ))}
//                         </Field>
//                         <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black">
//                           <IoIosArrowDown />
//                         </span>
//                       </div>
//                       <ErrorMessage
//                         name="position"
//                         component="div"
//                         className="text-danger text-xs mt-1"
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 {/* </div> */}
//               </section>

//               {/* Contact & Job details */}
//               <section className="mt-6 bg-light-gray rounded-xl p-4">
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
//                 <div className="mb-12">
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="text-sm font-semibold text-secondary">
//                       Work Experience
//                     </h4>
//                     <FieldArray name="experiences">
//                       {({ push, remove }) => (
//                         <div
//                           className={`${
//                             values.experiences.length == 3 ? "hidden" : ""
//                           } `}
//                         >
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
//                               <div className="text-xs flex justify-between grid-cols-12 mt-5 mb-2">
//                                 <h4 className="">Experience No {idx + 1}</h4>
//                                 <button
//                                   type="button"
//                                   onClick={() => remove(idx)}
//                                   className="text-sm text-red-500 md:hidden"
//                                 >
//                                   <FaTrashAlt />
//                                 </button>
//                               </div>
//                               <div
//                                 key={idx}
//                                 className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center "
//                               >
//                                 <div className="md:col-span-5">
//                                   <Field
//                                     name={`experiences.${idx}.company`}
//                                     placeholder="Company name"
//                                     className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
//                                   />
//                                   <ErrorMessage
//                                     name={`experiences.${idx}.company`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 md:hidden"
//                                   />
//                                 </div>

//                                 <div className="md:col-span-3">
//                                   <Field
//                                     name={`experiences.${idx}.role`}
//                                     placeholder="Role / Title"
//                                     className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
//                                   />
//                                   <ErrorMessage
//                                     name={`experiences.${idx}.role`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 md:hidden"
//                                   />
//                                 </div>
//                                 <div className="md:col-span-3">
//                                   <Field
//                                     name={`experiences.${idx}.years`}
//                                     placeholder="Years of experience"
//                                     className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
//                                   />
//                                   <ErrorMessage
//                                     name={`experiences.${idx}.years`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 md:hidden"
//                                   />
//                                 </div>

//                                 <div className="md:col-span-1 md:flex justify-end hidden">
//                                   <button
//                                     type="button"
//                                     onClick={() => remove(idx)}
//                                     className="text-sm text-red-500"
//                                   >
//                                     <FaTrashAlt />
//                                   </button>
//                                 </div>
//                               </div>
//                               <div className="hidden md:grid md:grid-cols-12 gap-3 items-center ">
//                                 <div className="col-span-5">
//                                   <ErrorMessage
//                                     name={`experiences.${idx}.company`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 "
//                                   />
//                                 </div>
//                                 <div className="col-span-3">
//                                   <ErrorMessage
//                                     name={`experiences.${idx}.role`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 "
//                                   />
//                                 </div>
//                                 <div className="col-span-3">
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
//                 <div className="mb-12">
//                   <div className="flex items-center justify-between mb-2">
//                     <h4 className="text-sm font-semibold text-secondary">
//                       Education
//                     </h4>
//                     <FieldArray name="education">
//                       {({ push }) => (
//                         <div
//                           className={`${
//                             values.education.length == 3 ? "hidden" : ""
//                           } `}
//                         >
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
//                               <div className="text-xs flex justify-between grid-cols-12 mt-5 mb-2">
//                                 <h4 className="">Education No {idx + 1}</h4>
//                                 <button
//                                   type="button"
//                                   onClick={() => remove(idx)}
//                                   className="text-sm text-red-500 md:hidden"
//                                 >
//                                   <FaTrashAlt />
//                                 </button>
//                               </div>
//                               <div
//                                 key={idx}
//                                 className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
//                               >
//                                 <div className="md:col-span-5">
//                                   <Field
//                                     name={`education.${idx}.institution`}
//                                     placeholder="Institution"
//                                     className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
//                                   />
//                                   <ErrorMessage
//                                     name={`education.${idx}.institution`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 md:hidden"
//                                   />
//                                 </div>

//                                 <div className="md:col-span-3">
//                                   <Field
//                                     name={`education.${idx}.degree`}
//                                     placeholder="Degree / Major"
//                                     className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
//                                   />
//                                   <ErrorMessage
//                                     name={`education.${idx}.degree`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 md:hidden"
//                                   />
//                                 </div>

//                                 <div className="md:col-span-3">
//                                   <Field
//                                     name={`education.${idx}.year`}
//                                     placeholder="Graduation Year"
//                                     className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
//                                   />
//                                   <ErrorMessage
//                                     name={`education.${idx}.year`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 md:hidden"
//                                   />
//                                 </div>

//                                 <div className="md:col-span-1 md:flex justify-end hidden">
//                                   <button
//                                     type="button"
//                                     onClick={() => remove(idx)}
//                                     className="text-sm text-red-500"
//                                   >
//                                     <FaTrashAlt />
//                                   </button>
//                                 </div>
//                               </div>
//                               <div className="hidden md:grid md:grid-cols-12 gap-3 items-center">
//                                 <div className="col-span-5">
//                                   <ErrorMessage
//                                     name={`education.${idx}.institution`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 "
//                                   />
//                                 </div>
//                                 <div className="col-span-3">
//                                   <ErrorMessage
//                                     name={`education.${idx}.degree`}
//                                     component="div"
//                                     className="text-danger text-xs mt-1 "
//                                   />
//                                 </div>
//                                 <div className="col-span-3">
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
//               <div className="mt-6 flex flex-col sm:flex-row gap-3">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className={`rounded-full px-5 py-2 text-white font-semibold ${isSubmitting?"bg-[#B88E5299] pointer-events-none":"bg-primary"}`}
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
//                   className="rounded-full px-5 py-2 border "
//                 >
//                   Reset
//                 </button>
//               </div>

//               {/* Live Application Summary - updates on every field change */}
//               <div className="mt-8">
//                 <h3 className="text-sm font-semibold text-secondary">
//                   Live Application Preview
//                 </h3>
//                 <div className="mt-2 bg-white border rounded-lg p-4">
//                   <ul className="text-sm text-gray space-y-1">
//                     <li>
//                       <strong className="text-secondary">Name:</strong>{" "}
//                       {values.firstName}{" "}
//                       {values.middleName ? values.middleName + " " : ""}
//                       {values.lastName}
//                     </li>
//                       <li>
//                       <strong className="text-secondary">Birth Date:</strong>{" "}
//                       {values.birthDate || "—"}
//                     </li>
//                       <li>
//                       <strong className="text-secondary">Gender:</strong>{" "}
//                       {values.gender ? genders.find((g) => g.personalGenderId == values.gender)?.personalGenderName : "—"}
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
//                       <strong className="text-secondary">Second Phone:</strong>{" "}
//                       {values.secondPhoneCode} {values.secondPhone || "—"}
//                     </li>
//                     <li>
//                       <strong className="text-secondary">Linked in:</strong>{" "}
//                       {values.linkedin || "—"}
//                     </li>
//                     <li>
//                       <strong className="text-secondary">GitHub:</strong>{" "}
//                       {values.github || "—"}
//                     </li>


//                     <li>
//                       <strong className="text-secondary">Location:</strong>{" "}
//                       {uniqueCountries.find(
//                         (c) => c.countryID == values.location?.country
//                       )?.countryName || "—"}
//                       {values.location?.city ? `, ${uniqueCities.find((c) => c.cityID == values.location?.city)?.cityName}` : ""}
//                       {values.location?.area
//                         ? ` — ${uniqueAreas.find((a) => a.ariaID == values.location?.area)?.ariaName}`
//                         : ""}
//                         {values.location?.address ? `, ${values.location?.address}` : ""}
//                     </li>
//                     <li>
//                       <strong className="text-secondary">Department:</strong>{" "}
//                       {values.department ? departments.find((d) => d.departmentId == values.department)?.departmentName : "—"}
//                     </li>
//                     <li>
//                       <strong className="text-secondary">Position:</strong>{" "}
//                       {values.position ? jobs.find((j) => j.jopId == values.position)?.jopName : "—"}
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
//                     <li>
//                       <strong className="text-secondary">Cover Note / Additional Information:</strong>{" "}
//                       {values.cover || "—"}
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </Form>
//             </>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// }