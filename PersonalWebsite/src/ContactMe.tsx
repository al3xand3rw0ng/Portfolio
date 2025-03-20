import { useState } from "react";
import Select from "react-select";
import emailjs from "emailjs-com";

export default function ContactMe() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!message.trim()) {
      setError("Message is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");

    const templateParams = {
      firstName,
      lastName,
      email,
      topic,
      message,
    };

    emailjs
      .send(
        "gmail", // service ID
        "template_yxrr3ls", // template ID
        templateParams,
        "tgZS9nsTLMzI6SBlw" // public key
      )
      .then(
        () => {
          setSuccess(
            "Your message has been sent. I will review it and get back to you as soon as possible. Thank you!"
          );
          setFirstName("");
          setLastName("");
          setEmail("");
          setMessage("");
          setTopic("");
        },
        (error) => {
          setError("Failed to send message. Please try again later.");
          console.error("EmailJS error:", error);
        }
      );
  };

  const styles = {
    control: (base: any, { isFocused }: any) => ({
      ...base,
      borderRadius: "0.375rem",
      fontFamily: "serif",
      borderColor: isFocused ? "#66afe9" : "#dee2e6",
      boxShadow: isFocused ? "0 0 0 0.2rem rgba(38, 143, 255, 0.25)" : "none",
      "&:hover": {
        borderColor: isFocused ? "#66afe9" : "#dee2e6",
      },
      cursor: "pointer",
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#585c5e",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused && "#fff6ba",
      color: state.data.value === state.selectProps.value ? "#ffd700" : "#000",
      fontFamily: "serif",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#fff6ba",
        color: "#000",
      },
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: 0,
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  const options = [
    { value: "Question", label: "Question" },
    { value: "Comment", label: "Comment" },
    { value: "Suggestion", label: "Suggestion" },
    { value: "Bug Report", label: "Bug Report" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="container">
      <h1 className="text-center">Contact Me</h1>
      {error && <p className="text-danger text-center mb-2">{error}</p>}
      {success && <p className="text-success text-center mb-2">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center">
          <input
            className="form-control mb-2 me-2"
            id="first-name"
            placeholder="Enter your first name...*"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="form-control mb-2"
            id="last-name"
            placeholder="Enter your last name...*"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-center">
          <input
            className="form-control mb-2 w-50"
            type="email"
            placeholder="Enter your email...*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-center">
          <div className="form-floating mb-2 w-50">
            <Select
              options={options}
              styles={styles}
              onChange={(selectedOption: any) =>
                setTopic(selectedOption?.value || "")
              }
              value={options.find((option) => option.value === topic)}
              placeholder="Select topic...*"
            />
          </div>
        </div>
        <div className="d-flex justify-content-center">
          <textarea
            className="form-control mb-2 w-50"
            placeholder="Enter your message...*"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <p className="text-center mb-2">* Mandatory Fields</p>
        <div className="d-flex justify-content-center">
          <button
            type="submit"
            className={`send-btn ${
              !firstName || !lastName || !email || !message || !topic
                ? "disabled"
                : ""
            }`}
            disabled={!firstName || !lastName || !email || !message || !topic}
          >
            <img src="./images/send.png" className="send-img" alt="send" />
          </button>
        </div>
      </form>
    </div>
  );
}
