const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
const PORT = 8000;
//Creating the Databse of the required fields
mongoose
  .connect("mongodb://localhost:27017/todolist")
  .then(() => console.log("your database is connected"))
  .catch(() => console.log("any error occurs"));

//defining the structure of mongodb
const todoSchema = new mongoose.Schema({
  task_name: {
    type: String,
    required: true,
  },
  task_description: {
    type: String,
    required: true,
  },
  is_completed: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Todo = mongoose.model("Todo", todoSchema);
//creating a post-API
app.post("/add-to-do", async (req, res) => {
  const body = req.body;
  const result = await Todo.create({
    task_name: body.task_name,
    task_description: body.task_description,
    is_completed: body.is_completed,
    created_at: body.created_at,
  });
  console.log(result);
  return res.json({ msg: "data is inserted" });
});
// get-post API
app.get("/all-to-do", async (req, res) => {
  try {
    const all = await Todo.find({}, "task_description -_id");
    res.json(all);
  } catch (error) {
    res.json({ msg: "no data is showing" });
  }
});
// updating the to-do
app.patch("/update-to-do", async (req, res) => {
  const updatevalue = req.body;

  const updatedTodo = await Todo.findByIdAndUpdate(req.body.id, updatevalue);

  if (!updatedTodo) {
    return res.status(404).json({ msg: "Todo not found" });
  }
  return res.json({ msg: "updated" });
});

// deleted the to-do
app.delete("/remove-to-do", async (req, res) => {
  const removeId = req.body.id;

  await Todo.findByIdAndDelete(removeId);

  return res.json({ msg: "data is deleted" });
});
app.listen(PORT, () => console.log(`server started at PORT`, PORT));
