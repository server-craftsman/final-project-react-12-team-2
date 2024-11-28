import React, { useState } from 'react'
import helpCenterData from "../../data/help.center.json";
import helpCenterImage from "../../assets/bg-help-center.jpg";

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHelpData = helpCenterData.help.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen">

      <main className="container mx-auto text-center">
        <div style={{ backgroundImage: `url(${helpCenterImage})` }} className="bg-cover bg-center h-64 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-extrabold mb-4 px-4 py-4 text-white">Hi, how can we help?</h1>
          <div className="flex items-center justify-center w-full max-w-md mb-12">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredHelpData.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
              <div className="flex items-center justify-center mb-4">
                {item.icon && <span className="text-4xl">{item.icon}</span>}
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">{item.title}</h2>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default HelpCenterPage
