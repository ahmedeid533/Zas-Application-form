import { useFormik } from 'formik';
import React from 'react'
import { GiEntryDoor } from "react-icons/gi";
import * as yup from 'yup'
import AuthMutation from '../../assets/apis/auth/AuthMutation';


function Login() {
    const {loginMutation}=AuthMutation();
    const schema=yup.object().shape({
        email:yup.string().required("Email is required").email("Email is not valid"),
        password:yup.string().required("Password is required").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/, "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number and one special character"),
    })

    const formik=useFormik({
        initialValues:{
            email:"",
            password:""
        },
        validationSchema:schema,
        onSubmit:(values)=>{
            console.log(values);
            loginMutation.mutate({username:values.email,password:values.password});
        }
    })
  return (
    <div className='w-screen h-screen bg-secondary flex items-center justify-center flex-col gap-5'>
        <div className="w-70">
            <img src='images/login-logo.png' alt="logo" className='w-full'/>
        </div>
        
        <form onSubmit={formik.handleSubmit} className='bg-[#525253] p-5 md:p-10 w-1/3 min-w-sm flex flex-col gap-5'>
              <input
              type="text"
              placeholder="Email Address"
              name='email'
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-0 border-b border-primary w-full py-3 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none focus:bg-[#464646] placeholder:text-gray-300 text-white"
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="text-red-500 text-sm">{formik.errors.email}</p>
            ) : null}
            <input
              type="password"
              placeholder="Password"
              name='password'
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border-0 border-b border-primary w-full py-3 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none focus:bg-[#464646] placeholder:text-gray-300 text-white"
            />
            {formik.touched.password && formik.errors.password ? (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            ) : null}

            <button
              type="submit"
              className="w-full bg-primary py-2 font-semibold text-white text-lg flex items-center justify-center gap-2 border border-primary hover:bg-transparent  transition-all duration-300"
            >
                <GiEntryDoor className="text-2xl"/>
              Login
            </button>
        </form>
      
    </div>
  )
}

export default Login
