import React, { useState } from "react";

function ChatBot() {
  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState(null); // State for storing the uploaded file
  const [filePreview, setFilePreview] = useState(null); // State for previewing the uploaded file
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [complaintType, setComplaintType] = useState(null); // State for complaint selection

  const complaintOptions = [
    "Train",
    "Station",
    "Appreciation rail anubhav",
    "Enquiry",
    "Track your concerns",
    "Suggestions",
  ];

  // Check if the browser supports the Web Speech API
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  // Only initialize recognition if the browser supports it
  let recognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US"; // Set the language (optional)
  } else {
    console.error("Speech recognition not supported in this browser.");
  }

  // Handle recognition result
  if (recognition) {
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript); // Set the transcribed text into input
      console.log("Speech recognized:", transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error detected:", event.error);
      alert("Error occurred in speech recognition: " + event.error);
    };

    recognition.onend = () => {
      setListening(false);
    };
  }

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setListening(true);
      console.log("Listening started...");
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setListening(false);
      console.log("Listening stopped.");
    }
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
    if (!inputValue && !file) return;

    const newMessage = {
      text: inputValue || null,
      isBot: false,
      file: file ? URL.createObjectURL(file) : null,
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    setFile(null);
    setFilePreview(null);

    setLoading(true);
    try {
      let fileUri = null;
      let mimeType = null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("File upload failed");

        const result = await res.json();
        fileUri = result.fileUri;
        mimeType = result.mimeType;
      }

      // Call the AI API after the file has been uploaded
      const genRes = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUri, mimeType, prompt: inputValue }),
      });

      if (!genRes.ok) throw new Error("Error generating AI response");

      const { message } = await genRes.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, isBot: true },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error communicating with the API.", isBot: true },
      ]);
    }
    setLoading(false);
  };

  const handleComplaintSelect = (type) => {
    setComplaintType(type); // Set the selected complaint type
    setMessages([{ text: `You selected: ${type}`, isBot: false }]);
  };

  const handleResetComplaintType = () => {
    setComplaintType(null); // Reset the complaint type to null to go back to selection
    setMessages([]); // Optionally clear messages if you want
  };

  // Handle Enter key press to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col max-h-2/3 min-h-2/3 m-5 p-8 rounded-xl bg-gray-100">
      {!complaintType ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center mb-4">
            Select Your Complaint Type
          </h2>
          <div className="flex flex-col space-y-2">
            {complaintOptions.map((option) => (
              <button
                key={option}
                className="bg-red-900 text-white p-3 rounded-lg shadow-md hover:bg-orange-600 transition"
                onClick={() => handleComplaintSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Header with Complaint Type and Reset Button */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Complaint Type: {complaintType}
            </h3>
            {/* Cross button to reset complaint type */}
            <button
              className="text-red-500 text-lg font-bold"
              onClick={handleResetComplaintType}
            >
              ❌
            </button>
          </div>

          {/* Chat Message Area */}
          <div className="flex-grow overflow-y-auto bg-white p-4 rounded-md shadow-md max-h-72">
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
                  {message.text && <span>{message.text}</span>}
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

          {/* Input Area */}
          <div className="mt-4 flex space-x-2 items-center">
            <input
              type="text"
              className="flex-grow border border-gray-300 p-2 rounded-lg focus:outline-none"
              placeholder="Type your message..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown} // Trigger send on Enter key
            />

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
                  }}
                >
                  ❌
                </button>
              </div>
            )}

            <button
              onMouseDown={startListening}
              onMouseUp={stopListening}
              className={`bg-green-500 text-white px-3 py-2 rounded-lg shadow-md transition ${
                listening ? "bg-green-700" : "hover:bg-green-600"
              }`}
            >
              🎤
            </button>

            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*, video/*"
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
        </>
      )}
    </div>
  );
}

export default ChatBot;
