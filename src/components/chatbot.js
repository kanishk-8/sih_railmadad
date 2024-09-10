import React, { useState } from "react";
import { auth } from "@/lib/firebaseconfig";
function ChatBot() {
  const [inputValue, setInputValue] = useState("");
  const [file, setFile] = useState(null); // State for storing the uploaded file
  const [filePreview, setFilePreview] = useState(null); // State for previewing the uploaded file
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [complaintType, setComplaintType] = useState(null); // State for complaint selection
  const [pnrValid, setPnrValid] = useState(null); // State for PNR validation
  const [pnr, setPnr] = useState(""); // State for the PNR number
  const [waitingForMoreComplaints, setWaitingForMoreComplaints] = useState(false);
  let user = null;
  let useremail = null;

  if (auth.currentUser) {
  user = auth.currentUser;
  useremail = auth.currentUser.email;
  console.log(user.uid, useremail);
  } else {
  console.log("No current user");
  }
  const complaintOptions = [
    "Train",
    "Station",
    "Appreciation rail anubhav",
    "Enquiry",
    "Track your concerns",
    "Suggestions",
  ];

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile); // Store the uploaded file in the state

    // Check if it's a video or image and set a preview URL accordingly
    if (uploadedFile && uploadedFile.type.startsWith("video/")) {
      // Set a video placeholder image
      setFilePreview("/images/video.png");
    } else {
      const previewURL = URL.createObjectURL(uploadedFile);
      setFilePreview(previewURL);
    }
  };

  const [validatedStationInfo, setValidatedStationInfo] = useState(null);
  const [isWaitingForIssueDetails, setIsWaitingForIssueDetails] = useState(false);
  
  const handleSendMessage = async () => {
    if (!inputValue && !file) return;
  
    const newMessage = {
      text: inputValue || null,
      isBot: false,
      file: file ? (file.type.startsWith("video/") ? "/images/video.png" : URL.createObjectURL(file)) : null,
      isVideo: file ? file.type.startsWith("video/") : false,
    };
  
    setMessages([...messages, newMessage]);
    setInputValue("");
    setFile(null);
    setFilePreview(null);
  
    setLoading(true);
    try {
      let fileUri = null;
      let mimeType = null;
      let path = null;
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
        path = result.path;
      }
  
      if (complaintType === "Train") {
        const complaintData = {
          userId: user.uid,
          email: useremail,
          pnr,
          fileUri,
          mimeType,
          path,
          prompt: inputValue,
        };
      
        const genRes = await fetch("http://localhost:5000/api/train-complaint", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(complaintData),
        });
      
        const result = await genRes.json();
      
        if (result.isRelevant === false) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: "The complaint is not relevant to rail assistance. Please enter information related to rail assistance.",
              isBot: true,
            },
          ]);
        } else if (result.isRelevant === true) {
          const { description, category, priority, complaintNumber } = result;
      
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: `Your train complaint has been lodged with complaint number ${complaintNumber} in category '${category}', with priority '${priority}'. Description: ${description}. You can track your application using the 'Track your concern' option.`,
              isBot: true,
            },
            { text: "Do you have any other concerns? (yes/no)", isBot: true },
          ]);
          setWaitingForMoreComplaints(true);
        }
      }
      else if (complaintType === "Station") {
        if (isWaitingForIssueDetails && validatedStationInfo) {
          // User has already provided station name and date, now providing issue details
          const { stationName, incidentDate } = validatedStationInfo;
      
          const complaintData = {
            userId: user.uid,
            email: useremail,
            location: stationName,  // Use the validated station name
            incidentDate,           // Use the validated incident date
            fileUri,
            mimeType,
            path,
            prompt: inputValue,     // Now the inputValue represents the issue details
          };
      
          const genRes = await fetch("http://localhost:5000/api/station-complaint", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(complaintData),
          });
      
          const result = await genRes.json();
      
          if (result.isRelevant === false) {
            // If the input is irrelevant, ask for relevant complaint details again
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: "The complaint is not relevant to rail assistance. Please provide a relevant issue related to the station.",
                isBot: true,
              },
            ]);
          } else if (result.isRelevant === true) {
            const { description, category, priority, complaintNumber } = result;
      
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: `Your station complaint has been lodged with complaint number ${complaintNumber} in category '${category}', with priority '${priority}'. Description: ${description}. You can track your application using the 'Track your concern' option.`,
                isBot: true,
              },
              { text: "Do you have any other concerns? (yes/no)", isBot: true },
            ]);
            setWaitingForMoreComplaints(true);
            setIsWaitingForIssueDetails(false); // Reset the flag
            setValidatedStationInfo(null); // Clear the station info
          }
        } else {
          // First step: validate the station name and incident date
          const stationRes = await fetch("http://localhost:5000/api/validate-station-complaint", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: inputValue }), // Send the raw unstructured input to the backend
          });
      
          const stationValidation = await stationRes.json();
          const { stationName, incidentDate } = stationValidation;
      
          if (!stationName || !incidentDate) {
            // If stationName or incidentDate is null or empty, prompt for re-entry
            setMessages((prevMessages) => [
              ...prevMessages,
              { text: "Invalid location or date. Please re-enter the station name and incident date.", isBot: true },
            ]);
            setLoading(false);
            return;
          }
      
          // Station and date validated successfully
          setValidatedStationInfo({ stationName, incidentDate }); // Store validated info
          setIsWaitingForIssueDetails(true); // Set flag to wait for issue details
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: "Station validated. Please provide details about your issue, including any photos, videos, or audio.", isBot: true },
          ]);
        }
      }
      else if (complaintType === "Track your concerns") {
        try {
          const trackRes = await fetch("http://localhost:5000/api/track-complaint-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: inputValue }),
          });
      
          if (!trackRes.ok) {
            throw new Error("Failed to track complaint.");
          }
      
          const trackResult = await trackRes.json();
      
          if (trackResult.error) {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: "There was an error tracking your complaint. Please make sure the complaint number is correct.",
                isBot: true,
              },
            ]);
          } else {
            const { complaintNumber, status } = trackResult;
      
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                text: `Your complaint status is: ${status}`,
                isBot: true,
              },
              { text: "Do you have any other concerns? (yes/no)", isBot: true },
            ]);
          }
        } catch (error) {
          console.error("Error tracking complaint:", error);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: "There was an error connecting to the complaint tracking service. Please try again later.",
              isBot: true,
            },
          ]);
        }
      
        setWaitingForMoreComplaints(true);
      }
           
       else {
        // Placeholder for other complaint types
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `This complaint type will be added soon.`, isBot: true },
        ]);
      }
  
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error communicating with the API.", isBot: true },
      ]);
    }
  
    setLoading(false);
  };
  
  const handleUserResponse = (response) => {
    if (response.toLowerCase() === "yes" || response.toLowerCase() === "no") {
      // Redirect to home page for both 'yes' and 'no'
      window.location.href = "/home";
    } else {
      // Prompt user to enter either 'yes' or 'no'
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Please enter either 'yes' or 'no'.", isBot: true },
      ]);
    }
  };
  
  // Handle PNR validation
  const validatePnr = (pnr) => {
    return /^\d{10}$/.test(pnr); // PNR must be exactly 10 digits
  };

  const handleComplaintSelect = (type) => {
    setComplaintType(type);

    if (type === "Train") {
      setMessages([{ text: "Please write your PNR number.", isBot: true }]);
    } 
    else if (type === "Station") {
      setMessages([{ text: "Please provide the station name and the date of the incident.", isBot: true }]);
    }
    else if(type === "Track your concerns"){
      setMessages([{ text: "Please enter your complaint number.", isBot: true }]);
    }
    else {
      let message;
      switch (type) {
        case "Appreciation rail anubhav":
          message = "Please write your feedback.";
          break;
        case "Enquiry":
          message = "Please write your inquiry.";
          break;
        case "Track your concerns":
          message = "Please enter your complaint number.";
          break;
        case "Suggestions":
          message = "Please write your suggestion.";
          break;
        default:
          message = "";
      }

      setMessages([{ text: message, isBot: true }]);
    }
  };

  const handlePnrSubmit = () => {
    if (validatePnr(inputValue)) {
      setPnrValid(true);
      setPnr(inputValue);
      setMessages([
        ...messages,
        { text: inputValue, isBot: false }, // Display entered PNR
        {
          text: "PNR number is valid. Please provide details about your issue including any photos/videos.",
          isBot: true,
        },
      ]);
      setInputValue("");
    } else {
      setPnrValid(false);
      setMessages([
        ...messages,
        { text: "PNR number is not valid. Please enter a valid 10-digit PNR.", isBot: true },
      ]);
    }
  };

  const handleResetComplaintType = () => {
    setComplaintType(null); // Reset the complaint type
    setPnr(""); // Reset PNR
    setMessages([]); // Optionally clear messages
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      if (waitingForMoreComplaints) {
        handleUserResponse(inputValue);
      } else if (complaintType === "Train" && !pnr) {
        handlePnrSubmit();
      } else {
        handleSendMessage();
      }
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
                  {message.isVideo ? (
                    <img
                      src="/images/video.png"
                      alt="Uploaded Video Placeholder"
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
              placeholder={
                complaintType === "Train" && !pnr
                  ? "Enter your PNR number"
                  : "Type your message..."
              }
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />

            {filePreview && (
              <div className="relative">
                <img
                  src={filePreview}
                  alt="Preview"
                  className="w-16 h-16 rounded-lg object-cover mr-2"
                />
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
              onClick={
                complaintType === "Train" && !pnr
                  ? handlePnrSubmit
                  : handleSendMessage
              }
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
