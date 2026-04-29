import React from 'react';
import { MdHelpOutline, MdInfoOutline, MdQuestionAnswer, MdLightbulbOutline } from 'react-icons/md';

interface ToolGuideProps {
  toolName: string;
  description: string;
  steps: string[];
  useCases: string[];
  example: { input: string; output: string };
  seoContent: string;
  faqs: { q: string; a: string }[];
}

export const ToolGuide: React.FC<ToolGuideProps> = ({
  toolName,
  description,
  steps,
  useCases,
  example,
  seoContent,
  faqs
}) => {
  return (
    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-8 animate-in fade-in duration-500 pb-10">
      
      {/* Short Description */}
      <section className="px-1">
        <h2 className="text-[17px] font-bold text-[#111827] dark:text-white mb-2 font-display">{toolName} Online Free</h2>
        <p className="text-[14px] text-[#6B7280] dark:text-gray-400 leading-relaxed font-medium">
          {description}
        </p>
      </section>

      {/* How it Works */}
      <section className="bg-[#F8F9FC] dark:bg-slate-900/50 rounded-[20px] p-5 border border-[#E5E7EB] dark:border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand-pink/10 text-brand-pink flex items-center justify-center">
            <MdHelpOutline size={20} />
          </div>
          <h3 className="text-[15px] font-bold text-[#111827] dark:text-white">How it Works</h3>
        </div>
        <div className="flex flex-col gap-3">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-brand-pink text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{idx + 1}</span>
              <p className="text-[13px] text-[#4B5563] dark:text-gray-400 font-medium">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases & Example Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="px-1">
          <div className="flex items-center gap-2 mb-3">
            <MdInfoOutline className="text-brand-pink" size={18} />
            <h3 className="text-[14px] font-bold text-[#111827] dark:text-white uppercase tracking-wider">Use Cases</h3>
          </div>
          <ul className="space-y-2">
            {useCases.map((useCase, idx) => (
              <li key={idx} className="text-[13px] text-[#6B7280] dark:text-gray-400 flex items-center gap-2 font-medium">
                <span className="w-1 h-1 rounded-full bg-brand-pink/40" />
                {useCase}
              </li>
            ))}
          </ul>
        </section>

        <section className="px-5 py-4 bg-white dark:bg-slate-900 rounded-[16px] border border-[#F1F5F9] dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <MdLightbulbOutline className="text-amber-500" size={18} />
            <h3 className="text-[12px] font-bold text-[#6B7280] dark:text-gray-500 uppercase tracking-widest">Example</h3>
          </div>
          <div className="text-[13px] font-medium">
            <span className="text-[#111827] dark:text-gray-200">Input: </span>
            <span className="text-[#6B7280] dark:text-gray-400">{example.input}</span>
          </div>
          <div className="text-[13px] font-medium mt-1">
            <span className="text-[#111827] dark:text-gray-200">Output: </span>
            <span className="text-brand-pink">{example.output}</span>
          </div>
        </section>
      </div>

      {/* SEO Content Block */}
      <section className="px-1 pt-4 border-t border-gray-50 dark:border-slate-800/50">
        <p className="text-[13px] text-[#6B7280] dark:text-gray-500 leading-relaxed italic">
          {seoContent}
        </p>
      </section>

      {/* FAQs */}
      <section className="px-1">
        <div className="flex items-center gap-2 mb-4">
          <MdQuestionAnswer className="text-brand-pink" size={18} />
          <h3 className="text-[15px] font-bold text-[#111827] dark:text-white">Frequently Asked Questions</h3>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <h4 className="text-[13px] font-bold text-[#111827] dark:text-gray-200">{faq.q}</h4>
              <p className="text-[13px] text-[#6B7280] dark:text-gray-400 leading-snug">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
