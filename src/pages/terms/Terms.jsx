import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
function Terms() {
  const navigate = useNavigate();
  return (
    <div>
      <div className=" flex gap-8 flex-col-reverse md:flex-row items-center xl:px-18 lg:px-12 md:px-8 px-4 bg-light-gray-100 py-24">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2 w-full flex flex-col items-center md:items-start pt-20 text-center md:text-left"
        >
          <h2 className="md:text-5xl text-4xl mb-6">
            Website <span className="text-primary font-bold">Terms</span>
          </h2>
          <p className="mt-4 mb-3 text-lg tracking-widest ">
            Thank you for accessing skyculinaire.com, the website for SKY
            CULINAIRE via www.skyculinaire.com
          </p>
          <p className="mt-4 mb-6 text-lg tracking-widest ">
            The following are the website terms and conditions (the "Terms")
            that SKY CULINAIRE applies to its content on
            https://skyculinaire.com (the "Website"). In these Conditions, "you"
            and "your" means any and all persons using this Website. Please read
            these Terms if using the Website.
          </p>
        </motion.div>
      </div>

      <div className="bg-secondary-100 flex flex-col gap-12 py-20 text-white px-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">1. Website Usage</h3>
          <p>
            The terms and conditions mentioned herein will apply to: (a) your
            use of our Website; (b) our supply of products and services; and (c)
            our dealings with you. By entering, accessing or using our web site
            in any way, you agree to comply with our terms and conditions. If
            you do not accept our terms and conditions in full, you must stop
            using our web site and.
          </p>
          <p>
            It is a condition of use for this Website that only people aged 21
            or over are allowed to submit on-line requests.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">2. Your Conduct</h3>
          <p>
            The Content on this web site is for your personal use only within
            the organisation or entity to which you are attached and it is not
            for intended for commercial exploitation unless agreed in writing
            between both parties by the relevant competent authorizing
            individual and or department within SKY CULINAIRE.
          </p>
          <p>
            You may not modify, disassemble, lease, rent, transmit, re-transmit,
            sell, sublicense or otherwise create derivative works for commercial
            or non-commercial exploitation by yourself or the organisation or
            entity to which you are attached or permit third parties to so do.
            Unlimited or wholesale reproduction, copying of the content for
            commercial or non-commercial purposes and unwarranted modification
            of data and information within the Content is not permitted.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">3. Intellectual Property Rights</h3>
          <p>
            All property information content made available on this web site
            including, but not limited to text, data, graphics, and icons, are
            copyrighted materials owned by SKY CULINAIRE, including its
            affiliates or subsidiaries. SKY CULINAIRE, https://skyculinaire.com/
            and other unique resource locators (URL) and or other SKY CULINAIRE'
            logos and product and service names are copyright of SKY CULINAIRE,
            which are protected by applicable laws of Egypt and EU countries.
            All rights are reserved.
          </p>
          <p>
            You are not permitted to incorporate any SKY CULINAIRE content into
            any other trademarks, service marks, company names, Internet
            addresses, domain names, or any other similar designations. Any
            unauthorized use of any materials contained on this web site may
            violate copyright laws, trademark laws, the laws of privacy and
            publicity, and communications regulations and statutes.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">4. Governing Law and Jurisdiction</h3>
          <p>
            This web site Terms of Use Agreement shall be governed by the laws
            of the Arab Republic of Egypt. By accessing this web site you are
            agreeing that the Courts of Egypt will deal with any disputes, which
            may arise between you and us, and that Egyptian law shall be the
            applicable law.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">5. Third Party Content and Links</h3>
          <p>
            SKY CULINAIRE reserves the right to make alterations to products and
            services from time to time in the interests of maintenance, re-use,
            accuracy, and usefulness. SKY CULINAIRE warrants that all reasonable
            endeavours to ensure such material(s) is free of intellectual
            property infringement insofar that this is possible, will be taken.
          </p>
          <p>
            SKY CULINAIRE may terminate the availability of such external
            resources and sites through links on its web site at any time. SKY
            CULINAIRE will not be responsible or liable, directly or indirectly,
            for any damage or loss caused or alleged to be caused by or in
            connection with use of or reliance on any such content, products,
            goods or services available on or through these channels.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">6. Disclaimer of Warranties</h3>
          <p>
            The information on the Website pages may be updated from time to
            time and may at times be out of date. We accept no responsibility
            for keeping the information on these pages up to date or liability
            for failureYou have sole responsibility for adequate protection and
            backup of data and / or equipment used in connection with the
            Website, and will not make a claim against SKY CULINAIRE for lost
            data, inaccurate output, work delays or lost profits resulting from
            the use of the materials. You agree to hold SKY CULINAIRE harmless
            from any damage caused, and agree not to sue SKY CULINAIRE for any
            claims based on using this Website. to do so. SKY CULINAIRE
            disclaims all responsibility for any loss, injury, claim, liability
            or damages of any kind arising from the use of this Website or
            access to third party links, contents or sites via this Website. SKY
            CULINAIRE does not warrant that access to this Website or linked
            websites will be available at all times, but it will take all
            necessary steps to rectify any fault(s) as soon reasonably
            practicable.
          </p>
          <p>
            Any material downloaded or otherwise obtained through the use of
            this Website is done at your own discretion and risk. You are solely
            responsible for any damage to your computer system, or loss of data
            that may occur following the download of any such material. No
            advice or information, whether oral or written, obtained by you from
            SKY CULINAIRE or through from this Website will create any warranty
            not expressly stated in the terms. SKY CULINAIRE employees are NOT
            authorized to alter these terms.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">7. Privacy</h3>
          <p>
            SKY CULINAIRE is committed to maintaining the privacy of those using
            its web site and has a privacy policy that governs the treatment of
            any personal information received through your visit to its web
            site. Your use of this web site is subject to SKY CULINAIRE's
            privacy policy, which can be accessed via URL:{" "}
            <a
              className="underline cursor-pointer"
              onClick={() => {
                navigate("/privacy-policy");
              }}
            >
              https://skyculinaire.com/privacy-policy
            </a>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">8. Liability</h3>
          <p>
            SKY CULINAIRE can only accept responsibility for any Terms &
            Conditions from the time a binding legal contract between us comes
            into existence. We cannot, however, accept any other liability
            whatsoever.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">9. Severability</h3>
          <p>
            If a court of competent jurisdiction finds any provision of the
            Terms of Use to be invalid, the parties nevertheless agree that the
            court should endeavour to give effect to the parties' intentions as
            reflected in the provision, and the other provisions of the Terms of
            Use remain in full force and effect.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">10. No Waiver</h3>
          <p>
            The failure of SKY CULINAIRE to exercise or enforce any right or
            provision of this Terms of Use does not constitute a waiver of such
            right or provision.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Terms;
