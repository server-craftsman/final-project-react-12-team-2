import React from 'react'
import { AmazonOutlined, DockerOutlined } from '@ant-design/icons';
import logo from '../../../assets/logo.jpg'
import { Link } from 'react-router-dom';
const About: React.FC = () => {
  return (
    <div className="p-8 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 min-h-screen w-full text-white">
      <div className="mt-3 flex justify-center">
        <img src={logo} alt="Intro Image" className="w-1/4 h-auto rounded-full shadow-lg transform transition duration-500 hover:scale-105 hover:rotate-3 hover:skew-y-3 hover:skew-x-3" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="flex flex-col justify-center items-start p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:bg-gray-800 hover:rotate-1 hover:translate-x-2 hover:translate-y-2">
          <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm mb-2 animate-bounce">Online</span>
          <p className="text-3xl font-extrabold">Over 10 million learners worldwide</p>
        </div>
        <div className="flex flex-col justify-center items-start p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:bg-gray-800 hover:rotate-1 hover:translate-x-2 hover:translate-y-2">
          <p className="text-3xl font-extrabold">Trusted by 50,000 businesses for team training</p>
          <div className="flex space-x-4 mt-2">
            <AmazonOutlined className="h-8 animate-spin hover:animate-ping" />
            <DockerOutlined className="h-8 animate-spin hover:animate-ping" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-start p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:bg-gray-800 hover:rotate-1 hover:translate-x-2 hover:translate-y-2">
          <p className="text-3xl font-extrabold">Rated 5 stars by 500,000 reviews</p>
          <div className="flex space-x-1 mt-2">
            <span className="text-yellow-500 animate-pulse hover:animate-bounce">★</span>
            <span className="text-yellow-500 animate-pulse hover:animate-bounce">★</span>
            <span className="text-yellow-500 animate-pulse hover:animate-bounce">★</span>
            <span className="text-yellow-500 animate-pulse hover:animate-bounce">★</span>
            <span className="text-yellow-500 animate-pulse hover:animate-bounce">★</span>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:bg-gray-800 hover:rotate-1 hover:translate-x-2 hover:translate-y-2">
          <p className="text-3xl font-extrabold">Present in over 150 countries</p>
          <p className="mt-2">No matter where you are, our app is always ready to serve you.</p>
        </div>
        <div className="flex flex-col justify-center items-start p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:bg-gray-800 hover:rotate-1 hover:translate-x-2 hover:translate-y-2">
          <p className="text-3xl font-extrabold">Multi-language support</p>
          <p className="mt-2">We provide support in multiple languages to serve you better.</p>
        </div>
        <div className="flex flex-col justify-center items-start p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:bg-gray-800 hover:rotate-1 hover:translate-x-2 hover:translate-y-2">
          <p className="text-3xl font-extrabold">Dynamic learner community</p>
          <p className="mt-2">Join our learner community to learn and share experiences.</p>
        </div>
        <div className="flex flex-col justify-center items-start p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:bg-gray-800 hover:rotate-1 hover:translate-x-2 hover:translate-y-2">
          <p className="text-3xl font-extrabold">Top-notch teaching quality</p>
          <p className="mt-2">We pride ourselves on our high-quality and experienced teaching staff.</p>
        </div>
        <div className="flex flex-col justify-center items-start p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:bg-gray-800 hover:rotate-1 hover:translate-x-2 hover:translate-y-2">
          <p className="text-3xl font-extrabold">Advanced technology</p>
          <p className="mt-2">Our app uses advanced technology to provide the best learning experience.</p>
        </div>
        <div className="flex flex-col justify-center items-start p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:bg-gray-800 hover:rotate-1 hover:translate-x-2 hover:translate-y-2">
          <p className="text-3xl font-extrabold">24/7 support</p>
          <p className="mt-2">Our support team is always ready to help you anytime.</p>
        </div>
        <div className="flex flex-col justify-center items-start p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:bg-gray-800 hover:rotate-1 hover:translate-x-2 hover:translate-y-2">
          <p className="text-3xl font-extrabold">Rich content</p>
          <p className="mt-2">We offer a wide range of courses and learning materials for you to choose from.</p>
        </div>
        <div className="flex flex-col justify-center items-start p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:bg-gray-800 hover:rotate-1 hover:translate-x-2 hover:translate-y-2">
          <p className="text-3xl font-extrabold">Flexible learning</p>
          <p className="mt-2">You can learn anytime and anywhere with our app.</p>
        </div>
        <div className="flex flex-col justify-center items-start p-6 bg-gray-900 bg-opacity-75 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:bg-gray-800 hover:rotate-1 hover:translate-x-2 hover:translate-y-2">
          <p className="text-3xl font-extrabold">Prestigious certificates</p>
          <p className="mt-2">Complete the course and receive prestigious certificates from us.</p>
        </div>
      </div>
      <div className="mt-8">
        <iframe
          width="100%"
          height="500"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Intro Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:rotate-1 hover:translate-x-2 hover:translate-y-2"
        ></iframe>
      </div>
      <Link to="/register" className="mt-8 flex justify-center">
        <button className="px-6 py-3 bg-gradient-tone text-white font-bold rounded-full shadow-lg transform transition duration-500 hover:scale-110 hover:bg-yellow-600 hover:shadow-2xl hover:animate-pulse hover:rotate-1 hover:translate-x-2 hover:translate-y-2">
          Register Now
        </button>
      </Link>
    </div>
  )
}

export default About
