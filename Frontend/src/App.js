import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);
  const [emailList, setEmailList] = useState([]);

  function handleMessage(evt) {
    setMessage(evt.target.value);
  }

  function handlefile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const extractedEmails = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalEmails = extractedEmails.map((item) => item.A);
      setEmailList(totalEmails);
    };

    reader.readAsBinaryString(file);
  }

  function send() {
    setStatus(true);
    axios
      .post("http://localhost:5000/sendmail", { message: message, recipients: emailList })
      .then(function (data) {
        if (data.data === true) {
          alert("Mail Sent Successfully");
          setStatus(false);
        } else {
          alert("Failed");
          setStatus(false);
        }
      })
      .catch(() => {
        alert("Error sending mail");
        setStatus(false);
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 text-center relative">
          <div className="absolute inset-0 bg-white/10 opacity-30"></div>
          <h1 className="text-4xl font-bold relative z-10 drop-shadow-lg">
            📧 BulkMail
          </h1>
          <p className="text-lg mt-2 opacity-90 relative z-10">
            Send professional emails to multiple recipients effortlessly
          </p>
        </div>

        {/* Form */}
        <div className="p-10 space-y-8">
          {/* Recipients (manual entry optional) */}
          <div className="space-y-3">
            <label className="block text-gray-700 font-semibold text-base">
              📬 Recipients Email List
            </label>
            <input
              type="email"
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base bg-gray-50 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-300 hover:-translate-y-0.5"
              placeholder="Enter recipient emails (comma-separated)"
            />
          </div>

          {/* Subject */}
          <div className="space-y-3">
            <label className="block text-gray-700 font-semibold text-base">
              📝 Subject Line
            </label>
            <input
              type="text"
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base bg-gray-50 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-300 hover:-translate-y-0.5"
              placeholder="Enter your email subject"
            />
          </div>

          {/* Message */}
          <div className="space-y-3">
            <label className="block text-gray-700 font-semibold text-base">
              ✉️ Message Content
            </label>
            <textarea
              onChange={handleMessage}
              value={message}
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-base bg-gray-50 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all duration-300 hover:-translate-y-0.5 min-h-32 resize-y font-inherit"
              placeholder="Write your email message here..."
            />
          </div>

          {/* Attachment */}
          <div className="space-y-3">
            <label className="block text-gray-700 font-semibold text-base">
              📎 Attachment (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 cursor-pointer relative overflow-hidden group hover:scale-105">
              <div className="text-4xl text-gray-400 mb-4">📁</div>
              <div className="text-gray-400 text-sm">
                CSV, Excel, or text files (Max 10MB)
              </div>
              <input
                type="file"
                onChange={handlefile}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Send Button */}
          <button
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-10 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300 mt-4"
            onClick={send}
          >
            {status ? "Sending..." : "Send Bulk Emails"}
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-around p-6 bg-gray-50 border-t border-gray-200">
          <div className="text-center">
            <span className="block text-2xl font-bold text-indigo-600">
              {emailList.length}
            </span>
            <div className="text-sm text-gray-600 mt-1">Emails Uploaded</div>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-indigo-600">
              {emailList.length}
            </span>
            <div className="text-sm text-gray-600 mt-1">Recipients</div>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-indigo-600">
              {emailList.length > 0 ? "100%" : "0%"}
            </span>
            <div className="text-sm text-gray-600 mt-1">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
