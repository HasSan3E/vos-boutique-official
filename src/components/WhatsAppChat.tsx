"use client";
import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "923306667366"; // Replace with your number

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-72 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-[#075e54] p-4 text-white flex justify-between items-center">
            <div>
              <h3 className="font-bold">VOS Boutique</h3>
              <p className="text-xs opacity-80">
                Typically responds in an hour
              </p>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="p-4 bg-[#e5ddd5] h-32 flex flex-col justify-end">
            <div className="bg-white p-2 rounded-lg text-sm shadow-sm self-start max-w-[80%]">
              Hello! How can we help you find your signature scent today?
            </div>
          </div>
          <a
            href={`https://wa.me/${phoneNumber}?text=Hello VOS, I'd like to inquire about...`}
            target="_blank"
            className="m-3 bg-[#25D366] text-white py-2 px-4 rounded-full flex items-center justify-center gap-2 font-medium hover:bg-[#20ba5a] transition-colors"
          >
            Start Chat <Send size={16} />
          </a>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
      >
        <MessageCircle size={30} />
      </button>
    </div>
  );
}
