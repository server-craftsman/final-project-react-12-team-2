import React from "react";
import faqData from "../../data/faq.json";

const CourseFAQ: React.FC = () => {
  return (
    <div className="flex flex-col items-center bg-white min-h-screen p-8">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-extrabold mb-4 text-gray-900">Frequently Asked Questions</h1>
        <p className="text-gray-600">
          Stuck on something? We're here to help with all your questions and answers in one place.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {faqData.faq.map((faqItem) => (
          <React.Fragment key={faqItem.id || "general"}>
            {faqItem.id ? (
              <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-300 transition-transform transform hover:scale-105">
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-2 text-gold-500">{faqItem.icon}</span>
                  <h2 className="text-3xl font-semibold text-gray-800">{faqItem.question}</h2>
                </div>
                <p className="mt-4 text-gray-700">{faqItem.answer}</p>
              </div>
            ) : (
              faqItem.general_questions?.map(({ icon, question, answer }, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-xl border border-gray-300 transition-transform transform hover:scale-105">
                  <div className="flex items-center mb-2">
                    <span className="text-3xl mr-2 text-gold-500">{icon}</span>
                    <h2 className="text-3xl font-semibold text-gray-800">{question}</h2>
                  </div>
                  <p className="mt-4 text-gray-700">{answer || "Answer not available."}</p>
                </div>
              ))
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CourseFAQ;