import React from "react";
import {
  FaUniversity,
  FaUser,
  FaHashtag,
  FaFileInvoiceDollar,
} from "react-icons/fa";
// import { motion } from "framer-motion";

const PaymentDetails = ({ payment }) => {
  const url = import.meta.env.VITE_IMG_URL;

  return (
    <section
      className="py-10 bg-gradient-to-br from-white via-gray-100 to-gray-200"
      id="payment-details"
    >
      <div className="container mx-auto px-2 sm:px-4 max-w-5xl">
        <div
          // initial={{ opacity: 0, y: 50 }}
          // whileInView={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.6, ease: "easeOut" }}
          // viewport={{ once: true }}
          className="bg-white/90 backdrop-blur-md rounded-2xl p-1 sm:p-10 shadow-xl"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-color mb-10 text-center">
            Payment Details
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center justify-center">
            {/* Payment Info */}
            {/* <div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }} */}
              <div
              className="w-full lg:w-1/2 space-y-6 text-gray-800 border border-gray-200 p-6 rounded-xl bg-white/70 shadow-md"
            >
              {[
                {
                  icon: <FaUniversity className="text-yellow-500 mt-1 mr-3 text-xl" />,
                  label: "Bank",
                  value: payment.bankName || '-',
                },
                {
                  icon: <FaUser className="text-yellow-500 mt-1 mr-3 text-xl" />,
                  label: "Account Holder",
                  value: payment.accountHolderName || '-',
                },
                {
                  icon: <FaHashtag className="text-yellow-500 mt-1 mr-3 text-xl" />,
                  label: "Account No",
                  value: payment.accountNo || '-',
                },
                {
                  icon: <FaFileInvoiceDollar className="text-yellow-500 mt-1 mr-3 text-xl" />,
                  label: "IFSC Code",
                  value: payment.ifscNo || '-',
                },
                {
                  icon: <FaFileInvoiceDollar className="text-yellow-500 mt-1 mr-3 text-xl" />,
                  label: "GSTIN",
                  value: payment.gstinNo || '-',
                },
              ].map(({ icon, label, value }, idx) => (
                <div key={idx} className="flex items-start">
                  {icon}
                  <div>
                    <p className="font-semibold">{label}</p>
                    <p className="text-gray-600">{value}</p>
                  </div>
                </div>
              ))}
            </div>



            {/* QR Code */}
            {payment.qrcodeImage && (

              // <motion.div
              //   initial={{ opacity: 0, scale: 0.8 }}
              //   whileInView={{ opacity: 1, scale: 1 }}
              //   transition={{ duration: 0.5, delay: 0.3 }}
              <div
                className="w-full lg:w-1/2 text-center bg-white/70 border border-gray-200 p-6 rounded-xl shadow-md"
              >
                <h3 className="text-xl font-bold text-color mb-4">QR</h3>
                <div className="flex justify-center">
                  <img
                    src={url + payment.qrcodeImage}
                    alt="Scan to Pay"
                    className=" w-72 object-contain rounded-2xl border border-gray-300 "
                  />
                </div>
              </div>
            )}


          </div>
        </div>


      </div >
      <style >{`
        .text-color {
          --primary-bg: linear-gradient(135deg, var(--primary-color), #1a3a8f);
          background: var(--primary-bg);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        `}</style>
    </section >
  );
};

export default PaymentDetails;
