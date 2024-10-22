import React from "react";
import { AmazonOutlined, DockerOutlined } from "@ant-design/icons";
import logo1 from "../../../assets/logo1.jpg";
import { Link } from "react-router-dom";
const About: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 p-8 text-white">
      <div className="mt-3 flex justify-center">
        <img
          src={logo1}
          alt="Intro Image"
          className="h-auto w-1/4 transform rounded-full shadow-lg transition duration-500 hover:rotate-3 hover:skew-x-3 hover:skew-y-3 hover:scale-105"
        />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex transform flex-col items-start justify-center rounded-lg bg-gray-900 bg-opacity-75 p-6 shadow-lg transition duration-500 hover:translate-x-2 hover:translate-y-2 hover:rotate-1 hover:scale-105 hover:bg-gray-800">
          <span className="mb-2 animate-bounce rounded-full bg-yellow-500 px-3 py-1 text-sm text-black">
            Online
          </span>
          <p className="text-3xl font-extrabold">
            Over 10 million learners worldwide
          </p>
        </div>
        <div className="flex transform flex-col items-start justify-center rounded-lg bg-gray-900 bg-opacity-75 p-6 shadow-lg transition duration-500 hover:translate-x-2 hover:translate-y-2 hover:rotate-1 hover:scale-105 hover:bg-gray-800">
          <p className="text-3xl font-extrabold">
            Trusted by 50,000 businesses for team training
          </p>
          <div className="mt-2 flex space-x-4">
            <AmazonOutlined className="h-8 animate-spin hover:animate-ping" />
            <DockerOutlined className="h-8 animate-spin hover:animate-ping" />
          </div>
        </div>
        <div className="flex transform flex-col items-start justify-center rounded-lg bg-gray-900 bg-opacity-75 p-6 shadow-lg transition duration-500 hover:translate-x-2 hover:translate-y-2 hover:rotate-1 hover:scale-105 hover:bg-gray-800">
          <p className="text-3xl font-extrabold">
            Rated 5 stars by 500,000 reviews
          </p>
          <div className="mt-2 flex space-x-1">
            <span className="animate-pulse text-yellow-500 hover:animate-bounce">
              ★
            </span>
            <span className="animate-pulse text-yellow-500 hover:animate-bounce">
              ★
            </span>
            <span className="animate-pulse text-yellow-500 hover:animate-bounce">
              ★
            </span>
            <span className="animate-pulse text-yellow-500 hover:animate-bounce">
              ★
            </span>
            <span className="animate-pulse text-yellow-500 hover:animate-bounce">
              ★
            </span>
          </div>
        </div>
        <div className="flex transform flex-col items-start justify-center rounded-lg bg-gray-900 bg-opacity-75 p-6 shadow-lg transition duration-500 hover:translate-x-2 hover:translate-y-2 hover:rotate-1 hover:scale-105 hover:bg-gray-800">
          <p className="text-3xl font-extrabold">
            Present in over 150 countries
          </p>
          <p className="mt-2">
            No matter where you are, our app is always ready to serve you.
          </p>
        </div>
        <div className="flex transform flex-col items-start justify-center rounded-lg bg-gray-900 bg-opacity-75 p-6 shadow-lg transition duration-500 hover:translate-x-2 hover:translate-y-2 hover:rotate-1 hover:scale-105 hover:bg-gray-800">
          <p className="text-3xl font-extrabold">Multi-language support</p>
          <p className="mt-2">
            We provide support in multiple languages to serve you better.
          </p>
        </div>
        <div className="flex transform flex-col items-start justify-center rounded-lg bg-gray-900 bg-opacity-75 p-6 shadow-lg transition duration-500 hover:translate-x-2 hover:translate-y-2 hover:rotate-1 hover:scale-105 hover:bg-gray-800">
          <p className="text-3xl font-extrabold">Dynamic learner community</p>
          <p className="mt-2">
            Join our learner community to learn and share experiences.
          </p>
        </div>
        <div className="flex transform flex-col items-start justify-center rounded-lg bg-gray-900 bg-opacity-75 p-6 shadow-lg transition duration-500 hover:translate-x-2 hover:translate-y-2 hover:rotate-1 hover:scale-105 hover:bg-gray-800">
          <p className="text-3xl font-extrabold">Top-notch teaching quality</p>
          <p className="mt-2">
            We pride ourselves on our high-quality and experienced teaching
            staff.
          </p>
        </div>
        <div className="flex transform flex-col items-start justify-center rounded-lg bg-gray-900 bg-opacity-75 p-6 shadow-lg transition duration-500 hover:translate-x-2 hover:translate-y-2 hover:rotate-1 hover:scale-105 hover:bg-gray-800">
          <p className="text-3xl font-extrabold">Advanced technology</p>
          <p className="mt-2">
            Our app uses advanced technology to provide the best learning
            experience.
          </p>
        </div>
        <div className="flex transform flex-col items-start justify-center rounded-lg bg-gray-900 bg-opacity-75 p-6 shadow-lg transition duration-500 hover:translate-x-2 hover:translate-y-2 hover:rotate-1 hover:scale-105 hover:bg-gray-800">
          <p className="text-3xl font-extrabold">24/7 support</p>
          <p className="mt-2">
            Our support team is always ready to help you anytime.
          </p>
        </div>
        <div className="flex transform flex-col items-start justify-center rounded-lg bg-gray-900 bg-opacity-75 p-6 shadow-lg transition duration-500 hover:translate-x-2 hover:translate-y-2 hover:rotate-1 hover:scale-105 hover:bg-gray-800">
          <p className="text-3xl font-extrabold">Rich content</p>
          <p className="mt-2">
            We offer a wide range of courses and learning materials for you to
            choose from.
          </p>
        </div>
        <div className="flex transform flex-col items-start justify-center rounded-lg bg-gray-900 bg-opacity-75 p-6 shadow-lg transition duration-500 hover:translate-x-2 hover:translate-y-2 hover:rotate-1 hover:scale-105 hover:bg-gray-800">
          <p className="text-3xl font-extrabold">Flexible learning</p>
          <p className="mt-2">
            You can learn anytime and anywhere with our app.
          </p>
        </div>
        <div className="flex transform flex-col items-start justify-center rounded-lg bg-gray-900 bg-opacity-75 p-6 shadow-lg transition duration-500 hover:translate-x-2 hover:translate-y-2 hover:rotate-1 hover:scale-105 hover:bg-gray-800">
          <p className="text-3xl font-extrabold">Prestigious certificates</p>
          <p className="mt-2">
            Complete the course and receive prestigious certificates from us.
          </p>
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
          className="transform rounded-lg shadow-lg transition duration-500 hover:translate-x-2 hover:translate-y-2 hover:rotate-1 hover:scale-105"
        ></iframe>
      </div>
      <Link to="/register" className="mt-8 flex justify-center">
        <button className="bg-gradient-tone transform rounded-full px-6 py-3 font-bold text-white shadow-lg transition duration-500 hover:translate-x-2 hover:translate-y-2 hover:rotate-1 hover:scale-110 hover:animate-pulse hover:bg-yellow-600 hover:shadow-2xl">
          Register Now
        </button>
      </Link>
    </div>
  );
};

export default About;
