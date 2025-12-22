import React from 'react'
import { motion } from "motion/react"

const data=[
  { key: "+93", label: "Afghanistan" },
  { key: "+358", label: "Aland Islands" },
  { key: "+355", label: "Albania" },
  { key: "+213", label: "Algeria" },
  { key: "+1684", label: "American Samoa" },
  { key: "+376", label: "Andorra" },
  { key: "+244", label: "Angola" },
  { key: "+1264", label: "Anguilla" },
  { key: "+672", label: "Antarctica" },
  { key: "+1268", label: "Antigua and Barbuda" },
  { key: "+54", label: "Argentina" },
  { key: "+374", label: "Armenia" },
  { key: "+297", label: "Aruba" },
  { key: "+61", label: "Australia" },
  { key: "+43", label: "Austria" },
  { key: "+994", label: "Azerbaijan" },
  { key: "+1242", label: "Bahamas" },
  { key: "+973", label: "Bahrain" },
  { key: "+880", label: "Bangladesh" },
  { key: "+1246", label: "Barbados" },
  { key: "+375", label: "Belarus" },
  { key: "+32", label: "Belgium" },
  { key: "+501", label: "Belize" },
  { key: "+229", label: "Benin" },
  { key: "+1441", label: "Bermuda" },
  { key: "+975", label: "Bhutan" },
  { key: "+591", label: "Bolivia" },
  { key: "+599", label: "Bonaire" },
  { key: "+387", label: "Bosnia and Herzegovina" },
  { key: "+267", label: "Botswana" },
  { key: "+55", label: "Brazil" },
  { key: "+246", label: "British Indian Ocean Territory" },
  { key: "+673", label: "Brunei" },
  { key: "+359", label: "Bulgaria" },
  { key: "+226", label: "Burkina Faso" },
  { key: "+257", label: "Burundi" },
  { key: "+855", label: "Cambodia" },
  { key: "+237", label: "Cameroon" },
  { key: "+1", label: "Canada" },
  { key: "+238", label: "Cape Verde" },
  { key: "+1345", label: "Cayman Islands" },
  { key: "+236", label: "Central African Republic" },
  { key: "+235", label: "Chad" },
  { key: "+56", label: "Chile" },
  { key: "+86", label: "China" },
  { key: "+57", label: "Colombia" },
  { key: "+269", label: "Comoros" },
  { key: "+242", label: "Congo" },
  { key: "+682", label: "Cook Islands" },
  { key: "+506", label: "Costa Rica" },
  { key: "+225", label: "Cote d'Ivoire" },
  { key: "+385", label: "Croatia" },
  { key: "+53", label: "Cuba" },
  { key: "+357", label: "Cyprus" },
  { key: "+420", label: "Czech Republic" },
  { key: "+45", label: "Denmark" },
  { key: "+253", label: "Djibouti" },
  { key: "+1767", label: "Dominica" },
  { key: "+1809", label: "Dominican Republic" },
  { key: "+593", label: "Ecuador" },
  { key: "+20", label: "Egypt" },
  { key: "+503", label: "El Salvador" },
  { key: "+240", label: "Equatorial Guinea" },
  { key: "+291", label: "Eritrea" },
  { key: "+372", label: "Estonia" },
  { key: "+251", label: "Ethiopia" },
  { key: "+33", label: "France" },
  { key: "+49", label: "Germany" },
  { key: "+30", label: "Greece" },
  { key: "+36", label: "Hungary" },
  { key: "+354", label: "Iceland" },
  { key: "+91", label: "India" },
  { key: "+62", label: "Indonesia" },
  { key: "+98", label: "Iran" },
  { key: "+964", label: "Iraq" },
  { key: "+353", label: "Ireland" },
  { key: "+972", label: "Israel" },
  { key: "+39", label: "Italy" },
  { key: "+81", label: "Japan" },
  { key: "+962", label: "Jordan" },
  { key: "+254", label: "Kenya" },
  { key: "+965", label: "Kuwait" },
  { key: "+961", label: "Lebanon" },
  { key: "+352", label: "Luxembourg" },
  { key: "+60", label: "Malaysia" },
  { key: "+52", label: "Mexico" },
  { key: "+212", label: "Morocco" },
  { key: "+95", label: "Myanmar" },
  { key: "+31", label: "Netherlands" },
  { key: "+64", label: "New Zealand" },
  { key: "+234", label: "Nigeria" },
  { key: "+47", label: "Norway" },
  { key: "+92", label: "Pakistan" },
  { key: "+63", label: "Philippines" },
  { key: "+48", label: "Poland" },
  { key: "+351", label: "Portugal" },
  { key: "+974", label: "Qatar" },
  { key: "+40", label: "Romania" },
  { key: "+7", label: "Russia" },
  { key: "+966", label: "Saudi Arabia" },
  { key: "+65", label: "Singapore" },
  { key: "+27", label: "South Africa" },
  { key: "+34", label: "Spain" },
  { key: "+94", label: "Sri Lanka" },
  { key: "+46", label: "Sweden" },
  { key: "+41", label: "Switzerland" },
  { key: "+66", label: "Thailand" },
  { key: "+90", label: "Turkey" },
  { key: "+971", label: "United Arab Emirates" },
  { key: "+44", label: "United Kingdom" },
  { key: "+1", label: "United States" },
  { key: "+84", label: "Vietnam" },
  { key: "+967", label: "Yemen" },
  { key: "+260", label: "Zambia" },
  { key: "+263", label: "Zimbabwe" }
]

function Request() {
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

        <form className='w-full flex flex-col items-center'>
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
              className="border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none"
            />

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
            className="w-full flex items-center md:gap-9 flex-col md:flex-row "
          >
            <select className='border-0 border-b border-primary w-full py-4 transition-all duration-300 ps-0 focus:ps-5 focus:outline-none' name="" id="">
              <option value="">Select Country</option>
              {data.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
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
              placeholder="Additional Information (Optional)"
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
            <button type='submit' className='global-btn btn-primary w-60 text-center text-lg'>SEND REQUSET</button>
          </motion.div>
        </form>
      </div>
  )
}

export default Request
