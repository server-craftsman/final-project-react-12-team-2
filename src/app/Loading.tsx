import React, { useState, useEffect } from "react";
import logoAnimation from "../data/logoAnimation.json"
import Lottie from "lottie-react"
import "./Loading.css"
const Loading: React.FC<{ timeout?: number }> = ({ timeout = 10000 }) => {
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  return (
    <div className="loading-overlay">
      <div className="text-center">
        <Lottie 
          animationData={logoAnimation} 
          loop={true} 
          className="w-80 h-80 filter drop-shadow-2xl opacity-95 animate-pulse hover:scale-110 transition-all duration-500"
          style={{
            filter: "drop-shadow(0 0 15px rgba(255,255,255,0.5))",
            animation: "float 4s ease-in-out infinite"
          }}
        />
        <h2 className="font-serif text-4xl text-white animate-pulse hover:scale-110 transition-all duration-500 drop-shadow-xl tracking-widest text-shadow-xl glow-effect">
          Loading<span className="loading-dots">...</span>
        </h2>

        {showTimeout && (
          <p className="mt-4 text-xl text-yellow-400">
            It's taking longer than expected. Please check your internet
            connection.
          </p>
        )}
      </div>
    </div>
  );
};

export default Loading;
