import React, { useEffect } from 'react'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom';


function About() {
  const navigate=useNavigate();
   useEffect(() => {
    window.scrollTo(0, 0);
  },[])
  return (
    <div>
      <div className=" flex gap-8 flex-col-reverse md:flex-row items-center xl:px-18 lg:px-12 md:px-8 px-4 bg-light-gray-100 py-24">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col items-center md:items-start "
        >
          <h2 className="md:text-5xl text-4xl">
            About <span className="text-primary font-bold">Us</span>
          </h2>
          <p className="mt-4 mb-6 text-lg tracking-widest ">
            Sky Culinaire, established in 2019, is deeply routed in the aviation industry. Since its inception Sky Culinaire has been dedicated to delivering exceptional dining experiences to its clients, with a focus on quality and attention to detail.
          </p>
          <p className="mt-4 mb-6 text-lg tracking-widest ">
Situated within Cairo International Airport, our custom-built facility is strategically located just 5 minutes away from where private jets are stationed, ensuring that every meal is delivered exceptionally fresh and promptly to our esteemed clients.          </p>
          
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 pt-24"
        >
          <img
            src="images/air-catering-sky-culinaire.jpg"
            className="w-full"
            alt=""
          />
        </motion.div>
      </div>

      <div className="bg-secondary-100 py-20">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                viewport={{ once: true, amount: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }} 
                className="flex flex-col md:flex-row gap-11 md:text-left justify-between"
              >
                <img
                  src="/images/flight-catering-cairo-sky-culinaire.jpg"
                  className="w-3/4 max-w-xl flex-1"
                  alt=""
                />
                <div className="px-5 md:ps-0 md:pe-14 w-full md:w-1/2">
                  <h2 className="md:text-5xl text-4xl text-white mb-6">
                    Why <span className="text-primary font-bold">Sky Culinaire?</span>
                  </h2>
                  <p className="mt-4 mb-6 text-white leading-6 tracking-widest ">
                    <span className='font-bold'>Executive Quality</span><br/>
Our culinary artisans craft gastronomic masterpieces, elevating inflight dining to an art form that delights the most refined palates.
                  </p>
                  <p className="mt-4 mb-6 text-white leading-6 tracking-widest ">
                    <span className='font-bold'>Impeccable Service</span><br/>
We embody the pinnacle of hospitality, providing personalized and attentive service that surpasses expectations.                  </p>
                  <p className="mt-4 mb-6 text-white leading-6 tracking-widest ">
                    <span className='font-bold'>Flexibility and Elegance</span><br/>
Our customised <a onClick={()=>navigate("/menu")} className='underline hover:text-primary'> menus </a> and seamless catering solutions epitomize luxury and sophistication, catering to the diverse tastes and preferences of our esteemed clients.                  </p>
                  <p className="mt-4 mb-6 text-white leading-6 tracking-widest ">
                    <span className='font-bold'>Safety and Compliance</span><br/>
Sky Culinaire is ISO-certified and adheres to the strictest safety regulations, ensuring unparalleled food safety and compliance with international standards.
                  </p>
                </div>
              </motion.div>

            </div>
    </div>
  )
}

export default About
