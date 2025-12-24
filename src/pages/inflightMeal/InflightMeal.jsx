import React, { useEffect } from 'react'
import { motion } from "motion/react"

function InflightMeal() {
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
          className="flex-1 flex flex-col items-center md:items-start text-center "
        >
          <h2 className="md:text-5xl text-4xl">
            In-flight <span className="text-primary font-bold">Catering</span>
          </h2>
          <p className="mt-4 mb-6 text-lg tracking-widest ">
            Sumptuous meals prepared to perfection for business flights, to
            enhance your journey.
          </p>
          <button
            style={{ paddingInline: "60px" }}
            className="global-btn btn-primary px-20 text-lg"
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
            src="images/in-flight-meals-private-business-jet-egypt.jpg"
            className="w-full"
            alt=""
          />
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row gap-12 bg-secondary-100 py-14">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col gap-11 md:text-left justify-between"
        >
          <img
            src="/images/air-catering-assistant-cairo-egypt.png"
            className="w-3/4 max-w-xl"
            alt=""
          />
          <div className="px-5 md:pe-0 md:ps-14">
            <h2 className="md:text-5xl text-4xl text-white">
              Aviation Meals{" "}
              <span className="text-primary font-bold">24 hours</span>
            </h2>
            <p className="mt-4 mb-6 text-white leading-8 text-lg">
              Our executive chefs are able and ready to cater for urgent flight
              meal requests, and their culinary expertise cover a wide variety
              of{" "}
              <a href="#" className=" underline hover:text-primary">
                cooking cuisines
              </a>{" "}
              . From Asian, to French cuisine, Mediterranean to Egyptian cooking
              and much more. Our clients need only to choose from our{" "}
              <a href="#" className=" underline hover:text-primary">
                food menu
              </a>{" "}
              , and we will cater for the rest, including dietary requirements,
              food allergies, beverages and dish accessories.
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col md:flex-col-reverse gap-11 justify-between  items-end  md:text-left"
        >
          <img
            src="images/private-jet-catering-egypt-caviar.png"
            className="w-3/4 max-w-xl"
            alt=""
          />
          <div className="px-5 md:ps-0 md:pe-14">
            <h2 className="md:text-5xl text-4xl text-white">
              Prepared with <span className="text-primary font-bold">Care</span>
            </h2>
            <p className="mt-4 mb-6 text-white leading-8 text-lg">
              We specialise in catering for VIP private jets, and take pride in
              serving our food on executive business flights. Our in-flight {" "}
              <a href="#" className=" underline hover:text-primary">
                air catering
              </a>{" "} adheres to stringent cooking methods at specific
              temperatures, at our highly hygienic catering facility near Cairo
              International Airport, before carefully packaging for secure
              transport.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default InflightMeal
