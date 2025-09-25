import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, GET_UPLOAD_URL } from '../../config/api';
import { motion, AnimatePresence } from 'framer-motion';

// Icon component
const MagnifyingGlassIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

// Individual row
const ContactRow = ({ contact }) => {
  const handleReply = () => {
    window.location.href = `mailto:${contact.email}?subject=Re: ${contact.subjects}`;
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ backgroundColor: '#f9fafb' }}
      transition={{ duration: 0.2 }}
      className="border-b hover:bg-gray-50"
    >
      <td className="px-4 py-3">{contact.name}</td>
      <td className="px-4 py-3">{contact.email}</td>
      <td className="px-4 py-3">{contact.subjects}</td>
      <td className="px-4 py-3 max-w-xs truncate" title={contact.message}>
        {contact.message}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {new Date(contact.createdAt).toLocaleString()}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={handleReply}
          className="text-[#0B2545] hover:underline font-medium"
        >
          Reply
        </button>
      </td>
    </motion.tr>
  );
};

const ViewContact = () => {
  const [contacts, setContacts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const fetchContacts = useCallback(async (signal) => {
    try {
      const res = await axios.get(
        API_ENDPOINTS.GET_CONTACT,
        { withCredentials: true, signal }
      );
      setContacts(res.data);
      setFiltered(res.data);
    } catch (err) {
      if (!axios.isCancel(err)) {
        setError('Failed to fetch contacts.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchContacts(controller.signal);
    return () => controller.abort();
  }, [fetchContacts]);

  useEffect(() => {
    const lower = query.toLowerCase();
    setFiltered(
      query
        ? contacts.filter(({ name, email, subjects, message }) =>
            [name, email, subjects, message].some((field) =>
              field?.toLowerCase().includes(lower)
            )
          )
        : contacts
    );
  }, [query, contacts]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Contact Submissions
      </h2>

      <div className="max-w-md mx-auto mb-6 flex items-center space-x-2 border rounded-md bg-white px-3 py-2 shadow-sm">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name, email, subject..."
          aria-label="Search contacts"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 outline-none border-none bg-transparent text-sm text-gray-700"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading…</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">
          {query ? 'No matches found.' : 'No contact submissions.'}
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-[#0B2545] text-white text-sm">
              <tr>
                {['Name', 'Email', 'Subject', 'Message', 'Date', 'Action'].map((col) => (
                  <th
                    key={col}
                    className="px-4 py-3 text-left uppercase tracking-wide"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((contact) => (
                  <ContactRow key={contact._id || contact.email} contact={contact} />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewContact;
