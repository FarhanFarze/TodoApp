import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';

function App() {
  const [todos, setTodos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch todos from backend
  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token) {
      // Validate token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      setUsername(storedUsername || '');
    }
  }, []);

  const handleLogin = (token, userUsername) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', userUsername);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setIsAuthenticated(true);
    setUsername(userUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUsername('');
  };

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:5000/api/todos');
        const sortedTodos = sortTodos(response.data);
        setTodos(sortedTodos);
      } catch (error) {
        setError('Failed to load tasks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated]);

  // Sorting function for todos
  const sortTodos = (todosToSort) => {
    // Priority order: High > Medium > Low
    const priorityOrder = {
      'High': 3,
      'Medium': 2,
      'Low': 1
    };

    return todosToSort.sort((a, b) => {
      // First, sort by priority (descending)
      const priorityComparison = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityComparison !== 0) return priorityComparison;

      // If priority is the same, sort by due date (ascending)
      // Uncompleted tasks with due dates come first
      const aDate = a.dueDate ? new Date(a.dueDate) : null;
      const bDate = b.dueDate ? new Date(b.dueDate) : null;

      // Completed tasks go to the end
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;

      // Compare due dates
      if (aDate && bDate) return aDate - bDate;
      if (aDate) return -1;
      if (bDate) return 1;

      // If no due dates, maintain original order
      return 0;
    });
  };

  // Add new todo
  const addTodo = async (todoData) => {
    try {
      // Ensure dueDate is properly formatted
      const formattedTodo = {
        ...todoData,
        dueDate: todoData.dueDate ? new Date(todoData.dueDate).toISOString() : null
      };
      const response = await axios.post('http://localhost:5000/api/todos', formattedTodo);
      const updatedTodos = sortTodos([response.data, ...todos]);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id) => {
    try {
      const todoToToggle = todos.find(todo => todo._id === id);
      if (!todoToToggle) {
        console.error('Todo not found');
        return;
      }
      const response = await axios.put(`http://localhost:5000/api/todos/${id}`, {
        completed: !todoToToggle.completed
      });
      const updatedTodos = sortTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  // Edit existing todo
  const editTodo = async (id, updatedTodo) => {
    try {
      // Ensure dueDate is properly formatted
      const formattedTodo = {
        ...updatedTodo,
        dueDate: updatedTodo.dueDate ? new Date(updatedTodo.dueDate).toISOString() : null
      };
      const response = await axios.put(`http://localhost:5000/api/todos/${id}`, formattedTodo);
      const updatedTodos = sortTodos(todos.map(todo => 
        todo._id === id ? response.data : todo
      ));
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error editing todo:', error);
    }
  };

  // Dashboard summary stats
  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.completed).length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Add this stub for now
  const handleAddTaskButton = () => {
    // You can implement scroll to form or open a modal here
    const form = document.getElementById('add-task-form');
    if (form) form.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Router>
      <div className={`
        min-h-screen font-sans transition-colors duration-300
        ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}
      `}>
        <Navbar 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          isAuthenticated={isAuthenticated}
          username={username}
          onLogout={handleLogout}
          onAddTask={handleAddTaskButton}
        />

        <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route 
              path="/login" 
              element={
                !isAuthenticated ? 
                  <Login onLogin={handleLogin} darkMode={darkMode} /> : 
                  <Navigate to="/todos" />
              } 
            />
            <Route 
              path="/signup" 
              element={
                !isAuthenticated ? 
                  <Signup onSignup={handleLogin} darkMode={darkMode} /> : 
                  <Navigate to="/todos" />
              } 
            />
            <Route 
              path="/todos" 
              element={
                isAuthenticated ? (
                  <div className="max-w-4xl mx-auto flex flex-col gap-8">
                    {/* Error Message */}
                    {error && (
                      <div className={`rounded-lg p-4 text-center font-medium mb-2 ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}> 
                        {error} <button onClick={() => window.location.reload()} className="underline ml-2">Try again</button>
                      </div>
                    )}
                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className={`rounded-xl p-6 shadow-soft flex flex-col items-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}> 
                        <span className="text-lg font-semibold mb-2">Total Tasks</span>
                        <span className="text-3xl font-bold">{totalTasks}</span>
                      </div>
                      <div className={`rounded-xl p-6 shadow-soft flex flex-col items-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}> 
                        <span className="text-lg font-semibold mb-2">Completed</span>
                        <span className="text-3xl font-bold text-green-400">{completedTasks}</span>
                      </div>
                      <div className={`rounded-xl p-6 shadow-soft flex flex-col items-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}> 
                        <span className="text-lg font-semibold mb-2">Completion Rate</span>
                        <span className="text-3xl font-bold" style={{ color: darkMode ? '#a78bfa' : '#7c3aed' }}>{completionRate}%</span>
                      </div>
                    </div>
                    {/* Create Task Form */}
                    <div className={`rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}> 
                      <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
                      <TodoForm onAdd={addTodo} darkMode={darkMode} />
                    </div>
                    {/* Todo List */}
                    <div className={`rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}> 
                      <TodoList 
                        todos={todos} 
                        onDelete={deleteTodo} 
                        onToggle={toggleTodo}
                        onEdit={editTodo}
                        darkMode={darkMode}
                      />
                    </div>
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            <Route 
              path="/" 
              element={<Navigate to={isAuthenticated ? "/todos" : "/login"} />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
