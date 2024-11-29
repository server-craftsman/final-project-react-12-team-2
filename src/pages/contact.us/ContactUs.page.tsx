import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ContactUsPage: React.FC = () => {
  return (
    <div className="p-5 bg-gray-100">
      <div className="text-center mb-8">
        <h3 className="text-blue-600 font-bold">Contact Us</h3>
        <h1 className="text-4xl font-bold text-gray-800">Get in touch with our team</h1>
        <p className="text-lg text-gray-600">We have the team and know-how to help you scale 10x faster.</p>
      </div>
      <div className="flex justify-center mb-8">
        <AnimatePresence>
          <motion.iframe
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.4821104654434!2d106.79575177467053!3d10.850888489302474!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527374c43baad%3A0xb8b244d75d12213e!2sFPT%20Software%20Tp.H%E1%BB%93%20Ch%C3%AD%20Minh!5e0!3m2!1sen!2sus!4v1732849261649!5m2!1sen!2sus"
            width="90%"
            height="450"
            style={{
            border: 0,
            borderRadius: '15px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            overflow: 'hidden',
            filter: 'grayscale(50%)'
          }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
            className="hover:shadow-2xl"
          ></motion.iframe>
        </AnimatePresence>
      </div>
      <AnimatePresence></AnimatePresence>
      <div className="flex justify-center gap-8">
        <div className="bg-white p-8 shadow-2xl rounded-xl text-center transform transition duration-500 hover:scale-105">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Chat to sales</h2>
          <p className="text-gray-600 mb-4">Speak to our friendly team.</p>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sales@edulearn.com" className="text-blue-600 font-semibold hover:bg-[#1a237e] hover:text-white hover:px-4 hover:py-2 hover:rounded hover:border hover:border-[#1a237e]" target="_blank" rel="noopener noreferrer">sales@edulearn.com</a>
        </div>
        <div className="bg-white p-8 shadow-2xl rounded-xl text-center transform transition duration-500 hover:scale-105">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Chat to support</h2>
          <p className="text-gray-600 mb-4">We're here to help.</p>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=support@edulearn.com" className="text-blue-600 font-semibold hover:bg-[#1a237e] hover:text-white hover:px-4 hover:py-2 hover:rounded hover:border hover:border-[#1a237e]" target="_blank" rel="noopener noreferrer">support@edulearn.com</a>
        </div>
        <div className="bg-white p-8 shadow-2xl rounded-xl text-center transform transition duration-500 hover:scale-105">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Visit us</h2>
          <p className="text-gray-600 mb-4">Visit our office HQ.</p>
          <a href="https://maps.app.goo.gl/19rRN2NT6PtXTidR7" className="text-blue-600 font-semibold hover:bg-[#1a237e] hover:text-white hover:px-4 hover:py-2 hover:rounded hover:border hover:border-[#1a237e]" target="_blank" rel="noopener noreferrer">View on Google Maps</a>
        </div>
        <div className="bg-white p-8 shadow-2xl rounded-xl text-center transform transition duration-500 hover:scale-105">
          <div className="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Call us</h2>
          <p className="text-gray-600 mb-4">Mon-Fri from 8am to 5pm.</p>
          <a href="tel:0869872830" className="text-blue-600 font-semibold hover:bg-[#1a237e] hover:text-white hover:px-4 hover:py-2 hover:rounded hover:border hover:border-[#1a237e]">0869872830</a>
        </div>
      </div>
    </div>
  )
}

export default ContactUsPage
