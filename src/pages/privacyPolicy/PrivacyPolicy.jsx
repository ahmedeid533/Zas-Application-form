import React from "react";
import { motion } from "motion/react";
function PrivacyPolicy() {
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
          <h2 className="md:text-5xl text-4xl">
            Privacy <span className="text-primary font-bold">Policy</span>
          </h2>
          <p className="mt-4 mb-6 text-lg tracking-widest ">
            We regard our site visitors' privacy with importance, and comply
            with Data Protection laws. We aim to help you understand the terms
            and conditions regarding our collection, and use of such private
            information.{" "}
          </p>
          <p className="mt-4 mb-6 text-lg tracking-widest ">
            This privacy statement discloses the types of information we gather,
            how we use it, and how we may correct or change it. These privacy
            practices apply to the SKY CULINAIRE website that you were viewing,
            when you clicked through to this privacy policy.
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
          <h3 className="text-2xl">What information do we collect?</h3>
          <p>
            We only collect personally identifiable information that you provide
            to us, for example, when you contact us online. Such personal
            information is limited to your:
          </p>
          <ul className="list-disc ps-10">
            <li>Name</li>
            <li>Email Adderss</li>
            <li>Phone Number</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">How do we use the information?</h3>
          <p>We use the information we receive for the general purpose, to:</p>
          <ul className="list-disc ps-10">
            <li>
              Fulfil your request(s) for any product(s) and / or service(s) that
              we offer on our website: www.skyculinaire.com
            </li>
            <li>To send you information you agreed / requested to receive.</li>
          </ul>

          <p>
            Any personal information you may send us will only be used for the
            sole purpose(s) which you provided it for. Furthermore, it will be
            only:
          </p>
          <ul className="list-disc ps-10">
            <li>
              Held for as long as necessary for these purposes and we will not
              pass it to any other parties unless this is made clear to you;
            </li>
            <li>
              Accessed by our employee(s) associated with the handling of that
              data and with the obligation to respect the confidentiality of
              your personal data.
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">How do we share the information?</h3>
          <p>
            We do not share any data with 3rd parties. We will only make your
            personally identifiable information available to other companies or
            people when:
          </p>
          <ul className="list-disc ps-10">
            <li>We have your consent to share the information</li>
            <li>
              We have engaged companies to work with us or on our behalf to
              provide an product or service that you have requested
            </li>
            <li>
              We respond to appeals, court orders, or legal process; or we
              believe that your actions violate applicable laws.
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">
            What are your options as website visitor?
          </h3>
          <p>
            Any user who does not wish to provide any personal data requested by
            our contact form need not register with us, and can further access
            the website and its content. Users who opt-in may also remove
            themselves from our mailing list at any time by sending an
            (unsubscribe) email to info@skyculinaire.com
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">
            How will the website user know if the privacy policy is changed?
          </h3>
          <p>
            Any modifications to our privacy practices will be reflected first
            within this area of our Website (www.skyculinaire.com). If there is
            a material change in our privacy practices, we will indicate on our
            site that our privacy practices have changed, and provide a link to
            the new privacy statement. If we ever consider using the information
            collected from users in a manner materially different from that
            stated at the time of collection we will send affected users written
            notice by email of the change beforehand.
          </p>
          <p>
            Please check this page for any changes to our privacy policy, and
            note that your continued use of this site will constitute your
            agreement to any changed Terms and Policies.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">How do we share the information?</h3>
          <p>
            We do not share any data with 3rd parties. We will only make your
            personally identifiable information available to other companies or
            people when:
          </p>
          <ul className="list-disc ps-10">
            <li>We have your consent to share the information.</li>
            <li>
              We have engaged companies to work with us or on our behalf to
              provide an product or service that you have requested.
            </li>
            <li>
              We respond to appeals, court orders, or legal process; or we
              believe that your actions violate applicable laws.
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">
            What are your options as website visitor?
          </h3>
          <p>
            Any user who does not wish to provide any personal data requested by
            our contact form need not register with us, and can further access
            the website and its content. Users who opt-in may also remove
            themselves from our mailing list at any time by sending an
            (unsubscribe) email to info@skyculinaire.com
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3 "
        >
          <h3 className="text-2xl">
            How will the website user know if the privacy policy is changed?
          </h3>
          <p>
            Any modifications to our privacy practices will be reflected first
            within this area of our Website (www.skyculinaire.com). If there is
            a material change in our privacy practices, we will indicate on our
            site that our privacy practices have changed, and provide a link to
            the new privacy statement. If we ever consider using the information
            collected from users in a manner materially different from that
            stated at the time of collection we will send affected users written
            notice by email of the change beforehand.
          </p>
          <p>
            Please check this page for any changes to our privacy policy, and
            note that your continued use of this site will constitute your
            agreement to any changed Terms and Policies.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
