// src/components/FeedbackForm.jsx
import { useState } from "react";
import "./FeedbackForm.css";

function FeedbackForm() {
  // --- 1. Состояния значений полей
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [wantReply, setWantReply] = useState(false); // Чекбокс «Хочу получить ответ»

  // --- 2. Состояние ошибок валидации
  const [errors, setErrors] = useState({
    name: null,
    email: null,
    phone: null,
    message: null,
  });

  // --- 3. Состояние «тронутых» полей
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    message: false,
  });

  // --- 4. Состояние отправки
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // --- Функция маски телефона ---
  const formatPhone = (value) => {
    if (!value) return "";
    let numbers = value.replace(/\D/g, "");
    if (numbers.startsWith("8") || numbers.startsWith("7")) {
      numbers = numbers.substring(1);
    }
    if (numbers.length === 0) return "";

    let result = "+7";
    if (numbers.length > 0) {
      result += " (" + numbers.substring(0, 3);
    }
    if (numbers.length >= 4) {
      result += ") " + numbers.substring(3, 6);
    }
    if (numbers.length >= 7) {
      result += "-" + numbers.substring(6, 8);
    }
    if (numbers.length >= 9) {
      result += "-" + numbers.substring(8, 10);
    }
    return result;
  };

  // --- Функции валидации ---
  const validateName = (value) => {
    if (!value.trim()) return "Имя обязательно для заполнения";
    if (value.trim().length < 2) return "Минимум 2 символа";
    return null;
  };

  // Зависимая валидация Email
  const validateEmail = (value, currentWantReply) => {
    // Если чекбокс включен, поле становится обязательным
    if (currentWantReply && !value.trim()) {
      return "Email обязателен, раз вы хотите получить ответ";
    }
    // Если что-то введено (или чекбокс активен), проверяем формат
    if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return "Некорректный формат email";
    }
    return null;
  };

  const validatePhone = (value) => {
    if (!value.trim()) return "Телефон обязателен для заполнения";
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(value))
      return "Некорректный формат: +7 (XXX) XXX-XX-XX";
    return null;
  };

  const validateMessage = (value) => {
    if (!value.trim()) return "Сообщение обязательно для заполнения";
    if (value.trim().length < 10) return "Минимум 10 символов";
    return null;
  };

  // --- Обработчик изменения полей ---
  const handleChange = (field, value) => {
    if (field === "phone") {
      const formatted = formatPhone(value);
      setPhone(formatted);
      if (touched.phone) {
        setErrors((prev) => ({ ...prev, phone: validatePhone(formatted) }));
      }
    } else {
      switch (field) {
        case "name":
          setName(value);
          if (touched.name) setErrors((prev) => ({ ...prev, name: validateName(value) }));
          break;
        case "email":
          setEmail(value);
          if (touched.email) setErrors((prev) => ({ ...prev, email: validateEmail(value, wantReply) }));
          break;
        case "message":
          setMessage(value);
          if (touched.message) setErrors((prev) => ({ ...prev, message: validateMessage(value) }));
          break;
        default:
          break;
      }
    }
  };

  // --- Обработчик изменения чекбокса ---
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setWantReply(checked);

    // Динамически перепроверяем email при переключении галочки
    if (touched.email) {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(email, checked),
      }));
    }
  };

  // --- Обработчик потери фокуса ---
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    let error = null;
    if (field === "name") error = validateName(name);
    if (field === "email") error = validateEmail(email, wantReply);
    if (field === "phone") error = validatePhone(phone);
    if (field === "message") error = validateMessage(message);

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // --- Отправка формы ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(name),
      email: validateEmail(email, wantReply),
      phone: validatePhone(phone),
      message: validateMessage(message),
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, message: true });

    if (Object.values(newErrors).some((err) => err !== null)) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const getInputClass = (field) => {
    const classes = ["field_input"];
    if (touched[field] && errors[field]) classes.push("field_input--error");
    else if (touched[field] && !errors[field]) classes.push("field_input--valid");
    return classes.join(" ");
  };

  if (submitted) {
    return (
      <div className="feedback-form feedback-form--success">
        <h2>Спасибо за обращение!</h2>
        <button
          type="button"
          onClick={() => {
            setName("");
            setEmail("");
            setPhone("");
            setMessage("");
            setWantReply(false);
            setErrors({ name: null, email: null, phone: null, message: null });
            setTouched({ name: false, email: false, phone: false, message: false });
            setSubmitted(false);
          }}
        >
          Отправить ещё
        </button>
      </div>
    );
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      {/* Имя */}
      <div className="field">
        <label className="field_label">Имя</label>
        <input
          type="text"
          className={getInputClass("name")}
          value={name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
        />
        {touched.name && errors.name && <span className="field_error">{errors.name}</span>}
      </div>

      {/* Телефон */}
      <div className="field">
        <label className="field_label">Телефон</label>
        <input
          type="text"
          placeholder="+7 (___) ___-__-__"
          className={getInputClass("phone")}
          value={phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          onBlur={() => handleBlur("phone")}
        />
        {touched.phone && errors.phone && <span className="field_error">{errors.phone}</span>}
      </div>

      {/* Email + Чекбокс под ним */}
      <div className="field">
        <label htmlFor="email" className="field_label">
          Email {wantReply && <span style={{ color: "red" }}>*</span>}
        </label>
        <input
          id="email"
          type="email"
          className={getInputClass("email")}
          value={email}
          onChange={(e) => handleChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
        />

        {/* Чекбокс компактным шрифтом близко к полю */}
        <label className="field_hint" style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", marginTop: "6px", fontSize: "12px", color: "#667085" }}>
          <input
            type="checkbox"
            checked={wantReply}
            onChange={handleCheckboxChange}
            style={{ cursor: "pointer" }}
          />
          Хочу получить ответ
        </label>

        {touched.email && errors.email && <span className="field_error">{errors.email}</span>}
      </div>

      {/* Сообщение */}
      <div className="field">
        <label className="field_label">Сообщение</label>
        <textarea
          className={getInputClass("message")}
          value={message}
          onChange={(e) => handleChange("message", e.target.value)}
          onBlur={() => handleBlur("message")}
        />
        {touched.message && errors.message && <span className="field_error">{errors.message}</span>}
      </div>

      <button type="submit" className="feedback-form_submit" disabled={isSubmitting}>
        {isSubmitting ? "Отправка..." : "Отправить"}
      </button>
    </form>
  );
}

export default FeedbackForm;