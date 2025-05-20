import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaCalendar } from 'react-icons/fa';
import { FaRegLightbulb } from 'react-icons/fa6';

function TodoForm({ onAdd, darkMode = false }) {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd({
      text,
      description,
      completed: false,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority
    });
    setText('');
    setDescription('');
    setDueDate('');
    setPriority('Medium');
    setIsExpanded(false);
  };

  const priorityBoxColors = {
    Low: darkMode ? 'bg-green-900' : 'bg-green-800',
    Medium: darkMode ? 'bg-yellow-800' : 'bg-yellow-700',
    High: darkMode ? 'bg-red-900' : 'bg-red-800',
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        mb-6 space-y-4 p-4 rounded-xl shadow-soft
        ${darkMode 
          ? 'bg-gray-700 bg-opacity-50 backdrop-blur-sm' 
          : 'bg-white bg-opacity-70 backdrop-blur-sm'
        }
      `}
    >
      <div className="flex items-center mb-2 space-x-2">
        <FaRegLightbulb className={`text-2xl ${darkMode ? 'text-yellow-300' : 'text-yellow-500'}`} />
        <h2 className="text-xl font-bold">Create New Task</h2>
      </div>
      <div className="flex items-center space-x-2">
        <input 
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Task title"
          required
          className={`
            flex-grow p-3 rounded-lg transition-all duration-300
            ${darkMode 
              ? 'bg-gray-600 text-white placeholder-gray-400 focus:ring-blue-900' 
              : 'bg-brand-50 text-gray-800 placeholder-gray-500 focus:ring-blue-900'
            }
            focus:outline-none focus:ring-2
          `}
        />
      </div>
      <div className="flex justify-center">
        <button 
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            flex items-center space-x-2 text-sm py-1 px-3 rounded-full transition-all duration-300
            ${darkMode 
              ? 'text-gray-300 hover:bg-gray-600' 
              : 'text-gray-600 hover:bg-blue-100'
            }
          `}
        >
          <FaEdit />
          <span>{isExpanded ? 'Hide Description' : 'Add Description'}</span>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="flex items-center space-x-2">
          <FaCalendar className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
          <input 
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`
              w-full p-2 rounded-lg transition-all duration-300
              ${darkMode 
                ? 'bg-gray-600 text-white placeholder-gray-400' 
                : 'bg-brand-50 text-gray-800 placeholder-gray-500'}
              focus:outline-none focus:ring-2 focus:ring-blue-900
            `}
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-block w-4 h-4 rounded ${priorityBoxColors[priority]}`}></span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={`
              w-full p-2 rounded-lg transition-all duration-300
              ${darkMode 
                ? 'bg-gray-600 text-white' 
                : 'bg-brand-50 text-gray-800'}
              focus:outline-none focus:ring-2 focus:ring-blue-900
            `}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
      {isExpanded && (
        <motion.textarea 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional task details..."
          className={`
            w-full p-3 rounded-lg transition-all duration-300
            ${darkMode 
              ? 'bg-gray-600 text-white placeholder-gray-400 focus:ring-blue-900' 
              : 'bg-brand-50 text-gray-800 placeholder-gray-500 focus:ring-blue-900'
            }
            focus:outline-none focus:ring-2
          `}
          rows="2"
        />
      )}
      <button
        type="submit"
        className={`w-full py-3 rounded-lg font-semibold mt-2 transition-all duration-300
          ${darkMode ? 'bg-blue-900 text-white hover:bg-blue-800' : 'bg-blue-900 text-white hover:bg-blue-800'}
        `}
      >
        Add Task
      </button>
    </motion.form>
  );
}

export default TodoForm;
