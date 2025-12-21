import React from 'react'
import { motion } from "motion/react"
function Home() {
  return (
    <div className="">
      {/* hero */}
      <div className="pt-24 flex gap-5 flex-col-reverse md:flex-row items-center px-18 bg-light-gray-100 py-24">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col items-center md:items-start"
        >
          <h2 className="md:text-5xl text-4xl">
            Experience Fine{" "}
            <span className="text-primary font-bold">Catering</span>
          </h2>
          <p className="mt-4 mb-6 text-lg tracking-widest ">
            Delightful and enjoyable inflight catering experience
          </p>
          <button
            style={{ paddingInline: "60px" }}
            className="global-btn btn-primary px-20 text-lg"
          >
            View Catering Menu
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <img
            src="/images/in-flight-meals-egypt-skyculinaire.png"
            className="w-full"
            alt="Home"
          />
        </motion.div>
      </div>
      {/* about */}
      <div className="flex items-center flex-col md:flex-row gap-12 bg-secondary-100 py-14">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col gap-11 md:text-left"
        >
          <img
            src="/images/private-jet-catering-egypt-caviar.png"
            className="w-3/4 max-w-xl"
            alt=""
          />
          <div className="px-5 md:pe-0 md:ps-14">
            <h2 className="md:text-5xl text-4xl text-white">
              Freshly <span className="text-primary font-bold">Prepared</span>
            </h2>
            <p className="mt-4 mb-6 text-white leading-8 text-lg">
              Our executive chefs focus on small-batch, made-from-scratch
              cooking, with the most of ingredients procured only as requested.
              Your{" "}
              <a href="#" className=" underline hover:text-primary">
                in-flight catering
              </a>{" "}
              orders are made from high-quality, fresh, seasonal ingredients
              delivered by trusted sources. If you are seeking VIP air catering
              in Egypt - look no further!
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col md:flex-col-reverse gap-11  items-end  md:text-left"
        >
          <img
            src="images/food-catering-prawns-vip-events-cairo.png"
            className="w-3/4 max-w-xl"
            alt=""
          />
          <div className="px-5 md:ps-0 md:pe-14">
            <h2 className="md:text-5xl text-4xl text-white">
              Private Jets{" "}
              <span className="text-primary font-bold">Catering</span>
            </h2>
            <p className="mt-4 mb-6 text-white leading-8 text-lg">
              With Sky Culinaire, the priority of each of our{" "}
              <a href="#" className=" underline hover:text-primary">
                food menu
              </a>{" "}
              offerings is on culinary excellence.{" "}
              <a href="#" className=" underline hover:text-primary">
                Air catering for private jets,
              </a>{" "}
              , we continue to deliver the finest quality goods and services
              tailored to the needs of our customers. Delightful and enjoyable
              in-flight catering experience, no matter where your point of
              departure is.
            </p>
          </div>
        </motion.div>
      </div>
      {/* vip */}
      <div id='work' className="">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:text-5xl text-4xl ps-8 py-12"
        >
          VIP <span className="text-primary font-bold">AIR CATERING</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center flex-wrap"
        >
          <div className="lg:w-1/4 md:w-1/2 w-full">
            <img
              src="images/gourmet-food-catering-flights-egypt.jpg"
              className="w-full"
            />
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full">
            <img
              src="images/gourmet-inflight-catering-sky-culinaire-egypt.jpg"
              className="w-full"
            />
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full">
            <img
              src="images/prawn-caviar-toast-flight-food-cairo.jpg"
              className="w-full"
            />
          </div>
          <div className="lg:w-1/4 md:w-1/2 w-full">
            <img
              src="images/veal-and-vegetables-in-flight-meal-egypt.jpg"
              className="w-full"
            />
          </div>
        </motion.div>
      </div>
      {/* FOOD CUISINES */}
      <div className="bg-light-gray-100">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:text-5xl text-4xl ps-8 py-12 text-center md:text-left"
        >
          VIP <span className="text-primary font-bold">AIR CATERING</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center flex-wrap px-6 md:px-10 lg:px-16"
        >
          <div className=" md:w-1/4 w-full h-60 flex items-center justify-center p-9">
            <img
              src="icons/asian-cuisine-catering-cairo-egypt.png"
              className="h-full w-auto  overflow-visible"
            />
          </div>
          <div className=" md:w-1/4 w-full h-60 flex items-center justify-center p-9 ">
            <img
              src="icons/catering-italian-cuisine-cairo-egypt.png"
              className="h-full w-auto  overflow-visible"
            />
          </div>
          <div className=" md:w-1/4 w-full h-60 flex items-center justify-center p-9 ">
            <img
              src="icons/egyptian-cuisine-catering-vip-flights.png"
              className="h-full w-auto  overflow-visible"
            />
          </div>
          <div className=" md:w-1/4 w-full h-60 flex items-center justify-center p-9 ">
            <img
              src="icons/gulf-cuisine-business-jet-meals-egypt.png"
              className="h-full w-auto  overflow-visible"
            />
          </div>
          <div className=" md:w-1/3 lg:w-1/4 w-full h-60 flex items-center justify-center p-9 ">
            <img
              src="icons/inflight-meals-french-cuisine-skyculinaire.png"
              className="h-full w-auto  overflow-visible"
            />
          </div>
          <div className=" md:w-1/3 lg:w-1/4 w-full h-60 flex items-center justify-center p-9 ">
            <img
              src="icons/middle-eastern-cooking-catering-egypt.png"
              className="h-full w-auto  overflow-visible"
            />
          </div>
          <div className=" md:w-1/3 lg:w-1/4 w-full h-60 flex items-center justify-center p-9 ">
            <img
              src="icons/mediterranean-cuisine-executive-flights-egypt.png"
              className="h-full w-auto  overflow-visible"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center py-6"
        >
          <button
            style={{ padding: "8px 100px" }}
            className="global-btn btn-primary text-lg"
          >
            Catering Menu
          </button>
        </motion.div>
      </div>
      <div className="bg-secondary-100">
        <div className="flex flex-col md:flex-row items-stretch justify-center">
          <div className="w-full md:w-1/2">
            <img
              src="images/air-catering-assistant-cairo-egypt.png"
              className="md:min-w-125 md:h-full md:max-w-max"
              alt=""
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col justify-center px-3 py-8">
            <h2 className="text-primary uppercase text-4xl leading-16 font-bold">
              YOUR PERSONAL CONCIERGE IS READY TO ASSIST YOU
            </h2>
            <p className="mt-4 mb-6 text-white leading-8 text-lg">
              With only one phone call, you'll be directly connected to the Sky
              Culinaire Worldwide Network's global range of built and operated
              kitchens, as well as an increasing range of air catering partners.
              Our{" "}
              <a href="#" className=" underline hover:text-primary">
                in-flight catering staff
              </a>{" "}
              is standing by to assist you.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-9">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:text-5xl text-4xl py-12 text-center"
        >
          CATERING <span className="text-primary font-bold">ENQUIRY</span>
        </motion.h2>
        <form className='w-full px-10 flex flex-col items-center'>
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
      </div>
    </div>
  );
}

export default Home
