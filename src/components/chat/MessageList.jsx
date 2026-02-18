import React from "react";
import { MessageCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function MessageList({ messages, messagesEndRef }) {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-gray-500">Como posso ajudar?</p>
      </div>
    );
  }

  return (
    <>
      {messages.map((msg, idx) => (
        <div key={idx} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
          {msg.role === "assistant" && (
            <div className="w-8 h-8 rounded-full bg-[#0B7A9E] flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
          )}
          <div className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.role === "user" ? "bg-[#0B7A9E] text-white" : "bg-white border border-gray-200"}`}>
            {msg.role === "user" ? (
              <p className="text-sm">{msg.content}</p>
            ) : (
              <ReactMarkdown className="text-sm prose prose-sm max-w-none">{msg.content}</ReactMarkdown>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </>
  );
}