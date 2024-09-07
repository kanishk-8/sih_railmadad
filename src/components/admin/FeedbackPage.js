import React from 'react';

const FeedbackPage = () => {
  // Placeholder feedback data
  const feedbacks = [
    { id: 1, user: 'User A', feedback: 'Great service!' },
    { id: 2, user: 'User B', feedback: 'Needs improvement.' },
    // Add more feedbacks as needed
  ];

  return (
    <div>
      <h2>Feedback</h2>
      <ul className="list-disc pl-5">
        {feedbacks.map((item) => (
          <li key={item.id}>
            <strong>{item.user}:</strong> {item.feedback}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedbackPage;
