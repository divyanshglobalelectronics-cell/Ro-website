import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const Title = ({ children }) => (
  <h2 className="text-2xl font-semibold text-black flex items-center gap-2 mb-4">

    <FaCheckCircle className="text-[#6EC1E4]" />
    {children}
  </h2>
);


const TermsAndConditions = () => {
  return (
    <div className="min-h-screen py-12 px-4">

      {/* MAIN CONTAINER */}
     <div className="max-w-5xl mx-auto border border-[#DCE6EF]">


        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-black tracking-wide">

            Terms & Conditions
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            Please read these terms carefully before using our services.
          </p>
          <div className="w-24 h-1 bg-[#6EC1E4] mx-auto mt-4 rounded-full"></div>
        </div>

        {/* CONTENT WRAPPER */}
        <div className="space-y-10">
          {/* ---- EACH SECTION IN A CARD ---- */}
          {[
             {
              title: "User Agreement",
              text: 'Welcome to DIVYANSH GLOBAL RO. DIVYANSH GLOBAL RO provides its services to you subject to the following terms and conditions. If you access this website or visit www.divyanshglobalro.com or make a purchase, you accept these terms and conditions of use, as well as our other terms and conditions on this website, such as our Privacy Policy, Cancellation and Return Policy, Delivery Policy and Disclaimer. Please read them carefully. In addition, when you use any current or future DIVYANSH GLOBAL RO service on this website, you will also be subject to the guidelines and conditions applicable to such service. All products/services and information displayed on www.divyanshglobalro.com constitute an "invitation to offer". Your orders for purchase constitute your offer which shall be subject to the terms and conditions listed below. www.divyanshglobalro.com reserves the right to accept or reject your offer.'

            },
             {
              title: "Applicable Law",
              text: 'This site is created and controlled by DIVYANSH GLOBAL RO. The laws of India shall apply and courts in Delhi shall have jurisdiction in respect of all terms, conditions and disclaimers. DIVYANSH GLOBAL RO reserves the right to make changes to the website and the terms, conditions and disclaimers at any time and without notice to the customers/users of DIVYANSH GLOBAL RO  services/website.'

            },
             {
              title: "Definitions",
              text: '"Agreement" means the terms and conditions as detailed herein, including all schedules, appendices, annexures, privacy policy, etc., and will include the references to this agreement as amended, novated, supplemented, varied or replaced from time to time.  "www.divyanshglobalro.com" / "DIVYANSH GLOBAL RO" / "Website" means the online shopping platform and the services provided by it, which is owned and operated by DIVYANSH GLOBAL RO Ltd., which provides a platform to the users of www.divyanshglobalro.com to purchase the products listed on www.divyanshglobalro.com. "Seller" / "Vendor" / "Partner" means the person or legal entity that offers products for sale on www.divyanshglobalro.com."Customer" / "Buyer" means the person or legal entity that places an order on www.divyanshglobalro.com or purchases any product offered for sale through the www.divyanshglobalro.com platform. "User" / "You" means and includes any individual or entity or any legal entity accessing or using the services offered on this site. "Product/Products" means and includes any goods/merchandise/products/services/offers/display items uploaded/displayed on www.divyanshglobalro.com and related descriptions, information, processes, warranties, delivery schedules, etc.'

            },
             {
              title: "Electronic Communications",
              text: 'When you visit www.divyanshglobalro.com or send emails to us, you are communicating with us electronically. You consent to receive communications from us electronically. We will communicate with you by email or by posting notices on this website. You agree that all agreements, notices, disclosures and other communications that we provide to you electronically satisfy any legal requirement that such communications be in writing.'

            },
            {
              title: "Copyrights and Trademarks",
              text: 'Unless otherwise stated, all material presented on the site (including, but not limited to, text, audio, video or graphical images) is subject to copyright and all intellectual property rights, trademarks and logos appearing on this site are the property of DIVYANSH GLOBAL RO, its parent company, affiliates and associates and are protected under applicable Indian laws. You agree not to use any framing techniques to enclose any trademark or logo or other proprietary information of DIVYANSH GLOBAL RO. Any infringement will be strictly defended and prosecuted to the fullest extent permitted by law. Permission and Site Access, DIVYANSH GLOBAL RO. grants you a limited license to access and make personal use of this site and does not permit you to download or modify it, or any portion of it, except with the express prior written consent of DIVYANSH GLOBAL RO. This license does not include any resale or commercial use of this site or its contents; any collection and use of any product listings, descriptions, or prices; any derivative use of this site or its contents; any downloading or copying of account information for the benefit of another merchant; or any use of data mining, robots, or similar data gathering and extraction tools. This site or any portion of this site may not be reproduced, duplicated, copied, sold, resold, visited, or otherwise exploited for any commercial purpose without the express prior written consent of DIVYANSH GLOBAL RO. You may not utilize framing techniques to enclose any trademark, logo, or other proprietary information (including images, text, page layout, or form) of DIVYANSH GLOBAL RO. and our affiliates. You may not use any meta tags or any other "hidden text" utilizing DIVYANSH GLOBAL RO. name or trademarks without the express written consent of DIVYANSH GLOBAL RO. Any unauthorized use terminates the permission or license granted by DIVYANSH GLOBAL RO.'

            },
            {
              title: "Product Description",
              text: 'DIVYANSH GLOBAL RO. reserves the right to suspend/cancel, or discontinue any or all products or services at any time without notice, and may make changes and improvements to any or all content, products and services available on the site without prior notice. If any product offered by www.divyanshglobalro.com is not as described, your sole remedy is to return it to us in unused condition within 7 days of delivery.'

            },
            {
              title: "User Account",
              text: "Notwithstanding any other legal remedies available to DIVYANSH GLOBAL RO., DIVYANSH GLOBAL RO. may, in its sole discretion, immediately limit user activity, temporarily or indefinitely remove user listings, or suspend or terminate user membership, and/or refuse to provide the user with access to the site: if the user breaches any of the terms and conditions of this agreement and/or the terms and conditions of use of DIVYANSH GLOBAL RO.  If the user has provided false, incomplete or inaccurate informationIf your actions may cause harm, damage or loss to other users or DIVYANSH GLOBAL RO.Illegal and/or unauthorized use of the service, including unauthorized framing of or linking to the DIVYANSH GLOBAL RO. site, will be investigated, and appropriate legal action will be taken, including, without limitation, civil, criminal and injunctive remedies."

              
              
            },
            
            {
              title: "Risk of Loss",
              text: "All items purchased from www.divyanshglobalro.com are made pursuant to a shipment/dispatch contract. This means that the risk of loss and title for such items pass to you upon our delivery to the carrier/courier."
            },
            {
              title: "Force Majeure",
              text: "DIVYANSH GLOBAL RO. shall not be liable to you for any interruption or delay in access to the site, whatever the cause."
            },
            {
              title: "Policy Updates",
              text: "We reserve the right to change or update this policy at any time by posting a prominent notice on our site. Such changes will be effective immediately upon posting to this site. If any term or condition is deemed invalid, void, or for any reason unenforceable, that condition shall be deemed severable and shall not affect the validity and enforceability of any remaining terms and conditions."
            },
            {
              title: "Entire Agreement",
              text: "These Terms of Service constitute the entire agreement between the parties with respect to the subject matter hereof and supersede all prior or contemporaneous understandings or agreements, written or oral, with respect to such subject matter. The foregoing sections shall survive the termination or expiration of this agreement. General. No waiver of any term hereof shall be deemed a further or continuing waiver of such term or any other term. The individual agreeing to these Terms and Conditions of Use represents and warrants that such individual is authorized to bind their principal or employer and has the requisite legal capacity to enter into these Terms and Conditions of Use."
            },
            // {
            //   title: "Our Address",
            //   text: "DIVYANSH GLOBAL RO. Gaur city center, 7th Floor, Office no. O775, Greater Noida W Rd, near 4 murti, Gaur City 1, Sector 4, Greater Noida, Ghaziabad, Uttar Pradesh 201301"
            // },
            {
              title: "Disclaimer",
              text: "This site is provided to you by DIVYANSH GLOBAL RO. on an as is and as available basis. DIVYANSH GLOBAL RO. does not warrant that this site, its servers, or emails sent from www.divyanshglobalro.com are free of viruses and other harmful components."
            },
            {

              text: "DIVYANSH GLOBAL RO. makes every effort to present accurate and timely information about the products available for sale with us. However, it is possible that some discrepancies or errors may occur, in which case please inform us via email."
            },
            {
              text: "Not all products displayed in our catalog may be immediately available for sale due to product unavailability or other reasons. Information Liability In no event shall www.divyanshglobalro.com or any of its sources be liable for any direct, special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of business profits, business interruption, loss of business information, or any other pecuniary loss) arising out of the use of the information provided on this website."
            },
            {
      
              text: "The information provided on the www.divyanshglobalro.com website may not be reproduced, copied, or altered without the express written consent of www.divyanshglobalro.com and its affiliates."
            },
            
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl"



            >
              <Title>{item.title}</Title>
              <p className="text-gray-700 leading-relaxed">{item.text}</p>
            </div>
          ))}

          {/* ------ ADDRESS CARD ------- */}
          <div className="p-6 rounded-2xl bg-[#EAF7FF]">
            <h3 className="text-2xl font-bold text-[#0C62AB] mb-3">Our Address</h3>
            <p className="text-gray-700 leading-relaxed">
              <strong>DIVYANSH GLOBAL ELECTRONIC BAZAR</strong> <br />
              Gaur City Center, 7th Floor, Office No. O775,<br />
              Greater Noida W Rd, Near 4 Murti,<br />
              Gaur City 1, Sector 4, Greater Noida,<br />
              Ghaziabad, Uttar Pradesh – 201301<br />
              <br />
              
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;