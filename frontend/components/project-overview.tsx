"use client";

import { useRouter } from "next/navigation";

export const ProjectOverview = () => {
  const router = useRouter();

  const suggestions = [
    { icon: "🩺", text: "อาการเบื้องต้นของโรคซึมเศร้ามีอะไรบ้าง" },
    { icon: "💊", text: "วิธีดูแลสุขภาพจิตในชีวิตประจำวัน" },
    { icon: "🏥", text: "ควรพบแพทย์เมื่อมีอาการอย่างไร" },
    { icon: "❤️", text: "แนวทางการดูแลสุขภาพหัวใจ" },
  ];

  const handleSuggestionClick = (text: string) => {
    const encodedMessage = encodeURIComponent(text);
    router.push(`/chat?message=${encodedMessage}`);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground text-center">
        AI Medical Assistant
      </h1>

      <p className="text-base text-muted-foreground font-medium mb-2">
        ที่ปรึกษาสุขภาพอัจฉริยะ
      </p>

      <p className="text-sm text-muted-foreground text-center max-w-md mb-10">
        ระบบปัญญาประดิษฐ์ที่พร้อมให้คำปรึกษาและข้อมูลด้านสุขภาพอย่างครบถ้วน
        <br />
        สะดวก รวดเร็ว และเข้าใจง่าย
      </p>

      <div className="w-full max-w-2xl">
        <p className="text-xs text-muted-foreground mb-3 text-center font-medium">
          คำถามแนะนำ
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion.text)}
              className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 text-left group cursor-pointer"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">
                {suggestion.icon}
              </span>
              <span className="text-sm text-card-foreground group-hover:text-primary transition-colors">
                {suggestion.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
        <span>ระบบพร้อมให้บริการตลอด 24 ชั่วโมง</span>
      </div>
    </div>
  );
};
