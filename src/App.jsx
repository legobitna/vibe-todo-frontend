import { useEffect, useState } from "react";
import "./App.css";

// 환경변수에서 API_URL 읽기
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editInput, setEditInput] = useState("");

  // 할일 목록 불러오기
  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/`, { method: "GET" });
      const data = await res.json();
      setTodos(data);
    } catch (e) {
      alert("할일 목록을 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 할일 추가
  const addTodo = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const res = await fetch(`${API_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });
      if (!res.ok) throw new Error();
      setInput("");
      fetchTodos();
    } catch {
      alert("할일 추가 실패");
    }
  };

  // 할일 삭제
  const deleteTodo = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      fetchTodos();
    } catch {
      alert("삭제 실패");
    }
  };

  // 할일 수정
  const updateTodo = async (id) => {
    if (!editInput.trim()) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editInput }),
      });
      if (!res.ok) throw new Error();
      setEditId(null);
      setEditInput("");
      fetchTodos();
    } catch {
      alert("수정 실패");
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <h2>할일 목록</h2>
      <form onSubmit={addTodo} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할일을 입력하세요"
          style={{ flex: 1 }}
        />
        <button type="submit">추가</button>
      </form>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 20 }}>
        {todos.map((todo) => (
          <li
            key={todo._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            {editId === todo._id ? (
              <>
                <input
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button onClick={() => updateTodo(todo._id)}>저장</button>
                <button
                  onClick={() => {
                    setEditId(null);
                    setEditInput("");
                  }}
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <span style={{ flex: 1 }}>{todo.content}</span>
                <button
                  onClick={() => {
                    setEditId(todo._id);
                    setEditInput(todo.content);
                  }}
                >
                  수정
                </button>
                <button onClick={() => deleteTodo(todo._id)}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
