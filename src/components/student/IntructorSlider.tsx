import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules'
import userData from '../../data/users.json'
import { User } from '../../models/User'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

const IntructorSlider = () => {
  const instructors = userData.users.filter((user: User) => user.role === 'instructor')
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 relative bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-white tracking-wide">Our Distinguished Educators</h2>
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
          slideShadows: true,
        }}
        navigation
        pagination={{ clickable: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="py-12"
      >
        {instructors.map((instructor: User, index: number) => (
          <SwiperSlide key={instructor.id}>
            <div className={`flex flex-col items-center transition-all duration-300 ${index === activeIndex ? 'scale-105 z-10' : 'scale-95 opacity-80'}`}>
              <div className="relative mb-4">
                <img 
                  src={instructor.avatar_url || 'https://via.placeholder.com/150'} 
                  alt={instructor.name} 
                  className="w-24 h-24 rounded-full object-cover border-2 border-gold shadow-md"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-gold to-amber-300 opacity-20 rounded-full"></div>
              </div>
              <div className={`text-center transition-all duration-300 ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}>
                <h3 className="text-xl font-semibold mb-1 text-white">{instructor.name}</h3>
                <p className="text-xs text-gray-300 mb-2 italic">{instructor.description}</p>
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-gold text-sm">★★★★★</span>
                  <span className="text-gray-300 text-xs">(5.0)</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default IntructorSlider
