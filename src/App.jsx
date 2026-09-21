// src/App.jsx
import FeedbackForm from "./components/FeedbackForm";
import "./App.css"; // <--- Импортируем стили App.css

function App() {
  return (
    <div className="app">
      <h1>Форма обратной связи</h1>
      <FeedbackForm />
    </div>
  );
}

export default App;