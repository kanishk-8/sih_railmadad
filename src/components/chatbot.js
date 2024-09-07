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
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_Gemini); // Use environment variable for security

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
      text: inputValue || (file && file.name),
      isBot: false,
      file: file ? URL.createObjectURL(file) : null, // Show a preview of the uploaded file
    };

    // Show the user message
    setMessages([...messages, newMessage]);
    setInputValue("");
    setFile(null); // Reset file input
    setFilePreview(null); // Reset file preview

    // Call the Google Generative AI API
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Get the appropriate model

      let botMessage = "";
      if (file) {
        // Send file to the model for analysis
        const fileData = new FormData();
        fileData.append("file", file);

        const result = await model.analyzeFile(fileData); // Assuming this method can process files
        botMessage = result.response.text(); // Get the analysis result for the file
      } else if (inputValue) {
        // Send text to the model for processing
        const result = await model.generateContent(inputValue); // Generate content based on user input
        botMessage = result.response.text(); // Get the bot's response for text input
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botMessage, isBot: true }, // Add the bot's response
      ]);
    } catch (error) {
      console.error("Error calling Google Generative AI API:", error);
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
              <span>{message.text}</span>
              {message.file && (
                <img
                  src={message.file}
                  alt="Uploaded File"
                  className="ml-3 w-12 h-12 rounded-md"
                />
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
            <img
              src={filePreview}
              alt="Preview"
              className="w-16 h-16 rounded-lg object-cover mr-2"
            />
            <button
              className="absolute top-0 right-0 text-red-500"
              onClick={() => setFilePreview(null)} // Remove preview
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
