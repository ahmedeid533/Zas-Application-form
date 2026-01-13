import React, { useEffect } from 'react'
import { motion } from "motion/react"
import { FaPhoneAlt } from "react-icons/fa";

function Contact() {
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
          CONTACT SKY CULINAIRE <span className="text-primary font-bold">CATERING</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full text-xl"
        >
          We look forward to hearing from you and catering for all your requests.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex gap-4 w-full"
        >
            <FaPhoneAlt className='text-primary text-2xl'/>
            <div className="text-xl">
                <p>(+20) 1066668178</p>
                <p> (+202) 22693134/ 22693135/ 22693136</p>
            </div>
          
        </motion.div>
        <form className='w-full flex flex-col items-center'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full "
          >
            <input
              type="text"
              placeholder="Full Name"
              className="border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none"
            />
            </motion.div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <input
              type="text"
              placeholder="Company Name"
              className="border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none"
            />
            </motion.div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full"
          >
            <input
              type="text"
              placeholder="Phone Number"
              className="border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none"
            />
            </motion.div><motion.div
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 ,delay: 0.6}}
            className="w-full"
          >
            <input
              type="text"
              placeholder="Email Address"
              className="border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none"
            />
            </motion.div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 ,delay: 0.8}}
            className="w-full"
          >
            <textarea
              type="text"
              placeholder="message"
              rows={5}
              className="border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none"
            />
            </motion.div>
            <motion.div
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 ,delay: 1}}
            className="py-10"
          >
            <button type='submit' className='global-btn btn-primary w-60 text-center text-lg'>SEND</button>
          </motion.div>
        </form>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-4xl "
        >
            For your air catering needs, simply let us know your in-flight meal requirements.
        </motion.p>
      </div>
  )
}

export default Contact
