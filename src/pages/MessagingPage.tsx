import React, { useEffect, useMemo, useState, Component } from 'react';
import {
  MessageBubble,
  MessageInput,
  DateSeparator } from
'../components/MessagingComponents';
import {
  messages as allMessages,
  projects,
  currentUserContractor,
  currentUserHomeowner } from
'../data/mockData';
import { Search, ChevronLeft, User, MapPin } from 'lucide-react';
interface MessagingPageProps {
  userRole: 'contractor' | 'homeowner';
  onNavigate?: (page: string, id?: string) => void;
  embedded?: boolean;
  projectId?: string;
}
export function MessagingPage({
  userRole,
  onNavigate,
  embedded = false,
  projectId
}: MessagingPageProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    projectId || null
  );
  const [searchTerm, setSearchTerm] = useState('');
  // If projectId is provided, lock to that project
  const isProjectScoped = !!projectId;
  // Filter projects based on user role
  // For contractor: show all active/sent projects
  // For homeowner: show only their projects (in this mock, we assume 'p1' is theirs, or all for demo)
  const relevantProjects = useMemo(() => {
    if (userRole === 'contractor') {
      return projects.filter(
        (p) =>
        p.status === 'active' ||
        p.status === 'sent' ||
        p.status === 'pending'
      );
    } else {
      // For demo purposes, homeowner sees all projects, but in reality would filter by their ID
      return projects;
    }
  }, [userRole]);
  // Process conversations
  const conversations = useMemo(() => {
    return relevantProjects.
    map((project) => {
      const projectMessages = allMessages.filter(
        (m) => m.projectId === project.id
      );
      const lastMessage = projectMessages[projectMessages.length - 1];
      const unreadCount = projectMessages.filter(
        (m) => m.senderType !== userRole && !m.isRead
      ).length;
      return {
        project,
        lastMessage,
        unreadCount,
        // Use last message timestamp for sorting, fallback to project start date
        lastActivity: lastMessage ?
        new Date(
          lastMessage.timestamp.includes('Today') ?
          Date.now() :
          Date.now() - 86400000
        ).getTime() :
        new Date(project.startDate).getTime()
      };
    }).
    sort((a, b) => b.lastActivity - a.lastActivity).
    filter(
      (c) =>
      c.project.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.project.homeownerName.
      toLowerCase().
      includes(searchTerm.toLowerCase())
    );
  }, [relevantProjects, userRole, searchTerm]);
  // Select first project by default on desktop if none selected
  useEffect(() => {
    if (isProjectScoped) {
      setSelectedProjectId(projectId);
      return;
    }
    if (
    !selectedProjectId &&
    conversations.length > 0 &&
    !embedded &&
    window.innerWidth >= 1024)
    {
      setSelectedProjectId(conversations[0].project.id);
    }
  }, [conversations, selectedProjectId, embedded, isProjectScoped, projectId]);
  const activeConversation = conversations.find(
    (c) => c.project.id === selectedProjectId
  );
  const activeMessages = useMemo(() => {
    if (!selectedProjectId) return [];
    return allMessages.filter((m) => m.projectId === selectedProjectId);
  }, [selectedProjectId]);
  // Group messages by date (simple logic for demo)
  const groupedMessages = useMemo(() => {
    const groups: {
      date: string;
      msgs: typeof activeMessages;
    }[] = [];
    let currentDate = '';
    activeMessages.forEach((msg) => {
      // Extract date part from timestamp (very basic parsing for mock data)
      const datePart = msg.timestamp.split(' ')[0]; // "Yesterday", "Today", "Feb"
      if (datePart !== currentDate) {
        currentDate = datePart;
        groups.push({
          date: currentDate,
          msgs: []
        });
      }
      groups[groups.length - 1].msgs.push(msg);
    });
    return groups;
  }, [activeMessages]);
  const handleSendMessage = (text: string) => {
    console.log('Sending message to project', selectedProjectId, ':', text);
    // In a real app, this would add the message to the state/backend
  };
  return (
    <div
      className={`flex bg-white overflow-hidden border border-gray-200 rounded-xl ${embedded ? 'h-[500px]' : 'h-[calc(100vh-140px)]'}`}>

      {/* Left Panel: Conversation List — hidden when scoped to a single project */}
      {!isProjectScoped &&
      <div
        className={`w-full lg:w-80 flex flex-col border-r border-gray-200 bg-white ${selectedProjectId ? 'hidden lg:flex' : 'flex'}`}>

          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900" />

            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ?
          conversations.map(({ project, lastMessage, unreadCount }) =>
          <button
            key={project.id}
            onClick={() => setSelectedProjectId(project.id)}
            className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${selectedProjectId === project.id ? 'bg-blue-50/50 border-l-4 border-l-navy-900' : 'border-l-4 border-l-transparent'}`}>

                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 truncate pr-2">
                      {project.address}
                    </h3>
                    {lastMessage &&
              <span className="text-[10px] text-gray-400 whitespace-nowrap">
                        {lastMessage.timestamp.split(' ').slice(0, 2).join(' ')}
                      </span>
              }
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="min-w-0 flex-1 mr-2">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">
                        {userRole === 'contractor' ?
                  project.homeownerName :
                  project.contractorName}
                      </p>
                      <p
                  className={`text-sm truncate ${unreadCount > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>

                        {lastMessage ? lastMessage.content : 'No messages yet'}
                      </p>
                    </div>
                    {unreadCount > 0 &&
              <span className="flex-shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-navy-900 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
              }
                  </div>
                </button>
          ) :

          <div className="p-8 text-center text-gray-500">
                <p>No conversations found.</p>
              </div>
          }
          </div>
        </div>
      }

      {/* Right Panel: Chat View */}
      <div
        className={`flex-1 flex flex-col bg-gray-50 ${!selectedProjectId && !isProjectScoped ? 'hidden lg:flex' : 'flex'}`}>

        {activeConversation ?
        <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200 flex items-center gap-3 shadow-sm z-10">
              <button
              onClick={() => setSelectedProjectId(null)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700">

                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center text-navy-900 font-bold flex-shrink-0">
                {userRole === 'contractor' ?
              activeConversation.project.homeownerName.charAt(0) :
              activeConversation.project.contractorName.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-gray-900 truncate">
                  {activeConversation.project.address}
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {userRole === 'contractor' ?
                  activeConversation.project.homeownerName :
                  activeConversation.project.contractorName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {activeConversation.project.address}
                  </span>
                </div>
              </div>

              {onNavigate &&
            <button
              onClick={() =>
              onNavigate('project-detail', activeConversation.project.id)
              }
              className="text-xs font-medium text-navy-900 hover:underline px-2">

                  View Project
                </button>
            }
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {groupedMessages.map((group, i) =>
            <div key={i}>
                  <DateSeparator date={group.date} />
                  {group.msgs.map((msg) =>
              <MessageBubble
                key={msg.id}
                message={msg}
                isCurrentUser={msg.senderType === userRole} />

              )}
                </div>
            )}
              {activeMessages.length === 0 &&
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-6 h-6 opacity-50" />
                  </div>
                  <p>Start the conversation</p>
                </div>
            }
            </div>

            {/* Input Area */}
            <MessageInput
            onSend={handleSendMessage}
            placeholder={`Message ${userRole === 'contractor' ? activeConversation.project.homeownerName : activeConversation.project.contractorName}...`} />

          </> :

        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <User className="w-8 h-8 opacity-40" />
            </div>
            <p className="text-lg font-medium text-gray-500">
              Select a conversation
            </p>
            <p className="text-sm">
              Choose a project from the list to view messages.
            </p>
          </div>
        }
      </div>
    </div>);

}