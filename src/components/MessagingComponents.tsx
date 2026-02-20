import React, { useState } from 'react';
import { Paperclip, Send, FileText, Image as ImageIcon } from 'lucide-react';
interface Attachment {
  type: 'image' | 'file';
  url: string;
  name: string;
}
interface Message {
  id: string;
  content: string;
  senderType: 'contractor' | 'homeowner' | 'system';
  attachments?: Attachment[];
  timestamp: string;
  isRead: boolean;
}
interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}
export function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  if (message.senderType === 'system') {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-100 text-gray-600 text-xs px-4 py-1.5 rounded-full flex items-center gap-2">
          <span className="font-medium">{message.content}</span>
          <span className="text-gray-400">• {message.timestamp}</span>
        </div>
      </div>);

  }
  return (
    <div
      className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} mb-4`}>

      <div
        className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${isCurrentUser ? 'bg-navy-900 text-white rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-900 rounded-tl-sm'}`}>

        {message.attachments && message.attachments.length > 0 &&
        <div className="flex flex-wrap gap-2 mb-2">
            {message.attachments.map((att, i) =>
          <div
            key={i}
            className={`flex items-center gap-2 p-2 rounded-lg ${isCurrentUser ? 'bg-white/10' : 'bg-gray-100'}`}>

                {att.type === 'image' ?
            <ImageIcon className="w-4 h-4" /> :

            <FileText className="w-4 h-4" />
            }
                <span className="text-xs truncate max-w-[100px]">
                  {att.name}
                </span>
              </div>
          )}
          </div>
        }
        <p className="text-sm whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
      </div>
      <span className="text-[10px] text-gray-400 mt-1 px-1">
        {message.timestamp} {isCurrentUser && message.isRead && '• Read'}
      </span>
    </div>);

}
interface MessageInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
}
export function MessageInput({
  onSend,
  placeholder = 'Type a message...'
}: MessageInputProps) {
  const [text, setText] = useState('');
  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };
  return (
    <div className="bg-white border-t border-gray-200 p-3 flex items-end gap-2">
      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
        <Paperclip className="w-5 h-5" />
      </button>
      <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[40px] py-2 px-3 text-sm"
          rows={1}
          style={{
            height: 'auto',
            minHeight: '40px'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }} />

      </div>
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className={`p-2 rounded-full transition-colors ${text.trim() ? 'bg-navy-900 text-white hover:bg-navy-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>

        <Send className="w-5 h-5" />
      </button>
    </div>);

}
export function DateSeparator({ date }: {date: string;}) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="h-px bg-gray-200 flex-1" />
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
        {date}
      </span>
      <div className="h-px bg-gray-200 flex-1" />
    </div>);

}