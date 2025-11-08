import { useState } from "react";
import { Search, Send, Paperclip, MoreHorizontal, Star, Archive } from "lucide-react";

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      customer: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      lastMessage: "When will my order be shipped?",
      time: "2 min ago",
      unread: true,
      status: "online"
    },
    {
      id: 2,
      customer: "Jane Smith",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
      lastMessage: "Thank you for the quick response!",
      time: "1 hour ago",
      unread: false,
      status: "offline"
    },
    {
      id: 3,
      customer: "Bob Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      lastMessage: "I need to return this item",
      time: "3 hours ago",
      unread: true,
      status: "offline"
    },
    {
      id: 4,
      customer: "Alice Brown",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      lastMessage: "Is this product available in blue?",
      time: "1 day ago",
      unread: false,
      status: "online"
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "customer",
      message: "Hi, I placed an order yesterday (#12345) and I'm wondering when it will be shipped?",
      time: "10:30 AM",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: 2,
      sender: "vendor",
      message: "Hello John! Thank you for your order. Your package will be shipped today and you'll receive a tracking number via email.",
      time: "10:35 AM",
      avatar: null
    },
    {
      id: 3,
      sender: "customer",
      message: "That's great! How long does shipping usually take?",
      time: "10:37 AM",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    },
    {
      id: 4,
      sender: "vendor",
      message: "Standard shipping takes 3-5 business days. Since you're in New York, it should arrive by Friday.",
      time: "10:40 AM",
      avatar: null
    },
    {
      id: 5,
      sender: "customer",
      message: "Perfect! Thank you for the quick response.",
      time: "10:42 AM",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face"
    }
  ];

  const selectedConversation = conversations.find(c => c.id === selectedMessage);

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col lg:flex-row bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Conversations List */}
      <div className="w-full lg:w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedMessage(conversation.id)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedMessage === conversation.id ? 'bg-orange-50 border-r-2 border-r-orange-500' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    className="h-10 w-10 rounded-full object-cover" 
                    src={conversation.avatar} 
                    alt={conversation.customer} 
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    conversation.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{conversation.customer}</h3>
                    <span className="text-xs text-gray-500">{conversation.time}</span>
                  </div>
                  <p className={`text-sm truncate ${
                    conversation.unread ? 'text-gray-900 font-medium' : 'text-gray-600'
                  }`}>
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    className="h-10 w-10 rounded-full object-cover" 
                    src={selectedConversation.avatar} 
                    alt={selectedConversation.customer} 
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    selectedConversation.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedConversation.customer}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.status === 'online' ? 'Online' : 'Last seen 2 hours ago'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Star className="h-5 w-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Archive className="h-5 w-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreHorizontal className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'vendor' ? 'flex-row-reverse' : ''}`}
                >
                  {message.avatar && (
                    <img 
                      className="h-8 w-8 rounded-full object-cover flex-shrink-0" 
                      src={message.avatar} 
                      alt="Avatar" 
                    />
                  )}
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === 'vendor' 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'vendor' ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="h-5 w-5 text-gray-400" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <button className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a customer from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
