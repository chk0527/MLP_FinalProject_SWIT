import React, { useState, useEffect } from "react";
import { getUserIdFromToken } from "../../util/jwtDecode";

const TodoList = () => {
  // userId를 상태 변수로 선언
  const [userId, setUserId] = useState(null);
  const [today, setToday] = useState(null);
  const [date, setDate] = useState(null);
  const initialTasks =
    JSON.parse(localStorage.getItem(`tasks_${userId}`)) || [];
  const [tasks, setTasks] = useState(initialTasks);
  const [taskInput, setTaskInput] = useState("");

  // 페이지가 처음 로드될 때 userId 설정
  useEffect(() => {
    const id = getUserIdFromToken();
    setUserId(id);
  }, []);

  // 페이지가 처음 로드될 때 today 설정
  useEffect(() => {
    const now = new Date();
    const currentDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    setToday(currentDate);
    console.log("Today : " + currentDate)
  }, []);

  // 오늘날짜가 변경될 때 localStorage에서 데이터 불러오기 및 초기화
  useEffect(() => {
    if (userId && today != date) {
      localStorage.removeItem(`tasks_${userId}`);
    } else if (userId && today == date) {
      const storedTasks =
        JSON.parse(localStorage.getItem(`tasks_${userId}`)) || [];
      setTasks(storedTasks);
    }
  }, [userId, today]);

  // tasks가 변경될 때마다 localStorage에 데이터 저장하기
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`tasks_${userId}`, JSON.stringify(tasks));
    }
  }, [tasks, userId]);

  const addTask = (taskText) => {
    if (taskText.trim() !== "") {
      const newTask = { id: Date.now(), text: taskText, completed: false };
      setTasks([...tasks, newTask]);
      setTaskInput("");

      // Update localStorage for the current user
      localStorage.setItem(
        `tasks_${userId}`,
        JSON.stringify([...tasks, newTask])
      );
    }
    const now = new Date();
    const currentDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    setDate(currentDate);
    console.log("date : " + currentDate)
  };

  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);

    // Update localStorage for the current user
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks));
  };

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    // Update localStorage for the current user
    localStorage.setItem(`tasks_${userId}`, JSON.stringify(updatedTasks));
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addTask(taskInput);
        }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            name="taskInput"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="grow p-2 border border-gray-300 rounded"
          />
          <button
            className="px-4 py-2 m-0 bg-yellow-600 text-white rounded cursor-pointer"
            type="submit"
          >
            등록
          </button>
        </div>
      </form>
      <div className="my-4 pl-4">
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="flex items-center my-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
                className="mr-2"
              />
              <p
                onClick={() => toggleTaskCompletion(task.id)}
                className="cursor-pointer"
                style={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {task.text}
              </p>
              <button
                onClick={() => removeTask(task.id)}
                className="ml-auto text-red-300 p-1 rounded"
              >
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
