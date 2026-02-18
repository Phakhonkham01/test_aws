import { useState, useEffect } from "react";
import axios from "axios";

interface Student {
  _id?: string;
  name: string;
  lastname: string;
  age: number;
}

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState<Student>({ name: "", lastname: "", age: 0 });
  const API = "http://localhost:5000/api/students";

  // Fetch all students
  const fetchStudents = async () => {
    const res = await axios.get(API);
    setStudents(res.data);
  };

useEffect(() => {
  const loadStudents = async () => {
    try {
      const res = await axios.get(API);
      setStudents(res.data); // <-- safe
    } catch (err) {
      console.error(err);
    }
  };

  loadStudents();
}, []);


  // Create or update student
  const handleSubmit = async () => {
    if (form._id) {
      await axios.put(`${API}/${form._id}`, form);
    } else {
      await axios.post(API, form);
    }
    setForm({ name: "", lastname: "", age: 0 });
    fetchStudents();
  };

  // Delete student
  const handleDelete = async (id: string) => {
    await axios.delete(`${API}/${id}`);
    fetchStudents();
  };

  // Edit student
  const handleEdit = (student: Student) => {
    setForm(student);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student CRUD</h1>
      <div>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Lastname"
          value={form.lastname}
          onChange={(e) => setForm({ ...form, lastname: e.target.value })}
        />
        <input
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
        />
        <button onClick={handleSubmit}>{form._id ? "Update" : "Create"}</button>
      </div>

      <ul>
        {students.map((s) => (
          <li key={s._id}>
            {s.name} {s.lastname} - {s.age}{" "}
            <button onClick={() => handleEdit(s)}>Edit</button>{" "}
            <button onClick={() => s._id && handleDelete(s._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
