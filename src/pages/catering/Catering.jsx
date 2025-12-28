import React, { useEffect } from 'react'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom';

function Catering() {
  const Navigate = useNavigate();
   useEffect(() => {
    window.scrollTo(0, 0);
  })
  return (
    <div>
      <div className=" flex gap-5 flex-col-reverse md:flex-row items-center px-18 bg-light-gray-100 py-24">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col items-center md:items-start "
        >
          <h2 className="md:text-5xl text-4xl">
            Private Jet{" "}
            <span className="text-primary font-bold">Air Catering</span>
          </h2>
          <p className="mt-4 mb-6 text-lg tracking-widest ">
            A second-to-none inflight catering experience for VIP travellers
          </p>
          <button
            style={{ paddingInline: "60px" }}
            className="global-btn btn-primary px-20 text-lg"
            onClick={() => Navigate("/menu")}
          >
            Air Catering Menu
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 pt-24"
        >
          <img
            src="/images/private-jet-aircatering-vip-cairo.jpg"
            className="w-full"
            alt="Home"
          />
        </motion.div>
      </div>
      <div
       className=" text-center xl:px-80 md:px-30 px-10 text-lg py-24 bg-[url('/images/executive-flight-meal-catering-egypt.png')] bg-fixed text-white ">
        <motion.div
        initial={{ opacity: 0, y: 50 }}
       viewport={{ once: true, amount: 0.3 }}
       whileInView={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5 }}
       className='flex flex-col gap-5'
       >

        <h1 className='uppercase text-primary text-5xl font-bold leading-16'>
          NEED PRIVATE JET CATERING <br />
          IN THE NEXT 24 HOURS?
        </h1>
        <p>
          We understand the conditions of private jets, and need for luxury
          aviation {" "}
              <a onClick={()=>Navigate("/inflight-meal-catering-egypt")} className=" underline hover:text-primary">
                in-flight meals
              </a>{" "}. Whether a top executive flight on a
          privately operated plane, a football team's big cabin aircraft, a
          chartered flight for a family holiday, or other air travel situations.
          We are here to assist you with the finest {" "}
              <a onClick={()=>Navigate("/inflight-meal-catering-egypt")} className=" underline hover:text-primary">
                in-flight catering
              </a>{" "}
        </p>
        <p>
          Strategically located near Cairo International Airport in Egypt, we
          are always at hand to serve private jets landing and departing. All we
          require is your in-flight meal choice from our air {" "}
              <a onClick={()=>Navigate("/menu")} className=" underline hover:text-primary">
                 catering menu
              </a>{" "} and
          dietary requirements, if any. Private jet air catering within 24 hours
          - we aim take care of you, and your aviation staff on the next flight!
        </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Catering
