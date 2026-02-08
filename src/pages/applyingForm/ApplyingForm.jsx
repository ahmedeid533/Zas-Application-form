




// // ApplyingFormMultiFormik.jsx  (replace the big single Formik with this file)
// import React, { useState } from "react";
// // import StepPersonal from "./StepPersonal";
// // import StepContact from "./StepContact";
// // import StepJobDetails from "./StepJobDetails";
// // import StepReview from "./StepReview";
// import toast from "react-hot-toast";
// import StepPersonal from "./StepPersonal";
// import StepContact from "./StepContact";
// import StepJobDetails from "./StepJobDetails";
// import StepReview from "./StepReview";

// export default function ApplyingFormMultiFormik(props) {
//   // reuse your existing initialValues from file
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
//     socialStatus: "",
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
//     experiences: [],
//     education: []
//   };

//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState(initialValues);
//   const steps = ["Personal", "Contact & Address", "Job Details", "Review & Submit"];

//   const next = (stepValues) => {
//     // merge partial step values into global formData
//     setFormData((prev) => ({ ...prev, ...stepValues }));
//     setCurrentStep((s) => s + 1);
//   };

//   const back = (partialFromStep) => {
//     if (partialFromStep) setFormData((prev) => ({ ...prev, ...partialFromStep }));
//     setCurrentStep((s) => Math.max(0, s - 1));
//   };

//   const submitAll = async (finalStepValues) => {
//     // merge final step values first
//     const values = { ...formData, ...finalStepValues };

//     try {
//       // Upload files (photo, cv, certificates) as you did before
//       const personalImage = values.photo ? await uploadToCloudinary(values.photo) : "";
//       const cvUpload = values.cv ? await uploadToCloudinary(values.cv) : "";

//       // education certificates (if any) — preserve ordering
//       const certificates = await Promise.all(
//         (values.education || []).map((edu) =>
//           edu.certificate ? uploadToCloudinary(edu.certificate) : ""
//         )
//       );

//       // build payload (adapt to your API shape)
//       const payload = {
//         personalId: 0,
//         PersonalCvFirstName: values.firstName,
//         PersonalCvMedilName: values.middleName,
//         PersonalCvLastName: values.lastName,
//         personalDepartmentId: Number(values.department || 0),
//         personalJopId: Number(values.position || 0),
//         personalBerthDate: values.birthDate,
//         personalMoble: `${values.secondPhoneCode} ${values.secondPhone}`,
//         personalPhone: `${values.phoneCode} ${values.phone}`,
//         personalMail: values.email,
//         personalCountryId: Number(values.location.country || 0),
//         personalCityId: Number(values.location.city || 0),
//         personalCityAreaId: Number(values.location.area || 0),
//         personalStreet: values.location.address,
//         personalGenderId: Number(values.gender || 0),
//         personalCvLinkedInProfile: values.linkedin,
//         personalCvGithubProfile: values.github,
//         personalCvCoverNote: values.cover,
//         personalCvHowNowAboutUsId: Number(values.source || 0),
//         personalSocialId: Number(values.socialStatus || 0),
//         personalCvUploadPickt: personalImage,
//         personalCvUploadCV: cvUpload,
//         personalCvsWorkExperiences:
//           (values.experiences || []).map((e) => ({
//             personalCvsWorkExperienceCompanyName: e.company,
//             personalCvsWorkExperienceRole: e.role,
//             personalCvsWorkExperienceYear: Number(e.years || 0)
//           })) || [],
//         peronalCvsEducations:
//           (values.education || []).map((e, i) => ({
//             peronalCvEducationInstitution: e.institution,
//             peronalCvEducationDegree: Number(e.degree || 0),
//             peronalCvEducationGraduationYear: Number(e.year || 0),
//             PeronalCvEducationFileLink: certificates[i] || ""
//           })) || []
//       };

//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Accept: "*/*" },
//         body: JSON.stringify(payload)
//       });

//       if (!res.ok) {
//         const data = await res.json().catch(() => null);
//         throw new Error((data && data.message) || `Submission failed (status ${res.status})`);
//       }

//       toast.success("Application submitted!");
//       setFormData(initialValues);
//       setCurrentStep(0);
//     } catch (err) {
//       toast.error(err.message || "Submission failed");
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <div className="steps-indicator">{/* your tabs/buttons – use currentStep */}</div>

//       {currentStep === 0 && (
//         <StepPersonal initialValues={formData} onNext={next} />
//       )}

//       {currentStep === 1 && (
//         <StepContact initialValues={formData} onNext={next} onBack={back} />
//       )}

//       {currentStep === 2 && (
//         <StepJobDetails initialValues={formData} onNext={next} onBack={back} />
//       )}

//       {currentStep === 3 && (
//         <StepReview initialValues={formData} onBack={back} onSubmit={submitAll} />
//       )}
//     </div>
//   );
// }









































































// ApplyingForm.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { nanoid } from "nanoid";
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker using CDN (fixes production bundle issues)
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@5.4.530/build/pdf.worker.min.mjs';

/**
 * Updated ApplyingForm.jsx
 * - CV upload moved to the start of Step 0 and triggers autofill on selection
 * - Prevent jumping forward via top tabs unless previous steps valid
 * - Improved autofill: email, phone (tolerant), name, linkedin, github, address
 * - CV remains optional
 */

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = `${VITE_API_BASE_URL}/api/CV/CVTransaction/NewEmployee`;

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
  const [gapPopup, setGapPopup] = useState(false);
  const [serial, setSerial] = useState(null);
  const [searchParams] = useSearchParams();

  // Decode parameters safely
  const decodedParams = useMemo(() => {
    const d = searchParams.get("d");
    const j = searchParams.get("j");
    let deptId = 0;
    let jobId = 0;

    if (d) {
      try {
        deptId = Number(atob(d));
      } catch (e) {
        console.error("Failed to decode department ID", e);
      }
    }
    if (j) {
      try {
        jobId = Number(atob(j));
      } catch (e) {
        console.error("Failed to decode job ID", e);
      }
    }
    return { deptId, jobId };
  }, [searchParams]);

  const [departmentId, setDepartmentId] = useState(decodedParams.deptId || 0);

  const { data: departments } = useQuery({ queryKey: ["departments"], queryFn:GetDepartments });
	const { data: jobs } = useQuery({ queryKey: ["jobs", 0], queryFn: () => GetJobs(0) }); //departmentId
  const { data: socials } = useQuery({ queryKey: ["socials"], queryFn: GetSocials });
  const { data: genders } = useQuery({ queryKey: ["genders"], queryFn: GetGenders });
  const { data: countries } = useQuery({ queryKey: ["countries"], queryFn: GetCountries });
  const { data: howDoYouKnew } = useQuery({ queryKey: ["howDoYouKnew"], queryFn: GetHowDoYouKnow });

   useEffect(() => {
    window.scrollTo(0, 0);
  },[])
  useEffect(() => {
    console.log("departmentId",departmentId);
    
  },[departmentId])

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
		years: Yup.number().typeError("Must be a number").min(0, "Invalid years").max(new Date().getFullYear(), "Invalid year").required("Years required"),
    role: Yup.string().trim().required("Role is required"),
  });
  const educationSchema = Yup.object().shape({
    institution: Yup.string().trim().required("Institution is required"),
    degree: Yup.string().trim().required("Degree is required"),
		year: Yup.number().typeError("Must be a year").min(1900, "Invalid year").max(new Date().getFullYear() + 5, "Invalid year").required("Year required"),
    certificate:Yup.mixed()
      .required("Certificate is required")
      
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
    phone: Yup.string().trim().required("Phone is required").matches(/^[0-9]{7,15}$/, "Invalid phone"),
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

	const initialValues = useMemo(() => ({
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
    location: { country: "", city: "", area: "", address: ""},
    linkedin: "",
    github: "",
    source: "",
    department: decodedParams.deptId || "",
    position: decodedParams.jobId || "",
    cover: "",
    photo: null,
    cv: null,
    gender: "",
    experiences: [],
    education: [],
  }), [decodedParams]);

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
  // const handleStepClick = async (targetIndex, validateForm, values, setTouched) => {
  //   if (targetIndex <= currentStep) {
  //     setCurrentStep(targetIndex);
  //     return;
  //   }
  //   const errors = await validateForm();
  //   const requiredPaths = stepFields.slice(0, targetIndex).flat();
  //   const stepHasErrors = requiredPaths.some(path => hasErrorForPath(errors, path));
  //   if (stepHasErrors) {
  //     // mark touched for previous required fields so errors show
  //     const touchedObj = {};
  //     requiredPaths.forEach((path) => {
  //       const parts = path.split(".");
  //       let cur = touchedObj;
  //       for (let i = 0; i < parts.length; i++) {
  //         const p = parts[i];
  //         if (i === parts.length - 1) {
  //           cur[p] = true;
  //         } else {
  //           cur[p] = cur[p] || {};
  //           cur = cur[p];
  //         }
  //       }
  //     });
  //     setTouched((prev) => ({ ...prev, ...touchedObj }));
  //     toast.error("Please complete required fields in previous steps before going forward.");
  //     return;
  //   }
  //   setCurrentStep(targetIndex);
  // };

  // **Autofill from CV** — improved, tolerant regexes and heuristics
const handleAutofillFromCV = async (file, setFieldValue) => {
  if (!file) {
    toast.error("No CV chosen");
    return;
  }

  // Helper function to extract data from text
	const processText = (txt, explicitNameCandidate = null) => {
    console.log("Processing CV text...");
    const raw = String(txt || "").replace(/\s+/g, " ");
    const lines = txt.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    
    // DEBUG: Show what we're working with
    console.log("First 3 lines:", lines.slice(0, 3));
		console.log("Full text (first 10000 chars):", raw.substring(0, 10000));

		// ========== EXTRACT NAME ==========
    let extractedName = null;
    
		// 0. Common blocked lines that are NOT names
		const IGNORE_LINES = [
			"curriculum vitae", "resume", "cv", "personal details",
			"summary", "objective", "profile", "contact", "experience",
			"education", "skills", "languages", "projects", "certifications",
			"mobile", "phone", "email", "address", "page", "date of birth",
			"nationality", "marital status", "gender"
		];

		// Priority 0: Explicit candidate from PDF metadata (Largest Font)
		if (explicitNameCandidate) {
			const cleanCandidate = explicitNameCandidate.trim();
			const lowerCandidate = cleanCandidate.toLowerCase();

			let valid = true;
			// Check filtering
			if (cleanCandidate.length < 4 || cleanCandidate.length > 50) valid = false;
			if (IGNORE_LINES.some(ignored => lowerCandidate.includes(ignored))) valid = false;

			if (valid) {
				extractedName = cleanCandidate;
				console.log("✅ Found name (via Large Font):", extractedName);
			}
		}

		// Method 1: Look for explicit "Name:" or "Candidate:" prefix
		for (const line of lines.slice(0, 20)) { // Scan first 20 lines to be safe
			const nameMatch = line.match(/^(?:Name|Candidate|Full Name)\s*[:|-]?\s+([A-Za-z\s\.]+)/i);
			if (nameMatch) {
				const potentialName = nameMatch[1].trim();
				// Basic validation: 2-5 words, not too long
				if (potentialName.split(" ").length >= 2 && potentialName.length < 50) {
					extractedName = potentialName;
					console.log("✅ Found name (via prefix):", extractedName);
					break;
				}
			}
		}

		// Method 2: Improved Heuristic Scanner (if no prefix found)
		if (!extractedName) {
			for (let i = 0; i < Math.min(10, lines.length); i++) {
				const line = lines[i];
				const cleanLine = line.replace(/[#\*•\-–\|]/g, " ").replace(/\s+/g, " ").trim();
				const lowerLine = cleanLine.toLowerCase();

				// --- FILTERS ---
				// 1. Skip empty or very short/long lines
				if (cleanLine.length < 4 || cleanLine.length > 50) continue;

				// 2. Skip if it's a known header/label
				if (IGNORE_LINES.some(ignored => lowerLine.includes(ignored))) continue;

				// 3. Skip if contains contact info (email, phone, url, heavy numbers)
				if (/@|http|www|\.com|github|linkedin|\d{4,}/i.test(cleanLine)) continue;

				// 4. Word Count Check (Names usually 2-4 words)
				const words = cleanLine.split(" ").filter(w => w.length > 0);
				if (words.length < 2 || words.length > 5) continue;

				// --- NAME PATTERN CHECK ---
				// We allow:
				// - "John Doe" (Capitalized)
				// - "JOHN DOE" (ALL CAPS)
				// - "J. Doe" (Initials)
				// - "de Vries" (Lowercase particles)

				const isAllAlpha = /^[A-Za-z\.\s]+$/.test(cleanLine);
				if (!isAllAlpha) continue; // Must be letters only (and dot/space)

				// Check casing patterns
				const isCapitalized = words.every(w => /^[A-Z][a-z\.]*$/.test(w) || /^[a-z]+$/.test(w)); // Allows "Van" or "de"
				const isAllCaps = words.every(w => /^[A-Z\.]+$/.test(w));

				if (isCapitalized || isAllCaps) {
					extractedName = cleanLine;
					console.log("✅ Found name (heuristic):", extractedName);
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
    


		// ========== SECTION SPLITTING ==========
		// We split the document into logical sections to avoid cross-contamination
		const sections = {
			personal: [],
			experience: [],
			education: [],
			projects: [],
			skills: []
		};

		let currentSection = 'personal';

		// Regex for section headers
		const headers = {
			experience: /^(?:work|professional|employment)\s+experience|experience|history|employment$/i,
			education: /^(?:education|academic|qualifications|background)$/i,
			projects: /^(?:projects|portfolio|assignments)$/i,
			skills: /^(?:skills|technologies|technical|competencies)$/i
		};

		lines.forEach(line => {
			const clean = line.trim().toLowerCase();
			// Check if line is a header
			if (clean.length < 30) { // Headers are usually short
				if (headers.experience.test(clean)) { currentSection = 'experience'; return; }
				if (headers.education.test(clean)) { currentSection = 'education'; return; }
				if (headers.projects.test(clean)) { currentSection = 'projects'; return; }
				if (headers.skills.test(clean)) { currentSection = 'skills'; return; }
			}
			sections[currentSection].push(line);
		});

		console.log("Sections found:", Object.keys(sections).map(k => `${k}: ${sections[k].length} lines`));

		// ========== EXTRACT WORK EXPERIENCE ==========
		const extractedExperience = [];
		const expLines = sections.experience;

		for (let i = 0; i < expLines.length; i++) {
			const line = expLines[i];
			// Look for year pattern (e.g. 2020 - 2022, Jan 2020 - Present)
			const yearMatch = line.match(/((?:19|20)\d{2}\s*(?:-|–|to)\s*(?:(?:19|20)\d{2}|Present|Current|Now))/i) ||
				line.match(/((?:19|20)\d{2})/); // Single year fallback

			if (yearMatch) {
				// We found a date line. The role/company is usually here or 1-2 lines above.
				const dateStr = yearMatch[0];
				let company = "";
				let role = "";
				let years = 0;

				// Calculate years roughly
				try {
					const parts = dateStr.split(/-|–|to/);
					const start = parseInt(parts[0].replace(/\D/g, ''));
					let end = new Date().getFullYear();
					if (parts[1] && /\d/.test(parts[1])) {
						end = parseInt(parts[1].replace(/\D/g, ''));
					}
					years = Math.max(0, end - start);
					// If the duration is like "07 2024 - 09 2024", it's < 1 year, round to 1 or 0.5? Logic asks for integer usually.
					if (years === 0 && dateStr.length > 5) years = 1; // At least partial year
				} catch (e) { years = 1; }

				// Extract Company/Role
				// Strategy: Check if the line with date has other info split by | or - or ,
				const cleanLine = line.replace(dateStr, '').trim();
				const parts = cleanLine.split(/[|,\-]/).filter(p => p.trim().length > 2);

				if (parts.length >= 2) {
					// "ZAS | Frontend Engineer | 2025" -> parts: ["ZAS", "Frontend Engineer"]
					company = parts[0].trim();
					role = parts[1].trim();
				} else if (parts.length === 1) {
					// "Frontend Engineer | 2025" -> assume role? or company?
					// Heuristic: Check previous line for specific Company Name candidates
					company = parts[0].trim(); // Guess first part is company
					// Look at line above for Role
					if (i > 0) role = expLines[i - 1].trim();
				} else {
					// Date is on its own line?
					// "2023 - 2025"
					// Line above: "Frontend Engineer"
					// Line above that: "OPKLEY"
					if (i > 0) role = expLines[i - 1].trim();
					if (i > 1) company = expLines[i - 2].trim();
				}

				// Cleanup
				if (company.length > 50) company = company.substring(0, 50); // Sanity check
				if (role.length > 50) role = role.substring(0, 50);

				if (company && role) {
					extractedExperience.push({
						company: company,
						role: role,
						years: Math.max(1, years) // Minimum 1 year for validity
					});
					console.log("✅ Found Experience:", company, role, years);
				}
			}
		}
		if (extractedExperience.length > 0) {
			setFieldValue("experiences", extractedExperience);
		}

		// ========== EXTRACT EDUCATION ==========
		const extractedEducation = [];
		const eduLines = sections.education;

		for (let i = 0; i < eduLines.length; i++) {
			const line = eduLines[i];

			// Detect "University", "College", "Institute", "School"
			if (/University|College|Institute|School|Faculty/i.test(line)) {
				const institution = line.trim();
				let degree = "Bachelor"; // Default
				let year = 2024; // Default

				// Look for degree in same block (next 2 lines)
				for (let j = 0; j < 3; j++) {
					if (i + j >= eduLines.length) break;
					const subLine = eduLines[i + j];

					// Degree
					if (/Bachelor|Master|B\.?S\.?c|B\.?A|Degree/i.test(subLine)) {
						degree = subLine.trim();
					}

					// Year
					const yMatch = subLine.match(/(?:19|20)\d{2}/g);
					if (yMatch) {
						// Start or End year? usually we want graduation year (the max)
						const years = yMatch.map(y => parseInt(y));
						year = Math.max(...years);
					}
				}

				extractedEducation.push({
					institution: institution,
					degree: degree,
					year: year,
					certificate: null // File upload placeholder
				});
				console.log("✅ Found Education:", institution, degree, year);

				// Skip a few lines to avoid re-parsing same block
				i += 2;
			}
		}
		if (extractedEducation.length > 0) {
			setFieldValue("education", extractedEducation);
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
			console.log("Reading PDF file with pdfjs-dist...");
      const arrayBufferReader = new FileReader();
      
			arrayBufferReader.onload = async (e) => {
        try {
					const typedarray = new Uint8Array(e.target.result);

					// Load the PDF document
					const loadingTask = pdfjsLib.getDocument(typedarray);
					const pdf = await loadingTask.promise;

					let fullText = '';
					let maxFontSize = 0;
					let maxFontText = '';
					const usedMaxFontText = new Set(); // Avoid duplicates if same header repeats

					console.log(`PDF loaded. Pages: ${pdf.numPages}`);

					// Loop through all pages
					for (let i = 1; i <= pdf.numPages; i++) {
						const page = await pdf.getPage(i);
						const textContent = await page.getTextContent();

						// --- Improved Line Reconstruction ---
						// Group items by Y coordinate (within tolerance)
						const linesDict = {};
						const Y_TOLERANCE = 5;

						textContent.items.forEach(item => {
							// item.transform is [scaleX, skewY, skewX, scaleY, x, y]
							// We use transform[5] as Y coordinate. In PDF, (0,0) is bottom-left usually.
							// We want to group by Y.
							const y = item.transform[5] || 0;
							const fontSize = item.transform[0] || 0; // Approximate font size from scaleX
							const text = item.str.trim();

							if (!text) return;

							// Check for largest text on Page 1 (usually Name)
							if (i === 1) {
								if (fontSize > maxFontSize) {
									// Found new max, reset
									maxFontSize = fontSize;
									maxFontText = text;
								} else if (Math.abs(fontSize - maxFontSize) < 1 && text.length > maxFontText.length) {
									// Roughly same size, but longer text? prefer it
									maxFontText = text;
								}
							}

							// Find a matching line group
							let matchedY = Object.keys(linesDict).find(key => Math.abs(key - y) < Y_TOLERANCE);

							if (!matchedY) {
								matchedY = y;
								linesDict[matchedY] = [];
							}

							linesDict[matchedY].push({ x: item.transform[4], text: item.str });
						});

						// Sort lines top-to-bottom (PDF Y is bottom-up usually, so higher Y is higher on page)
						const sortedY = Object.keys(linesDict).sort((a, b) => parseFloat(b) - parseFloat(a));

						const pageLines = sortedY.map(y => {
							// Sort items in line left-to-right
							const lineItems = linesDict[y].sort((a, b) => a.x - b.x);
							return lineItems.map(item => item.text).join(" ");
						});

						// Join lines with newlines
						const pageText = pageLines.join("\n");
						fullText += pageText + '\n\n';
          }
          
					console.log("Extracted PDF text length:", fullText.length);
					console.log("Max detected font text:", maxFontText);

					if (!fullText.trim()) {
						toast.error("PDF appears to be empty or scanned (image-only).");
					} else {
						// Pass the max font text as a Priority Candidate for the name
						processText(fullText, maxFontText);
						toast.success("PDF processed successfully!");
					}
          
        } catch (pdfError) {
          console.error("PDF processing error:", pdfError);
          toast.error("Could not extract text from PDF");
        }
      };
      
      arrayBufferReader.readAsArrayBuffer(file);
      
    } else {
      // For text-based files (DOC, DOCX, TXT)
			if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
				file.type === 'application/msword') {
				console.warn("Attempting to read DOC/DOCX as text. This requires a parser like Mammoth.js for best results.");
				toast.error("Auto-fill fully supports PDF. Word documents might not be read correctly without a parser.");
			}

      console.log("Reading text-based file...");
      reader.readAsText(file);
    }
    
  } catch (error) {
    console.error("General file reading error:", error);
    toast.error("Unable to process the file");
  }
};

  // helper to check per-step errors and mark touched for current step
  // const validateStepAndProceed = async (validateForm, values, setTouched) => {
  //   const errors = await validateForm();
  //   const fields = stepFields[currentStep] || [];
  //   const stepHasErrors = fields.some((path) => {
  //     const parts = path.split(".");
  //     let v = errors;
  //     for (const p of parts) {
  //       if (!v) return false;
  //       v = v[p];
  //     }
  //     return !!v;
  //   });

  //   if (stepHasErrors) {
  //     // mark the step fields as touched to show validation messages
  //     const touchedObj = {};
  //     fields.forEach((path) => {
  //       const parts = path.split(".");
  //       let cur = touchedObj;
  //       for (let i = 0; i < parts.length; i++) {
  //         const p = parts[i];
  //         if (i === parts.length - 1) {
  //           cur[p] = true;
  //         } else {
  //           cur[p] = cur[p] || {};
  //           cur = cur[p];
  //         }
  //       }
  //     });
  //     setTouched((prev) => ({ ...prev, ...touchedObj }));
  //     toast.error("Please fix required fields in this step before continuing");
  //     return false;
  //   }
  //   return true;
  // };

  // STEP VALIDATION AND ERROR DISPLAY LOGIC
const validateStepAndShowAllErrors = async (validateForm, values, setTouched, stepIndex) => {
  const errors = await validateForm();
  const fields = stepFields[stepIndex] || [];

  const stepHasErrors = fields.some((path) => hasErrorForPath(errors, path));

  if (stepHasErrors) {
    const touchedObj = {};

    // mark simple fields
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

    // handle arrays (experiences, education)
    if (stepIndex === 2) {
      if (values.experiences && values.experiences.length > 0) {
        touchedObj.experiences = values.experiences.map(() => ({
          company: true,
          years: true,
          role: true,
        }));
      }
      if (values.education && values.education.length > 0) {
        touchedObj.education = values.education.map(() => ({
          institution: true,
          degree: true,
          year: true,
          certificate: true,
        }));
      }
    }

    // MERGE CORRECTLY into Formik touched
    setTouched(touchedObj);

    toast.error("Please fix all required fields in this step before continuing");
    return false;
  }

  return true;
};



// Also update the handleStepClick function to show all errors for the target step
const handleStepClick = async (targetIndex, validateForm, values, setTouched) => {
  if (targetIndex <= currentStep) {
    setCurrentStep(targetIndex);
    return;
  }
  
  // Validate all steps up to the target index
  const errors = await validateForm();
  let firstInvalidStep = -1;
  
  // Check each step up to targetIndex
  for (let step = 0; step < targetIndex; step++) {
    const stepFieldsToCheck = stepFields[step] || [];
    const stepHasErrors = stepFieldsToCheck.some(path => hasErrorForPath(errors, path));
    
    if (stepHasErrors) {
      firstInvalidStep = step;
      break;
    }
  }
  
  if (firstInvalidStep >= 0) {
    // Show all errors for the first invalid step
    const fields = stepFields[firstInvalidStep] || [];
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
    
    // Handle array fields for step 2
    if (firstInvalidStep === 2) {
      if (values.experiences && values.experiences.length > 0) {
        touchedObj.experiences = values.experiences.map(() => ({
          company: true,
          years: true,
          role: true
        }));
      }
      
      if (values.education && values.education.length > 0) {
        touchedObj.education = values.education.map(() => ({
          institution: true,
          degree: true,
          year: true,
          certificate: true
        }));
      }
    }
    
    setTouched((prev) => ({ ...prev, ...touchedObj }));

    
    // Jump to the first invalid step
    setCurrentStep(firstInvalidStep);
    toast.error(`Please complete step ${firstInvalidStep + 1} before proceeding`);
    return;
  }
  
  // If all previous steps are valid, proceed
  setCurrentStep(targetIndex);
};

  useEffect(() => {
    // placeholder if you want side-effects on nav/footer sizes
  }, [navBarHeight, footerHeight]);

  if (apiSuccess) return (
    <div className="flex flex-col items-center justify-center gap-1 text-center" style={{
      height: `calc( 100vh  - ${( footerHeight)}px)`,
      paddingTop: `${navBarHeight}px`
    }}>
      <IoCheckmarkSharp className="text-[300px] text-green-500"/>
      <p className="text-3xl font-bold">Thank You!</p>
      <p className="sm:text-2xl text-xl">Your application was successfully submitted</p>
      <p className="text-xl text-gray-600">you will recive an email soon with this serial number<br/> <b>{serial}</b></p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-start justify-center p-6 bg-gradient-to-b from-white to-gray-50 pt-26">
      <div className="w-full max-w-5xl">
        <Formik
					enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, actions) => {
            setApiError(null);
            setApiSuccess(null);
            try {
              const personalImage = values.photo
                ? await uploadToCloudinary(values.photo)
                : "";
              const cvUpload = values.cv
                ? await uploadToCloudinary(values.cv)
                : "";
                const certificates = await Promise.all(
  values.education.map((edu) =>
    edu.certificate ? uploadToCloudinary(edu.certificate) : ""
  )
);

              const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "*/*" },
                body: JSON.stringify({
                  personalId: 0,
                  PersonalCvFirstName: values.firstName,
                  PersonalCvMedilName: values.middleName,
                  PersonalCvLastName: values.lastName,
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
                  personalCvHowNowAboutUsName:howDoYouKnew?.find((item) => item.personalHowNowAboutUsId == values.source)?.personalHowNowAboutUsName || "",
                  personalSocialId: Number(values.socialStatus),
                  personalCvUploadPickt: personalImage,
                  personalCvUploadCV: cvUpload,
                  personalCvsWorkExperiences:
                    values.experiences?.map((e) => ({
                      personalCvsWorkExperienceCompanyName: e.company,
                      personalCvsWorkExperienceRole: e.role,
                      personalCvsWorkExperienceYear: Number(e.years),
                    })) || [],
                 peronalCvsEducations:
  values.education?.map((e, i) => ({
    peronalCvEducationInstitution: e.institution,
		peronalCvEducationDegree: e.degree,
    peronalCvEducationGraduationYear: Number(e.year),
    PeronalCvEducationFileLink: certificates[i],
  })) || [],

                }),
              });

              const data = await res.json().catch(() => null);
              if (res.ok) {
                setApiSuccess(true);
                setSerial(data?.personalCvSequanceNumber);
                
                
                const summary = { ...values };
                if (values.cv)
                  summary.cv = { name: values.cv.name, size: values.cv.size };
                if (values.photo)
                  summary.photo = {
                    name: values.photo.name,
                    size: values.photo.size,
                  };
                setSubmitted(summary);
                actions.resetForm();
                setCurrentStep(0);
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
            validateForm,
            setTouched,
            resetForm
          }) => (
            <>
              <SubmitWatcher />
              <Form className="bg-white border rounded-2xl py-6 md:px-6 px-2 shadow-sm border-light-gray">
                <h2 className="text-xl font-semibold text-secondary">
                  Job Application
                </h2>
                <p className="text-sm text-gray mt-1">
                  Complete the form — step {currentStep + 1} of {steps.length}
                </p>

                {/* STEP INDICATOR */}
                <div className="mt-4 flex justify-between md:justify-center items-center md:gap-3 flex-wrap p-2">
                  {steps.map((s, i) => (
                    <div
                      key={s}
                      className={`md:flex-1 w-[45%] text-center py-2 my-2 rounded-full cursor-pointer ${
                        i === currentStep
                          ? "bg-primary text-white"
                          : i < currentStep
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                      onClick={() =>
                        handleStepClick(i, validateForm, values, setTouched)
                      }
                    >
                      {s + " " + `(${i + 1})`} 
                    </div>
                  ))}
                </div>

                {/* STEP CONTENT */}
                <div className="mt-6">
                  {currentStep === 0 && (
                    <section className="rounded-xl flex gap-6 items-center md:flex-row-reverse flex-col">
                      {/* === CV Upload placed at the top for immediate autofill === */}
                      <div className="mb-4">
                        <label className="block text-secondary text-sm mb-1 text-center">
                          Upload CV (optional)
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
                              : "Click to upload CV (PDF / DOC / DOCX / TXT)"}
                          </span>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
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
                          </svg>
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
                              // await handleAutofillFromCV(f, setFieldValue);
                            }
                          }}
                        />
                        <ErrorMessage
                          name="cv"
                          component="div"
                          className="text-danger text-xs mt-1"
                        />
                        {values.cv && (
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleAutofillFromCV(values.cv, setFieldValue)
                              }
                              className="px-3 py-1 border rounded-full"
                            >
                              Autofill from CV
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFieldValue("cv", null);
                              }}
                              className="px-3 py-1 border rounded-full"
                            >
                              Remove CV
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Personal Data (same fields as before) */}
                      <div className="grid flex-1 grid-cols-1 w-full  gap-5">
                        <div className="bg-light-gray p-4 rounded-lg flex flex-col gap-5 ">
                          <h3 className="text-sm font-semibold text-secondary mb-3">
                            Personal Data
                          </h3>
                          <div>
                            <label className="block text-secondary text-sm mb-1">
                              First Name{" "}
                              <span className={`ms-1 font-semibold ${
                                !errors.firstName && touched.firstName
                                  ? "text-green-700"
                                  : "text-danger"
                              }`}>
                                (required)
                              </span>
                            </label>
                            <Field
                              name="firstName"
                              placeholder="First"
                              className={`w-full rounded-full border px-4 py-2 text-sm ${
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
                              Middle Name{" "}
                              <span className={`ms-1 font-semibold ${
                                !errors.middleName && touched.middleName
                                  ? "text-green-700"
                                  : "text-danger"
                              }`}>
                                (required)
                              </span>
                            </label>
                            <Field
                              name="middleName"
                              placeholder="Middle"
                              className={`w-full rounded-full border px-4 py-2 text-sm ${
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
                              <span className={`ms-1 font-semibold ${
                                !errors.lastName && touched.lastName
                                  ? "text-green-700"
                                  : "text-danger"
                              }`}>
                                (required)
                              </span>
                            </label>
                            <Field
                              name="lastName"
                              placeholder="Last"
                              className={`w-full rounded-full border px-4 py-2 text-sm ${
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
                              Birth Date{" "}
                              <span className={`ms-1 font-semibold ${
                                !errors.birthDate && touched.birthDate
                                  ? "text-green-700"
                                  : "text-danger"
                              }`}>
                                (required)
                              </span>
                            </label>
                            <Field
                              name="birthDate"
                              type="date"
                              placeholder="Birth Date"
                              className={`w-full rounded-full border px-4 py-2 text-sm ${
                                errors.birthDate && touched.birthDate
                                  ? "border-danger"
                                  : "border-gray-200"
                              }`}
                            />
                            <ErrorMessage
                              name="birthDate"
                              component="div"
                              className="text-danger text-xs mt-1"
                            />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">
                              Gender{" "}
                              <span className={`ms-1 font-semibold ${
                                !errors.gender && touched.gender
                                  ? "text-green-700"
                                  : "text-danger"
                              }`}>
                                (required)
                              </span>
                            </label>
                            <Field
                              as="select"
                              name="gender"
                              className={`w-full  rounded-full border px-4 py-2 text-sm ${
                                errors.gender && touched.gender
                                  ? "border-danger"
                                  : "border-gray-200"
                              }`}
                            >
                              <option value="">Select Gender</option>
                              {genders &&
                                genders.map((g) => (
                                  <option
                                    value={g.personalGenderId}
                                    key={g.personalGenderId}
                                  >
                                    {g.personalGenderName}
                                  </option>
                                ))}
                            </Field>
                            <ErrorMessage
                              name="gender"
                              component="div"
                              className="text-danger text-xs mt-1"
                            />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">
                              Social status{" "}
                              <span className={`ms-1 font-semibold text-danger ${
                                !errors.socialStatus && touched.socialStatus
                                  ? "text-green-700"
                                  : "text-danger"
                              }`}>
                                (required)
                              </span>
                            </label>
                            <Field
                              as="select"
                              name="socialStatus"
                              className={`w-full rounded-full border px-4 py-2 text-sm ${
                                errors.socialStatus && touched.socialStatus
                                  ? "border-danger"
                                  : "border-gray-200"
                              }`}
                            >
                              <option value="">Select Social Status</option>
                              {socials &&
                                socials.map((s) => (
                                  <option
                                    value={s.personalSocialId}
                                    key={s.personalSocialId}
                                  >
                                    {s.personalSocialName}
                                  </option>
                                ))}
                            </Field>
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
                              className="w-full rounded-full border px-4 py-2 text-sm bg-white flex items-center justify-between cursor-pointer"
                            >
                              <span className="text-gray">
                                {values.photo
                                  ? values.photo.name
                                  : "Upload photo"}
                              </span>
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
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
                        {/* empty right column or other content if needed */}
                      </div>
                    </section>
                  )}

                  {currentStep === 1 && (
                    <section>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-light-gray p-4 rounded-lg flex flex-col gap-5">
                          <h3 className="text-sm font-semibold text-secondary ">
                            Address Information
                          </h3>

                          <div>
                            <label className="block text-secondary text-sm mb-1">
                              Country{" "}
                              <span className={`ms-1 font-semibold ${
                                !errors.location?.country && touched.location?.country
                                  ? "text-green-700"
                                  : "text-danger"
                              }`}>
                                (required)
                              </span>
                            </label>
                            <div className="relative">
                              <Field
                                as="select"
                                name="location.country"
                                onChange={(e) => {
                                  setSelectedCountry(e.target.value);
                                  setFieldValue(
                                    "location.country",
                                    e.target.value
                                  );
                                  setFieldValue("location.city", "");
                                  setFieldValue("location.area", "");
                                }}
                                className={`w-full rounded-full border px-4 py-2 pr-10 text-sm ${
                                  errors.location?.country &&
                                  touched.location?.country
                                    ? "border-danger"
                                    : "border-gray-200"
                                }`}
                              >
                                <option value="">Select country</option>
                                {uniqueCountries &&
                                  uniqueCountries.map((c) => (
                                    <option
                                      value={c.countryID}
                                      key={c.countryID}
                                    >
                                      {c.countryName}
                                    </option>
                                  ))}
                              </Field>
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
                              <span className={`ms-1 font-semibold ${
                                !errors.location?.city && touched.location?.city
                                  ? "text-green-700"
                                  : "text-danger"
                              }`}>
                                (required)
                              </span>
                            </label>
                            <Field
                              as="select"
                              name="location.city"
                              disabled={!selectedCountry}
                              onChange={(e) => {
                                setSelectedCity(e.target.value);
                                setFieldValue("location.city", e.target.value);
                                setFieldValue("location.area", "");
                              }}
                              className={`w-full rounded-full border px-4 py-2 pr-10 text-sm ${
                                errors.location?.city && touched.location?.city
                                  ? "border-danger"
                                  : "border-gray-200"
                              }`}
                            >
                              <option value="">Select city</option>
                              {uniqueCities &&
                                uniqueCities.map((c) => (
                                  <option value={c.cityID} key={c.cityID}>
                                    {c.cityName}
                                  </option>
                                ))}
                            </Field>
                            <ErrorMessage
                              name="location.city"
                              component="div"
                              className="text-danger text-xs mt-1"
                            />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">
                              Area / District{" "}
                              <span className={`ms-1 font-semibold ${
                                !errors.location?.area && touched.location?.area
                                  ? "text-green-700"
                                  : "text-danger"
                              }`}>
                                (required)
                              </span>
                            </label>
                            <Field
                              as="select"
                              name="location.area"
                              disabled={!selectedCountry || !selectedCity}
                              className={`w-full rounded-full border px-4 py-2 pr-10 text-sm ${
                                errors.location?.area && touched.location?.area
                                  ? "border-danger"
                                  : "border-gray-200"
                              }`}
                            >
                              <option value="">Select area</option>
                              {uniqueAreas &&
                                uniqueAreas.map((a) => (
                                  <option value={a.ariaID} key={a.ariaID}>
                                    {a.ariaName}
                                  </option>
                                ))}
                            </Field>
                            <ErrorMessage
                              name="location.area"
                              component="div"
                              className="text-danger text-xs mt-1"
                            />
                          </div>

                          <div>
                            <label className="block text-secondary text-sm mb-1">
                              Address{" "}
                              <span className={`ms-1 font-semibold text-danger ${
                                !errors.location?.address && touched.location?.address
                                  ? "text-green-700"
                                  : "text-danger"
                              }`}>
                                (required)
                              </span>
                            </label>
                            <Field
                              name="location.address"
                              placeholder="address"
                              className={`w-full rounded-full border px-4 py-2 text-sm ${
                                errors.location?.address &&
                                touched.location?.address
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

                        <div className="bg-light-gray p-4 rounded-lg flex flex-col gap-5">
                          <h3 className="text-sm font-semibold text-secondary ">
                            Contact Info
                          </h3>
                          <div>
                            <label className="block text-secondary text-sm mb-1">
                              Email{" "}
                              <span className={`ms-1 font-semibold ${
                                !errors.email && touched.email
                                  ? "text-green-700"
                                  : "text-danger"
                              }`}>
                                (required)
                              </span>
                            </label>
                            <Field
                              name="email"
                              type="email"
                              placeholder="you@domain.com"
                              className={`w-full rounded-full border px-4 py-2 text-sm ${
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
                              <span className={`ms-1 font-semibold ${
                                !errors.phone && touched.phone
                                  ? "text-green-700"
                                  : "text-danger"
                              }`}>
                                (required)
                              </span>
                            </label>
                            <div
                              className={`flex items-center w-full rounded-full border bg-white overflow-hidden ${
                                errors.phone && touched.phone
                                  ? "border-danger"
                                  : "border-gray-200"
                              }`}
                            >
                              <Field
                                as="select"
                                name="phoneCode"
                                className="h-full bg-transparent px-3 py-2 text-sm text-secondary border-r border-gray-200 focus:outline-none"
                              >
                                {COUNTRY_CODES.map((c) => (
                                  <option key={c.code} value={c.code}>
                                    {c.code}
                                  </option>
                                ))}
                              </Field>
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
                              LinkedIn Profile
                            </label>
                            <Field
                              name="linkedin"
                              placeholder="https://linkedin.com/in/you"
                              className="w-full rounded-full border px-4 py-2 text-sm border-gray-200"
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
                              className="w-full rounded-full border px-4 py-2 text-sm border-gray-200"
                            />
                            <ErrorMessage
                              name="github"
                              component="div"
                              className="text-danger text-xs mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {currentStep === 2 && (
                    <section className="mt-4 bg-light-gray rounded-xl p-4 flex flex-col gap-5">
                      <h3 className="text-sm font-semibold text-secondary ">
                        Application Details
                      </h3>
                      <div>
                        <label className="block text-secondary text-sm mb-1">
                          Department{" "}
                          <span className={`ms-1 font-semibold ${
                                !errors.department && touched.department
                                  ? "text-green-700"
                                  : "text-danger"
                              }`}>
                            (required)
                          </span>
                        </label>
                        <Field
                          as="select"
                          disabled={!!decodedParams.deptId}
                          name="department"
                          onChange={(e) => {
                            setDepartmentId(e.target.value);
                            // setPositions([]);
                            setFieldValue("department", e.target.value);
                            setFieldValue("position", "");
                          }}
                          className={`w-full rounded-full border px-4 py-2 pr-10 text-sm ${
                            errors.department && touched.department
                              ? "border-danger"
                              : "border-gray-200"
                          }`}
                        >
                          <option value="">Select department</option>
                          {departments &&
                            departments.map((d) => (
                              <option
                                value={d.departmentId}
                                key={d.departmentId}
                              >
                                {d.departmentName}
                              </option>
                            ))}
                        </Field>
                        <ErrorMessage
                          name="department"
                          component="div"
                          className="text-danger text-xs mt-1"
                        />
                      </div>

                      <div className="mt-3">
                        <label className="block text-secondary text-sm mb-1">
                          Position Applying For{" "}
                          <span className={`ms-1 font-semibold ${
                                !errors.position && touched.position
                                  ? "text-green-700"
                                  : "text-danger"
                              }`}>
                            (required)
                          </span>
                        </label>
                        <Field
                          as="select"
                          disabled={!values.department || !!decodedParams.jobId}
                          name="position"
                          className={`w-full rounded-full ${!values.department && "disabled opacity-50"} border px-4 py-2 pr-10 text-sm ${
                            errors.position && touched.position
                              ? "border-danger"
                              : "border-gray-200"
                          }`}
                        >
                          <option value="">Select position</option>
                          {jobs &&
                            jobs.map((j) => (
                              <option value={j.jopId} key={j.jopId}>
                                {j.jopName}
                              </option>
                            ))}
                        </Field>
                        <ErrorMessage
                          name="position"
                          component="div"
                          className="text-danger text-xs mt-1"
                        />
                      </div>

                      <div className="mt-3">
                        <label className="block text-secondary text-sm mb-1">
                          How did you hear about us{" "}

                        </label>
                        <Field
                          as="select"
                          name="source"
                          className={`w-full rounded-full ${!values.department && "disabled opacity-50"} border px-4 py-2 pr-10 text-sm ${
                            errors.source && touched.source
                              ? "border-danger"
                              : "border-gray-200"
                          }`}
                        >
                          {/* <option value="">Select position</option> */}
                          <option value="">Select how did you know</option>
                          {howDoYouKnew &&
                            howDoYouKnew.map((h) => (
                              
                              <option value={h.personalHowNowAboutUsId} key={h.personalHowNowAboutUsName}>
                                {h.personalHowNowAboutUsName}
                              </option>
                            ))}
                        </Field>
                        <ErrorMessage
                          name="position"
                          component="div"
                          className="text-danger text-xs mt-1"
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-secondary text-sm mb-1">
                          Why we should hire you ?
                        </label>
                        <Field
                          as="textarea"
                          name="cover"
                          rows={4}
                          className="w-full rounded-xl border px-4 py-2 text-sm bg-white placeholder-gray-400"
                        />
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-secondary">
                            Work Experience
                          </h4>
                          <FieldArray name="experiences">
                            {({ push }) => (
                              <div>
                                <button
                                  type="button"
                                  onClick={() =>{
                                    if (values.experiences.length ==0 || values.experiences[values.experiences.length - 1].company == "gap") {

                                      push({ company: "", years: "", role: "",id: nanoid(), })
                                    }else{
                                      setGapPopup(true)
                                    }}
                                  }
                                  className="text-sm rounded-full px-3 py-1 border"
                                  style={{
                                    background: "var(--color-secondary)",
                                    color: "white",
                                  }}
                                >
                                  + Add
                                </button>
                                {gapPopup && 
                                <div className="fixed left-0 top-0 bg-[#00000044] flex items-center justify-center w-screen h-screen">
                                  <div className="bg-white rounded-3xl min-w-1/3 p-9 flex flex-col items-center justify-center gap-6">
                                  <p>Did you take a break from work ?</p>
                                  <div className="flex items-center justify-center gap-5">
                                  <button className="text-sm rounded-full px-3 py-1 border" onClick={() =>
                                    {push({ company: "gap", years: "", role: "" })
                                    setGapPopup(false)}
                                  }
                                   style={{background:"var(--color-secondary)",color:"white"}}>Yes</button>
                                  <button className="text-sm rounded-full px-3 py-1 border" onClick={() =>
                                  {  push({ company: "", years: "", role: "" })
                                    setGapPopup(false)}
                                  } style={{background:"var(--color-secondary)",color:"white"}}>No</button>
                                  </div>
                                  </div>
                                </div>
                                }
                              </div>
                            )}
                          </FieldArray>
                        </div>
                        <FieldArray name="experiences">
                          {({ remove, push }) => (
                            <div className="space-y-3">
                              {values.experiences &&
                                values.experiences.length > 0 &&
                                values.experiences.map((exp, idx, arr) => {
                                    const experienceNo =arr.slice(0, idx).filter(e => e.company !== "gap").length + 1;
                                    const gapNo =arr.slice(0, idx).filter(e => e.company === "gap").length + 1;

                                  if (exp.company === "gap") {
                                    return (
                                    <div className="">
                                    <div key={exp.id} className="text-xs flex justify-between grid-cols-12 mt-5 mb-2">
                                      <h4 className="">
                                        Gap No {gapNo}
                                      </h4>
                                      <button
                                        type="button"
                                        onClick={() => remove(idx)}
                                        className="text-sm text-red-500 md:hidden"
                                      >
                                        <FaTrashAlt />
                                      </button>
                                    </div>
                                    <div
                                      key={idx+"-"+exp.id}
                                      className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center "
                                    >

                                      <div className="md:col-span-8">
                                        <Field
                                          name={`experiences.${idx}.role`}
                                          placeholder="What is the reason for taking a break ?"
                                          className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
                                        />
                                       <ErrorMessage name={`experiences.${idx}.role`}>
                                         {msg => (
                                           <div className="text-danger text-xs mt-1">
                                             {msg === "Role is required" ? "Reason is required" : msg}
                                           </div>
                                         )}
                                       </ErrorMessage>

                                      </div>
                                      <div className="md:col-span-3">
                                        <Field
                                          name={`experiences.${idx}.years`}
                                          placeholder="Start year"
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
                                        {/* <ErrorMessage
                                          name={`experiences.${idx}.role`}
                                          component="div"
                                          className="text-danger text-xs mt-1 "
                                        /> */}
                                      </div>
                                      <div className="col-span-3">
                                        <ErrorMessage
                                          name={`experiences.${idx}.years`}
                                          component="div"
                                          className="text-danger text-xs mt-1 "
                                        />
                                      </div>
                                    </div>
                                  </div>)
                                  }
                                  return (
                                  <div key={exp.id} className="">
                                    <div className="text-xs flex justify-between grid-cols-12 mt-5 mb-2">
                                      <h4 className="">
                                        Experience No {experienceNo}
                                      </h4>
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
                                          placeholder="start year"
																						className="w-full rounded-full border border-gray-200 px-4 py-2 text-sm bg-white placeholder-gray-400 focus:outline-none"
																						type="number"
																						min="1900"
																						max={new Date().getFullYear()}
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
                                  </div>)
})}
                            </div>
                          )}
                        </FieldArray>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-secondary">
                            Education
                          </h4>
                          <FieldArray name="education">
                            {({ push }) => (
                              <div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    push({
                                      institution: "",
                                      degree: "",
                                      year: "",
                                      certificate: null,
                                    })
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
                                values.education.map((ed, idx) => (
                                  <div>
                                  <div
                                    key={idx}
                                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                                  >
                                    <div className="md:col-span-4">
                                      <Field
                                        name={`education.${idx}.institution`}
                                        placeholder="Institution"
                                        className="w-full rounded-full border px-4 py-2 text-sm"
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
                                        className="w-full rounded-full border px-4 py-2 text-sm"
                                      />
                                      <ErrorMessage
                                          name={`education.${idx}.degree`}
                                          component="div"
                                          className="text-danger text-xs mt-1 md:hidden"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                      <Field
                                        name={`education.${idx}.year`}
                                        placeholder="Graduation Year"
                                        className="w-full rounded-full border px-4 py-2 text-sm"
                                      />
                                      <ErrorMessage
                                          name={`education.${idx}.year`}
                                          component="div"
                                          className="text-danger text-xs mt-1 md:hidden"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <input
                                         type="file"
                                         name={`education.${idx}.certificate`}
                                         className="cursor-pointer w-full rounded-full border px-4 py-2 text-sm bg-primary text-white"
                                         onChange={(event) => {
                                           setFieldValue(
                                             `education.${idx}.certificate`,
                                             event.currentTarget.files[0]
                                           );
                                         }}
                                       />
                                       <ErrorMessage
                                          name={`education.${idx}.certificate`}
                                          component="div"
                                          className="text-danger text-xs mt-1 md:hidden"
                                        />

                                    </div>
                                    <div className="md:col-span-1 flex justify-end">
                                      <button
                                        type="button"
                                        onClick={() => remove(idx)}
                                        className="text-red-500"
                                      >
                                        <FaTrashAlt />
                                      </button>
                                    </div>
                                  </div>
                                    <div className="hidden md:grid md:grid-cols-12 gap-3 items-center ">
                                      <div className="col-span-4">
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
                                      <div className="col-span-2">
                                        <ErrorMessage
                                          name={`education.${idx}.year`}
                                          component="div"
                                          className="text-danger text-xs mt-1 "
                                        />
                                      </div>
                                      <div className="col-span-2">
                                        <ErrorMessage
                                          name={`education.${idx}.certificate`}
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
                              <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                                Contacts
                              </h3>
                              <ul className="mt-3 text-sm text-slate-700 space-y-2">
                                <li className="flex flex-col md:flex-row items-start md:gap-2">
                                  <span className="font-medium text-slate-500 w-20">
                                    Email
                                  </span>
                                  <span className="text-primary" style={{wordBreak:"break-word"}}>{values.email || "—"}</span>
                                </li>
                                <li className="flex flex-col md:flex-row items-start md:gap-2">
                                  <span className="font-medium text-slate-500 w-20">
                                    Phone
                                  </span>
                                  <span className="text-primary" style={{wordBreak:"break-word"}}>
                                    {values.phoneCode} {values.phone || "—"}
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="font-medium text-slate-500 w-20">
                                    Location
                                  </span>
                                  <span>
                                    {uniqueCountries.find(
                                      (c) =>
                                        c.countryID == values.location?.country
                                    )?.countryName || "—"}
                                    {values.location?.city
                                      ? `, ${
                                          uniqueCities.find(
                                            (c) =>
                                              c.cityID == values.location?.city
                                          )?.cityName
                                        }`
                                      : ""}
                                  </span>
                                </li>
                                <li className="flex items-start gap-2 justify-center">
                                  {
                                    <span className="font-medium text-slate-500 w-20">
                                      {values?.location?.address || "—"}
                                    </span>
                                  }
                                </li>
                                <li className="flex flex-col md:flex-row items-start md:gap-2">
                                  <span className="font-medium text-slate-500 w-20">
                                    linkedin
                                  </span>
                                  <a
                                    href={values.linkedin || "#"}
                                    target="_blanck"
                                    style={{wordBreak:"break-word"}}
                                    className={`${values.linkedin ?"text-primary underline":""}`}
                                  >
                                    {values.linkedin || "—"}
                                  </a>
                                </li>
                                <li className="flex flex-col md:flex-row items-start md:gap-2">
                                  <span className="font-medium text-slate-500 w-20">
                                    github
                                  </span>
                                  <a
                                    href={values.github || "#"}
                                    target="_blanck"
                                    style={{wordBreak:"break-word"}}
                                    className={`${values.github ?"text-primary underline":""}`}
                                  >
                                    {values.github || "—"}
                                  </a>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="font-medium text-slate-500 w-20">
                                    CV
                                  </span>
                                  <span>
                                    {values.cv ? values.cv.name : "—"}
                                  </span>
                                </li>

                                <li className="flex items-start gap-2">
                                  <span className="font-medium text-slate-500 w-20">
                                    Social status
                                  </span>
                                  <span>
                                    {values.socialStatus ? socials.find((s) => s.personalSocialId == values.socialStatus)?.personalSocialName : "—"}
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="font-medium text-slate-500 w-20">
                                    Gender
                                  </span>
                                  <span>
                                    {values.gender ? genders.find((s) => s.personalGenderId == values.gender)?.personalGenderName : "—"}
                                  </span>
                                </li>
                              </ul>
                            </div>

                            <hr className="my-5 border-slate-200 w-full" />

                            {/* Awards (only rendered if data exists) */}
                            {/* {values.awards && values.awards.length > 0 && (
                              <div className="w-full">
                                <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                                  Awards
                                </h3>
                                <ul className="mt-3 text-sm text-slate-700 space-y-3">
                                  {values.awards.map((a, idx) => (
                                    <li key={idx}>
                                      <div className="text-sm font-medium">
                                        {a.title}
                                      </div>
                                      <div className="text-xs text-slate-500">
                                        {a.year || "—"}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                                <hr className="my-5 border-slate-200 w-full" />
                              </div>
                            )} */}

                            {/* Skills (visual bars) */}
                            {/* {values.skills && values.skills.length > 0 && (
                              <div className="w-full">
                                <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
                                  Skills
                                </h3>
                                <ul className="mt-3 space-y-3">
                                  {values.skills.map((s, idx) => (
                                    <li key={idx} className="text-sm">
                                      <div className="flex justify-between items-center">
                                        <span className="text-slate-700">
                                          {s.name}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                          {s.level ? `${s.level}%` : ""}
                                        </span>
                                      </div>
                                      <div className="mt-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                          className="h-2 rounded-full bg-primary"
                                          style={{
                                            width: s.level
                                              ? `${s.level}%`
                                              : "30%",
                                          }}
                                        />
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )} */}
                          </div>
                        </aside>

                        {/* RIGHT COLUMN - main CV content */}
                        <main className="col-span-8 border-l border-slate-200 pl-8">
                          {/* Name + Title row */}
                          <div className="flex items-start justify-between">
                            <div>
                              <h1 className="text-3xl leading-tight font-extrabold">
                                <span className="text-slate-900">
                                  {values.firstName || ""}{" "}
                                  {values.middleName || ""}
                                </span>{" "}
                                <span className="text-primary">
                                  {values.lastName || ""}
                                </span>
                              </h1>
                              <p className="text-lg text-slate-600 mt-1">
                                {values.position
                                  ? jobs.find((j) => j.jopId == values.position)
                                      ?.jopName
                                  : "—"}
                                {" - "}
                                {values.department
                                  ? departments.find(
                                      (d) => d.departmentId == values.department
                                    )?.departmentName
                                  : "—"}
                              </p>
                            </div>

                            {/* small contact column on right (optional) */}
                            {/* <div className="text-sm text-slate-500">
                              <div>{values.email || ""}</div>
                              <div className="mt-1">
                                {values.phoneCode} {values.phone || ""}
                              </div>
                            </div> */}
                          </div>

                          <hr className="my-4 border-slate-200" />

                          {/* Profile / Summary */}
                          <section className="mb-6">
                            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
                              Why should we hire you?
                            </h2>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {values.cover || "—"}
                            </p>
                          </section>

                          <hr className="my-4 border-slate-200" />

                          {/* Education */}
                          <section className="mb-6">
                            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                              Education
                            </h2>
                            <div className="space-y-4 text-sm text-slate-700">
                              {values.education &&
                              values.education.length > 0 ? (
                                values.education.map((ed, i) => (
                                  <div
                                    key={i}
                                    className="flex justify-between items-start"
                                  >
                                    <div>
                                      <div className="font-medium">
                                        {ed.institution || "—"}
                                      </div>
                                      <div className="text-xs text-slate-500">
                                        {ed.degree || "—"}
                                      </div>
                                    </div>
                                    <div className="text-xs text-slate-500">
                                      {ed.year || "—"}
                                    </div>
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
                            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">
                              Work Experience
                            </h2>
                            <div className="space-y-6 text-sm text-slate-700">
                              {values.experiences &&
                              values.experiences.length > 0 ? (
                                values.experiences.map((e, idx) => (
                                  <div key={idx}>
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="font-medium">
                                          {e.company || "—"}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                          {e.role || "—"}
                                        </div>
                                      </div>
                                      <div className="text-xs text-slate-500">
                                        {e.years+ " — " + (values.experiences[idx+1]?.years || "present")}
                                      </div>
                                    </div>
                                    {e.description && (
                                      <p className="mt-2 text-sm text-slate-600">
                                        {e.description}
                                      </p>
                                    )}
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
                <div className="mt-6 flex px-5 gap-3 justify-between items-center">
                  <div className="flex gap-3">
                    {currentStep > 0 && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep((s) => s - 1)}
                        className="rounded-full px-5 py-2 border"
                      >
                        Back
                      </button>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {currentStep < steps.length - 1 && (
  <button
    type="button"
    onClick={async () => {
      const ok = await validateStepAndShowAllErrors(
        validateForm,
        values,
        setTouched,
        currentStep // Pass current step
      );
      if (ok) setCurrentStep((s) => s + 1);
    }}
    className="rounded-full px-5 py-2 text-white font-semibold bg-primary"
  >
    Next
  </button>
)}

                    {currentStep === steps.length - 1 ? (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`rounded-full px-5 py-2 text-white font-semibold ${
                          isSubmitting ? "bg-[#B88E5299]" : "bg-primary"
                        }`}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </button>
                    ) : null}

                    <button
  type="button"
  onClick={() => {
    // 2) Clear API / UI state
    setApiError(null);
    setApiSuccess(null);
    setSubmitted(null);
    setGapPopup(false);
    setSelectedCountry(null);
    setSelectedCity(null);
    setSelectedArea(null);

    // 3) Reset Formik state (values, touched, errors) back to initialValues
    //    resetForm() will reset to the Formik initialValues you provided above.
    resetForm();

    // 4) Clear DOM file inputs (allowed to set to empty string)
    if (fileRef.current) fileRef.current.value = "";
    if (photoRef.current) photoRef.current.value = "";

    // 5) Reset stepper to first step & scroll to top
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }}
  className="rounded-full px-5 py-2 border"
>
  Reset
</button>
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