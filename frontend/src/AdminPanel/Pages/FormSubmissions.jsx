import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS, GET_UPLOAD_URL } from '../../config/api';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const FormSubmissions = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_FORM);
      setForms(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast.error("Failed to load form submissions");
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = (state) => {
    const cleanStateName = state.replace(/\s+/g, '').toLowerCase();
    return `${cleanStateName}ITU@540720`;
  };

  const handleApprove = async (formId, email, state) => {
    try {
      setApprovingId(formId);
      const password = generatePassword(state);
      
      // 📧 LOG: Data being sent to backend
      const requestData = {
        formId,
        email,
        password
      };
      console.log('\n\n🚀🚀🚀 FRONTEND: APPROVE BUTTON CLICKED 🚀🚀🚀');
      console.log('📤 Sending data to backend:', JSON.stringify(requestData, null, 2));
      console.log('🌐 API Endpoint:', API_ENDPOINTS.APPROVE_FORM);
      console.log('📋 Request Details:', {
        method: 'PUT',
        url: API_ENDPOINTS.APPROVE_FORM,
        headers: { 'Content-Type': 'application/json' },
        body: requestData
      });
      console.log('==========================================\n');
      
      const response = await axios.put(API_ENDPOINTS.APPROVE_FORM, requestData);
      
      // 📧 LOG: Response from backend
      console.log('\n\n✅✅✅ FRONTEND: BACKEND RESPONSE RECEIVED ✅✅✅');
      console.log('📥 Response Status:', response.status);
      console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
      console.log('==========================================\n');

      if (response.data.success) {
        // Update local state immediately
        setForms(prevForms => 
          prevForms.map(form => 
            form._id === formId 
              ? { 
                  ...form, 
                  password: password, 
                  status: 'approved',
                  emailSent: response.data.emailSent || false,
                  emailSentAt: response.data.emailSentAt || null,
                  emailError: response.data.emailError || null
                }
              : form
          )
        );
        
        if (response.data.emailSent) {
          toast.success(`✅ Form approved and email sent successfully to ${email}`, {
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        } else {
          toast.warning(`⚠️ Form approved but email could not be sent: ${response.data.emailError || 'Unknown error'}`, {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
        
        // Also fetch fresh data to ensure consistency
        await fetchForms();
      } else {
        toast.error("Failed to approve form");
      }
    } catch (error) {
      console.error("Error approving form:", error);
      toast.error("Failed to approve form");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Form Submissions</h2>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : forms.length === 0 ? (
        <p className="text-gray-600 py-4">No submissions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">State</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {forms.map((form) => (
                <tr key={form._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{form.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{form.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{form.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{form.state}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{form.address}</td>
                  <td className="px-4 py-3 text-sm">
                    {form.password ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Approved
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {form.password ? (
                      form.emailSent ? (
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            ✅ Email Sent
                          </span>
                          {form.emailSentAt && (
                            <span className="text-xs text-gray-500">
                              {new Date(form.emailSentAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            ❌ Email Failed
                          </span>
                          {form.emailError && (
                            <span className="text-xs text-red-600" title={form.emailError}>
                              {form.emailError.length > 30 ? form.emailError.substring(0, 30) + '...' : form.emailError}
                            </span>
                          )}
                        </div>
                      )
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        Not Sent
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {!form.password ? (
                      <button
                        onClick={() => handleApprove(form._id, form.email, form.state)}
                        disabled={approvingId === form._id}
                        className={`px-3 py-1 rounded transition ${
                          approvingId === form._id
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {approvingId === form._id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          'Approve & Send Email'
                        )}
                      </button>
                    ) : (
                      <span className="text-green-600">✓ Approved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FormSubmissions;