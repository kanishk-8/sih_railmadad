import React, { useState, useEffect } from "react";
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
  const [user, setUser] = useState(null); // State to store user info
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check if user is logged in
  const [validatedStationInfo, setValidatedStationInfo] = useState(null);
  const [isWaitingForIssueDetails, setIsWaitingForIssueDetails] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in when component mounts
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      // Clear state if not logged in
      setComplaintType(null);
      setMessages([]);
      setPnr("");
    }
  }, []);

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
        // Train complaint logic (unchanged)
        const complaintData = {
          userId: user.uid,
          email: user.email,
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

        if (!genRes.ok) throw new Error("Error generating AI response");

        const { description, category, priority, complaintNumber } = await genRes.json();

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `Your train complaint has been lodged with complaint number ${complaintNumber} in category '${category}', with priority '${priority}'. Description: ${description}. You can track your application using the 'Track your concern' option.`,
            isBot: true,
          },
          { text: "Do you have any other concerns? (yes/no)", isBot: true },
        ]);
        setWaitingForMoreComplaints(true);

      } else if (complaintType === "Station") {
        if (isWaitingForIssueDetails && validatedStationInfo) {
          // User has already provided station name and date, now providing issue details
          const { stationName, incidentDate } = validatedStationInfo;

          const complaintData = {
            userId: user.uid,
            email: user.email,
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

          if (!genRes.ok) throw new Error("Error generating AI response");

          const { description, category, priority, complaintNumber } = await genRes.json();

          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: `Your station complaint has been lodged with complaint number ${complaintNumber} in category '${category}', with priority '${priority}'. Description: ${description}. You can track your application using the 'Track your concern' option.`,
              isBot: true,
            },
            { text: "Do you have any other concerns? (yes/no)", isBot: true },
          ]);

          setIsWaitingForIssueDetails(false); // Reset the flag
          setValidatedStationInfo(null); // Clear the station info
          setWaitingForMoreComplaints(true);

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

      } else {
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
  const validatePnr = async (pnrNumber) => {
    try {
      const res = await fetch("http://localhost:5000/api/validate-pnr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pnr: pnrNumber }),
      });

      const data = await res.json();
      setPnrValid(data.valid);

    } catch (error) {
      console.error("Error validating PNR:", error);
    }
  };

  useEffect(() => {
    if (pnr) {
      validatePnr(pnr);
    }
  }, [pnr]);

  const handleComplaintTypeChange = (type) => {
    setComplaintType(type);
    setWaitingForMoreComplaints(false);
    setIsWaitingForIssueDetails(false);
    setValidatedStationInfo(null);
    setMessages([]);
  };

  return (
    <div>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className={msg.isBot ? "bot-message" : "user-message"}>
            {msg.file && (msg.isVideo ? (
              <video src={msg.file} controls />
            ) : (
              <img src={msg.file} alt="User upload" />
            ))}
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      {!isLoggedIn ? (
        <p>Please log in to use the chatbot.</p>
      ) : (
        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type your message here..."
          />
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleSendMessage} disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
