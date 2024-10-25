import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import userData from "../../../data/users.json";
import { UserRole } from "../../../models/prototype/User";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const InstructorSlider = () => {
  const instructors = userData.users.filter((user) => user.role === UserRole.instructor);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative mx-auto max-w-6xl rounded-lg bg-gradient-to-r from-indigo-900 to-purple-900 px-4 py-12 shadow-xl">
      <h2 className="mb-8 text-center text-3xl font-bold tracking-wide text-white">Our Distinguished Educators</h2>
      <Swiper
        modules={[Navigation, Pagination, EffectCoverflow]}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true
        }}
        navigation
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="py-12"
      >
        {instructors.map((instructor, index: number) => (
          <SwiperSlide key={instructor.id}>
            <div className={`flex flex-col items-center transition-all duration-300 ${index === activeIndex ? "z-10 scale-105" : "scale-95 opacity-80"}`}>
              <div className="relative mb-4">
                <img src={instructor.avatar_url || "https://via.placeholder.com/150"} alt={instructor.name} className="border-gold h-24 w-24 rounded-full border-2 object-cover shadow-md" />
                <div className="from-gold absolute inset-0 rounded-full bg-gradient-to-br to-amber-300 opacity-20"></div>
              </div>
              <div className={`text-center transition-all duration-300 ${index === activeIndex ? "opacity-100" : "opacity-0"}`}>
                <h3 className="mb-1 text-xl font-semibold text-white">{instructor.name}</h3>
                <p className="mb-2 text-xs italic text-gray-300">{instructor.description}</p>
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-gold text-sm">★★★★★</span>
                  <span className="text-xs text-gray-300">(5.0)</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default InstructorSlider;
