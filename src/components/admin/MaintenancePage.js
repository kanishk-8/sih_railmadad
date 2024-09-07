import React from 'react';

const MaintenancePage = () => {
  // Placeholder maintenance data
  const maintenanceTasks = [
    { id: 1, task: 'Fix platform lighting', status: 'In Progress' },
    { id: 2, task: 'Clean train coaches', status: 'Completed' },
    // Add more tasks as needed
  ];

  return (
    <div>
      <h2>Maintenance Tasks</h2>
      <ul className="list-disc pl-5">
        {maintenanceTasks.map((task) => (
          <li key={task.id}>
            <strong>{task.task}:</strong> {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaintenancePage;
