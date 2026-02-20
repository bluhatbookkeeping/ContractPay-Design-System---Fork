import React, { Component } from 'react';
import {
  MessageBubble,
  MessageInput,
  DateSeparator } from
'../components/MessagingComponents';
import {
  messages,
  currentUserContractor,
  currentUserHomeowner } from
'../data/mockData';
interface MessagingPageProps {
  userRole: 'contractor' | 'homeowner';
  embedded?: boolean;
}
export function MessagingPage({
  userRole,
  embedded = false
}: MessagingPageProps) {
  const otherUser =
  userRole === 'contractor' ? currentUserHomeowner : currentUserContractor;
  return (
    <div
      className={`flex flex-col bg-white ${embedded ? 'h-[500px]' : '-m-4 lg:-m-8 h-[calc(100vh-120px)]'}`}>

      {!embedded &&
      <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white">
          <div className="w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold">
            {otherUser.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{otherUser.name}</h2>
            <p className="text-xs text-gray-500">
              {otherUser.role === 'contractor' ?
            otherUser.company :
            'Homeowner'}
            </p>
          </div>
        </div>
      }

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <DateSeparator date="Yesterday" />
        {messages.slice(0, 3).map((msg) =>
        <MessageBubble
          key={msg.id}
          message={msg}
          isCurrentUser={msg.senderType === userRole} />

        )}

        <DateSeparator date="Today" />
        {messages.slice(3).map((msg) =>
        <MessageBubble
          key={msg.id}
          message={msg}
          isCurrentUser={msg.senderType === userRole} />

        )}
      </div>

      <MessageInput onSend={(text) => console.log('Sent:', text)} />
    </div>);

}