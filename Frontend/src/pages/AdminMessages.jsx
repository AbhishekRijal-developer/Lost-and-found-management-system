import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineMailOpen, HiOutlineMail } from 'react-icons/hi';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { contactAPI } from '../services/api.js';

export default function AdminMessages() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await contactAPI.getMessages();
      if (response.success) {
        setMessages(response.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyChange = (id, value) => {
    setReplyDrafts((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveReply = async (message) => {
    const draft = (replyDrafts[message.id] ?? message.adminReply ?? '').trim();

    if (!draft) {
      alert('Please write a reply before saving.');
      return;
    }

    try {
      setSavingId(message.id);
      const response = await contactAPI.replyToMessage(message.id, draft);
      if (response.success) {
        await fetchMessages();
        setReplyDrafts((prev) => ({ ...prev, [message.id]: draft }));
      }
    } catch (err) {
      alert(err.message || 'Could not save reply');
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleAddressed = async (message) => {
    const newStatus = message.status === 'Addressed' ? 'Open' : 'Addressed';

    try {
      setSavingId(message.id);
      const response = await contactAPI.updateMessageStatus(message.id, newStatus);
      if (response.success) {
        await fetchMessages();
      }
    } catch (err) {
      alert(err.message || 'Could not update message status');
    } finally {
      setSavingId(null);
    }
  };

  const filteredMessages = useMemo(() => {
    if (filter === 'All') {
      return messages;
    }

    return messages.filter((message) => message.status === filter);
  }, [messages, filter]);

  const openCount = messages.filter((message) => message.status === 'Open').length;
  const addressedCount = messages.filter((message) => message.status === 'Addressed').length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
        <div className="bg-gradient-to-r from-black to-gray-800 text-white py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate('/admin-panel')}
              className="flex items-center gap-2 mb-4 hover:opacity-80 transition"
            >
              <HiOutlineArrowLeft className="text-2xl" /> Back to Admin Panel
            </button>
            <h1 className="text-4xl md:text-5xl font-bold">Contact Messages</h1>
            <p className="mt-2 text-gray-300">View, reply, and address user support messages</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-sm text-gray-500 font-semibold">Total Messages</p>
              <p className="text-3xl font-bold text-black mt-2">{messages.length}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-sm text-gray-500 font-semibold">Open</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{openCount}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <p className="text-sm text-gray-500 font-semibold">Addressed</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{addressedCount}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {['All', 'Open', 'Addressed'].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === item
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">{error}</div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-700">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-10 text-center text-gray-600">
              No contact messages found for this filter.
            </div>
          ) : (
            <div className="space-y-6">
              {filteredMessages.map((message, index) => {
                const statusClass =
                  message.status === 'Addressed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700';

                return (
                  <motion.div
                    key={message.id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <p className="text-lg font-bold text-black">{message.subject}</p>
                        <p className="text-sm text-gray-500">
                          From {message.name} ({message.email})
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}>
                          {message.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
                    </div>

                    <label className="block font-semibold text-gray-700 mb-2">Admin Reply</label>
                    <textarea
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-600 focus:outline-none transition resize-y"
                      placeholder="Write your response to this message..."
                      value={replyDrafts[message.id] ?? message.adminReply ?? ''}
                      onChange={(e) => handleReplyChange(message.id, e.target.value)}
                    />

                    {message.repliedAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        Last reply at {new Date(message.repliedAt).toLocaleString()}
                        {message.repliedByName ? ` by ${message.repliedByName}` : ''}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleSaveReply(message)}
                        disabled={savingId === message.id}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-60"
                      >
                        <HiOutlineMail /> {savingId === message.id ? 'Saving...' : 'Save Reply'}
                      </button>

                      <button
                        onClick={() => handleToggleAddressed(message)}
                        disabled={savingId === message.id}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition disabled:opacity-60"
                      >
                        <HiOutlineMailOpen />
                        {message.status === 'Addressed' ? 'Mark Open' : 'Mark Addressed'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
