import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/chatAPI';
import { motion } from 'framer-motion';
import { HiOutlineArrowLeft, HiOutlinePaperAirplane } from 'react-icons/hi';

export default function Chat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const result = await chatAPI.getConversations(1, 20);
      if (result.success) {
        setConversations(result.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversation) => {
    try {
      setMessageLoading(true);
      const result = await chatAPI.getMessages(
        conversation.itemId,
        conversation.otherUserId,
        1,
        50
      );
      if (result.success) {
        setMessages(result.data);
        setSelectedConversation(conversation);
        
        // Mark messages as read
        if (result.data.some(m => m.isRead === 0 && m.receiverId === user.id)) {
          await chatAPI.markAsRead(conversation.itemId, conversation.otherUserId);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessageLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    try {
      const result = await chatAPI.sendMessage(
        selectedConversation.itemId,
        selectedConversation.otherUserId,
        messageText
      );
      
      if (result.success) {
        setMessages([...messages, result.data]);
        setMessageText('');
        // Refresh conversations to update last message
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please log in to access chat</h1>
          <p className="text-gray-400">Sign in to your account to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-green-600">Messages</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className={`lg:col-span-1 ${selectedConversation ? 'hidden lg:block' : ''}`}>
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-400">Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-400">No conversations yet</div>
              ) : (
                conversations.map((conversation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => fetchMessages(conversation)}
                    className={`p-4 border-b border-gray-800 cursor-pointer transition ${
                      selectedConversation?.otherUserId === conversation.otherUserId
                        ? 'bg-green-900/30 border-green-600'
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{conversation.name}</h3>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-green-600 text-black text-xs font-bold px-2 py-1 rounded">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-green-400 mb-1">{conversation.itemTitle}</p>
                    <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(conversation.lastMessageTime).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <div className="bg-gray-900 rounded-lg border border-gray-800 flex flex-col h-96">
                {/* Header */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden mr-4 text-green-600 hover:text-green-500"
                  >
                    <HiOutlineArrowLeft size={24} />
                  </button>
                  <div className="flex-1">
                    <h2 className="font-bold text-lg text-white">{selectedConversation.name}</h2>
                    {selectedConversation.itemId == null ? (
                      <span className="inline-block mt-1 text-xs bg-green-700 text-white px-2 py-0.5 rounded-full">Admin Support Thread</span>
                    ) : (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-green-400">Item:</span>
                        <span className="text-sm text-gray-300">{selectedConversation.itemTitle}</span>
                        <span className="text-xs text-gray-500">({selectedConversation.itemType})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messageLoading ? (
                    <div className="text-center text-gray-400">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400">Start the conversation</div>
                  ) : (
                    messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          message.senderId === user.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.senderId === user.id
                              ? 'bg-green-600 text-black'
                              : 'bg-gray-800 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === user.id
                              ? 'text-black/60'
                              : 'text-gray-400'
                          }`}>
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Input — disabled for admin support threads */}
                {selectedConversation.itemId == null ? (
                  <div className="p-4 border-t border-gray-800 text-center text-sm text-gray-500">
                    This is a read-only support thread. To send another message use the{' '}
                    <a href="/contact" className="text-green-400 hover:underline">Contact Us</a> page.
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 flex gap-2">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-600"
                    />
                    <button
                      type="submit"
                      disabled={!messageText.trim()}
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-4 py-2 rounded transition flex items-center gap-2"
                    >
                      <HiOutlinePaperAirplane size={18} />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg border border-gray-800 h-96 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-400 mb-2">Select a conversation to start messaging</p>
                  <p className="text-sm text-gray-500">Your conversations will appear on the left</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-green-900/20 border border-green-600/30 rounded-lg"
        >
          <h3 className="text-lg font-bold text-green-400 mb-2">How to Use Chat</h3>
          <ul className="text-gray-300 space-y-2 text-sm">
            <li>✓ Select a conversation to view messages about a specific item</li>
            <li>✓ Chat with finders or seekers about lost and found items</li>
            <li>✓ Each conversation is tied to a specific item for clarity</li>
            <li>✓ Messages are marked as read automatically</li>
            <li>✓ Unread message count shows new conversations</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
