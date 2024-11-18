import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import KanbanBoard from "../KanbanBoard";
describe("KanbanBoard Component", () => {
  test("renders the input and create task button", () => {
    render(<KanbanBoard />);
    expect(screen.getByTestId("create-task-input")).toBeInTheDocument();
    expect(screen.getByTestId("create-task-button")).toBeInTheDocument();
  });

  test("does not create a task when input is empty", () => {
    render(<KanbanBoard />);
    fireEvent.click(screen.getByTestId("create-task-button"));
    expect(screen.queryByTestId("task-0-name")).not.toBeInTheDocument();
  });

  test('creates a new task in the "Backlog" stage', () => {
    render(<KanbanBoard />);
    const input = screen.getByTestId("create-task-input");
    const createButton = screen.getByTestId("create-task-button");

    fireEvent.change(input, { target: { value: "Test Task" } });
    fireEvent.click(createButton);

    expect(screen.getByTestId("Test-Task-name")).toHaveTextContent("Test Task");
    expect(screen.getByTestId("stage-0")).toContainElement(
      screen.getByText("Test Task")
    );
  });

  test("moves task to the next stage", () => {
    render(<KanbanBoard />);
    const input = screen.getByTestId("create-task-input");
    const createButton = screen.getByTestId("create-task-button");

    // Create a task
    fireEvent.change(input, { target: { value: "Test Task" } });
    fireEvent.click(createButton);

    const forwardButton = screen.getByTestId("Test-Task-forward");
    fireEvent.click(forwardButton);

    expect(screen.queryByTestId("stage-0")).not.toContainElement(
      screen.getByText("Test Task")
    );
    expect(screen.getByTestId("stage-1")).toContainElement(
      screen.getByText("Test Task")
    );
  });

  test("moves task to the previous stage", () => {
    render(<KanbanBoard />);
    const input = screen.getByTestId("create-task-input");
    const createButton = screen.getByTestId("create-task-button");

    // Create a task and move it to the second stage
    fireEvent.change(input, { target: { value: "Test Task" } });
    fireEvent.click(createButton);
    fireEvent.click(screen.getByTestId("Test-Task-forward"));

    // Move back to "Backlog"
    const backButton = screen.getByTestId("Test-Task-back");
    fireEvent.click(backButton);

    expect(screen.getByTestId("stage-0")).toContainElement(
      screen.getByText("Test Task")
    );
    expect(screen.queryByTestId("stage-1")).not.toContainElement(
      screen.getByText("Test Task")
    );
  });

  test("disables forward button on the last stage", () => {
    render(<KanbanBoard />);
    const input = screen.getByTestId("create-task-input");
    const createButton = screen.getByTestId("create-task-button");

    // Create a task and move it to the "Done" stage
    fireEvent.change(input, { target: { value: "Test Task" } });
    fireEvent.click(createButton);
    fireEvent.click(screen.getByTestId("Test-Task-forward"));
    fireEvent.click(screen.getByTestId("Test-Task-forward"));
    fireEvent.click(screen.getByTestId("Test-Task-forward"));

    const forwardButton = screen.getByTestId("Test-Task-forward");
    expect(forwardButton).toBeDisabled();
  });

  test("disables back button on the first stage", () => {
    render(<KanbanBoard />);
    const input = screen.getByTestId("create-task-input");
    const createButton = screen.getByTestId("create-task-button");

    // Create a task in "Backlog"
    fireEvent.change(input, { target: { value: "Test Task" } });
    fireEvent.click(createButton);

    const backButton = screen.getByTestId("Test-Task-back");
    expect(backButton).toBeDisabled();
  });

  test("deletes a task", () => {
    render(<KanbanBoard />);
    const input = screen.getByTestId("create-task-input");
    const createButton = screen.getByTestId("create-task-button");

    // Create a task and delete it
    fireEvent.change(input, { target: { value: "Test Task" } });
    fireEvent.click(createButton);
    const deleteButton = screen.getByTestId("Test-Task-delete");
    fireEvent.click(deleteButton);

    expect(screen.queryByTestId("Test-Task-name")).not.toBeInTheDocument();
  });
});
