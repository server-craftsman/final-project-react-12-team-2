import Lottie from "lottie-react";
import loadingAnimation from "../../data/courseAnimation.json"

const LoadingAnimation = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <Lottie animationData={loadingAnimation} />
    </div>
  )
}

export default LoadingAnimation
