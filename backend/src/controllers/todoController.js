const Todo = require('../models/Todo');

// Get all todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new todo
exports.createTodo = async (req, res) => {
  try {
    const { 
      text, 
      description, 
      dueDate, 
      priority 
    } = req.body;

    const newTodo = new Todo({
      user: req.user._id,
      text,
      description,
      dueDate,
      priority,
      completed: false
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a todo
exports.updateTodo = async (req, res) => {
  try {
    const { 
      text, 
      description, 
      completed, 
      dueDate, 
      priority 
    } = req.body;

    const updateFields = {};

    // Only add fields that are provided
    if (text) updateFields.text = text;
    if (description !== undefined) updateFields.description = description;
    if (completed !== undefined) updateFields.completed = completed;
    if (dueDate !== null) updateFields.dueDate = dueDate;
    if (priority) updateFields.priority = priority;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, 
      updateFields, 
      { 
        new: true,
        runValidators: true 
      }
    );
    
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Todo.findOneAndDelete({
      _id: req.params.id, 
      user: req.user._id
    });
    
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json(deletedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
