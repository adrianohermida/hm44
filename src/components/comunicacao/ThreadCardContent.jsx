import React from 'react';
import { MessageSquare, Mail, Phone } from 'lucide-react';

const canalIcons = { chat_widget: MessageSquare, whatsapp: Phone, email: Mail };

export default function ThreadCardContent({ thread }) {
  const Icon = canalIcons[thread.canal] || MessageSquare;
  
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600 truncate">{thread.clienteEmail}</span>
      </div>
      <p className={`text-sm truncate ${thread.naoLida ? 'font-medium text-gray-800' : 'text-gray-600'}`}>
        {thread.ultimaMensagem}
      </p>
    </>
  );
}