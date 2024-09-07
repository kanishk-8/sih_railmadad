import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the GoogleGenerativeAI class

function ChatBot() {
  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState(null); // State for storing the uploaded file
  const [filePreview, setFilePreview] = useState(null); // State for previewing the uploaded file
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  // Initialize the Google Generative AI client with your API key
  const genAI = new GoogleGenerativeAI('AIzaSyB69yTMIeO9VbqvlT9LR9AWipxZJfe9X6o'); // Use environment variable for security

  // Web Speech API for Speech-to-Text
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setInputValue(transcript); // Set the transcribed text into input
  };

  const startListening = () => {
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognition.stop();
    setListening(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile); // Store the uploaded file in the state

    // Create a preview URL for the uploaded file (image or video)
    const previewURL = URL.createObjectURL(uploadedFile);
    setFilePreview(previewURL);
  };

  const handleSendMessage = async () => {
    if (!inputValue && !file) return; // Ensure that either text or file is provided
  
    const newMessage = {
      text: inputValue || null,
      isBot: false,
      file: file ? URL.createObjectURL(file) : null, // Show a preview of the uploaded file
    };
  
    // Show the user message
    setMessages([...messages, newMessage]);
    setInputValue("");
    setFile(null); // Reset file input
    setFilePreview(null); // Reset file preview
  
    setLoading(true);
    try {
      let fileUri = null;
      let mimeType = null;
  
      // Only upload if a file is provided
      if (file) {
        const formData = new FormData();
        formData.append("file", file); // Append the file if it's uploaded
  
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
  
        if (!res.ok) throw new Error("File upload failed");
        
        const result = await res.json();
        fileUri = result.fileUri;
        mimeType = result.mimeType;
      }
  
      // Call the Google Generative AI API with or without a file
      const genRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUri, mimeType, prompt: inputValue }),
      });
  
      if (!genRes.ok) throw new Error("Error generating AI response");
  
      const { message } = await genRes.json();
  
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, isBot: true }, // Add the bot's response
      ]);
    } catch (error) {
      console.error("Error communicating with the API:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error communicating with the API.", isBot: true },
      ]);
    }
    setLoading(false);
  };
  
  return (
    <div className="flex flex-col h-2/3 m-5 p-8 rounded-xl bg-gray-100">
      <div className="flex-grow overflow-y-auto bg-white p-4 rounded-md shadow-md">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg shadow-sm flex items-center ${
                message.isBot ? "bg-red-100" : "bg-gray-200"
              }`}
            >
              {message.isBot && (
                <img
                  src="/images/bot.png"
                  alt="Bot Icon"
                  className="w-6 h-6 mr-3"
                />
              )}
              {/* Render text only if available */}
              {message.text && <span>{message.text}</span>}
              {/* Render image or video only if available */}
              {message.file && message.file.includes("video") ? (
                <video
                  controls
                  src={message.file}
                  alt="Uploaded Video"
                  className="ml-3 w-16 h-16 rounded-md"
                />
              ) : (
                message.file && (
                  <img
                    src={message.file}
                    alt="Uploaded Image"
                    className="ml-3 w-16 h-16 rounded-md"
                  />
                )
              )}
            </div>
          ))}
          {loading && <div className="text-gray-500">Bot is typing...</div>}
        </div>
      </div>

      <div className="mt-4 flex space-x-2 items-center">
        <input
          type="text"
          className="flex-grow border border-gray-300 p-2 rounded-lg focus:outline-none"
          placeholder="Type your message..."
          value={inputValue}
          onChange={handleInputChange}
        />

        {/* Show a preview of the uploaded image or video */}
        {filePreview && (
          <div className="relative">
            {filePreview.includes("video") ? (
              <video
                controls
                src={filePreview}
                className="w-16 h-16 rounded-lg object-cover mr-2"
              />
            ) : (
              <img
                src={filePreview}
                alt="Preview"
                className="w-16 h-16 rounded-lg object-cover mr-2"
              />
            )}
            <button
              className="absolute top-0 right-0 text-red-500"
              onClick={() => {
                setFilePreview(null);
                setFile(null);
              }} // Remove preview
            >
              ❌
            </button>
          </div>
        )}

        {/* Speech-to-text microphone button */}
        <button
          onMouseDown={startListening}
          onMouseUp={stopListening}
          className={`bg-green-500 text-white px-3 py-2 rounded-lg shadow-md transition ${
            listening ? "bg-green-700" : "hover:bg-green-600"
          }`}
        >
          🎤
        </button>

        {/* File upload input for videos and photos (using an icon) */}
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*, video/*" // Accepts both images and videos
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="bg-gray-300 p-2 rounded-lg shadow-md hover:bg-gray-400 transition">
            📁
          </div>
        </label>

        <button
          className="bg-red-900 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-600 transition"
          onClick={handleSendMessage}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatBot;
