import React, { useEffect } from 'react'
import { motion } from "motion/react"
import { useFormik } from 'formik'
import * as yup from 'yup'
import { GetCountriesCodes } from '../../assets/apis/country/Country'
import { useQuery } from '@tanstack/react-query'
import AuthMutation from '../../assets/apis/auth/AuthMutation'



function Request() {
  const {AskToRegister}=AuthMutation()
  const schema = yup.object().shape({
  mobil: yup
    .string()
    .required("phone number is required")
    .matches(/^[0-9]{8,14}$/, "Phone number is not valid"),

  companyAddetionalInfo: yup
    .string(),

  email: yup
    .string()
    .required("Email is required")
    .email("Email is not valid"),

  contryID: yup
    .string()
    .required("The country is required"),

  companyName: yup
    .string()
    .required("Company name is required"),

  companyPersonalName: yup
    .string()
    .required("Name is required"),

});

  const {data:countries,isLoading}=useQuery({queryKey:["countries"],queryFn:GetCountriesCodes})
  useEffect(()=>{
    console.log("countries",countries);

    
  },[countries])
  const formik = useFormik({
    initialValues: {
      mobil: "",
      companyAddetionalInfo: "",
      email: "",
      contryID: "",
      companyName: "",
      companyPersonalName: "",
      subscribe: false,
      password:"Sky@1234"
    },
    validationSchema: schema,
    onSubmit: (values) => {
      
      console.log(values);
      AskToRegister.mutate({...values,contryID:Number(values.contryID)});
    },
  });
   useEffect(() => {
    window.scrollTo(0, 0);
  },[])
  return (
    <div className="flex flex-col items-center gap-9 py-24 bg-light-gray-100 xl:px-50 lg:px-30 md:px-20 px-10">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:text-5xl text-4xl py-12 "
        >
          FOOD MENU <span className="text-primary font-bold">REQUEST</span>
        </motion.h2>

        <form onSubmit={formik.handleSubmit} className='w-full flex flex-col items-center'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex items-center md:gap-9 flex-col md:flex-row "
          >
            <input
              type="text"
              placeholder="Name"
              name='companyPersonalName'
              value={formik.values.companyPersonalName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none"
            />
          {(formik.errors.companyPersonalName && formik.touched.companyPersonalName)&&<div className="w-full text-red-400 md:hidden ">{formik.errors.companyPersonalName}</div>}


            <input
              type="text"
              placeholder="Company Name"
              name='companyName'
              value={formik.values.companyName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none"
            />
              {(formik.errors.companyName && formik.touched.companyName)&&<div className="w-full text-red-400 md:hidden">{formik.errors.companyName}</div>}

            </motion.div>
            <div className="items-center w-full text-red-400 hidden md:flex">
              {<div className="w-1/2">{ (formik.errors.companyPersonalName && formik.touched.companyPersonalName)&&formik.errors.companyPersonalName}</div>}
              {<div className="w-1/2">{(formik.errors.companyName && formik.touched.companyName)&&formik.errors.companyName}</div>}
            </div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full flex items-center md:gap-9 flex-col md:flex-row "
          >
            <select
            name='contryID'
            value={formik.values.contryID}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
             className='border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none'>
              <option value="">Select Country</option>
              {countries?.length > 0 && countries.map((item) => (
                <option key={item.countryId} value={item.countryId}>
                  {item.countryName + " (" + item.countryCode + ")"}
                </option>
              ))}
            </select>
          {(formik.errors.contryID && formik.touched.contryID)&&<div className="w-full text-red-400 md:hidden ">{formik.errors.contryID}</div>}

            <input
              name='mobil'
              value={formik.values.mobil}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              placeholder="Phone Number"
              className="border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none"
            />
          {(formik.errors.mobil && formik.touched.mobil)&&<div className="w-full text-red-400 md:hidden ">{formik.errors.mobil}</div>}

            </motion.div>
             <div className="items-center w-full text-red-400 hidden md:flex">
              {<div className="w-1/2">{ (formik.errors.contryID && formik.touched.contryID)&&formik.errors.contryID}</div>}
              {<div className="w-1/2">{(formik.errors.mobil && formik.touched.mobil)&&formik.errors.mobil}</div>}
            </div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 ,delay: 0.6}}
            className="w-full"
          >
            <input
              type="text"
              name='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Email Address"
              className="border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none"
            />
            </motion.div>
            <div className="items-center w-full text-red-400 flex">
              {<div className="w-1/2">{ (formik.errors.email && formik.touched.email)&&formik.errors.email}</div>}
            </div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 ,delay: 0.8}}
            className="w-full"
          >
            <textarea
              type="text"
              name='companyAddetionalInfo'
              value={formik.values.companyAddetionalInfo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Additional Information (Optional)"
              rows={5}
              className="border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none"
            />
            </motion.div>
            <div className="items-center w-full text-red-400 flex">
              {<div className="w-1/2">{ (formik.errors.companyAddetionalInfo && formik.touched.companyAddetionalInfo)&&formik.errors.companyAddetionalInfo}</div>}
            </div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 ,delay: 1}}
            className="py-10"
          >
            <button type='submit' className='global-btn btn-primary w-60 text-center text-lg'>SEND REQUSET</button>
          </motion.div>
        </form>
      </div>
  )
}

export default Request
