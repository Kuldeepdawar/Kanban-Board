import React, { useState } from "react";
import "./KanbanBoard.css"; // Importing the CSS file

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");

  const stages = ["Backlog", "To Do", "In Progress", "Done"];

  const handleCreateTask = () => {
    if (taskName.trim()) {
      const newTask = {
        id: taskName.split(" ").join("-"),
        name: taskName,
        stage: 0,
      };
      setTasks([...tasks, newTask]);
      setTaskName("");
    }
  };

  const handleMoveForward = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id && task.stage < stages.length - 1
          ? { ...task, stage: task.stage + 1 }
          : task
      )
    );
  };

  const handleMoveBack = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id && task.stage > 0
          ? { ...task, stage: task.stage - 1 }
          : task
      )
    );
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div>
      <input
        data-testid="create-task-input"
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <button data-testid="create-task-button" onClick={handleCreateTask}>
        Create Task
      </button>

      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {stages.map((stage, stageIndex) => (
          <div key={stageIndex} data-testid={`stage-${stageIndex}`}>
            <h2>{stage}</h2>
            {tasks
              .filter((task) => task.stage === stageIndex)
              .map((task) => (
                <div key={task.id} data-testid={`${task.id}-name`}>
                  <span>{task.name}</span>
                  <button
                    data-testid={`${task.id}-back`}
                    onClick={() => handleMoveBack(task.id)}
                    disabled={task.stage === 0}
                  >
                    Back
                  </button>
                  <button
                    data-testid={`${task.id}-forward`}
                    onClick={() => handleMoveForward(task.id)}
                    disabled={task.stage === stages.length - 1}
                  >
                    Forward
                  </button>
                  <button
                    data-testid={`${task.id}-delete`}
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
