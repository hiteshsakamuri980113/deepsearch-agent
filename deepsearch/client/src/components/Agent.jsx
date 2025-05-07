import { useState, useRef } from "react";
import "./Agent.css"; // Updated CSS file for styling

function Agent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const openModal = () => {
    setIsModalOpen(true);

    // Initialize modal position when opened
    const modal = modalRef.current;
    if (modal) {
      modal.style.left = "50%";
      modal.style.top = "50%";
      modal.style.transform = "translate(-50%, -50%)"; // Center the modal
      modal.style.position = "fixed"; // Ensure it's fixed in the viewport
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDrag = (e) => {
    const modal = modalRef.current;
    if (!modal) return;

    const rect = modal.getBoundingClientRect();
    modal.style.left = `${rect.left + e.movementX}px`;
    modal.style.top = `${rect.top + e.movementY}px`;
    modal.style.transform = "none"; // Disable centering during dragging
  };

  const startDragging = (e) => {
    if (e.target.className === "chatbot-header") {
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", stopDragging); // Corrected event name
    }
  };

  const stopDragging = () => {
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDragging); // Corrected event name
  };

  return (
    <div>
      <button className="chat-button" onClick={openModal}>
        Chat with Agent
      </button>

      {isModalOpen && (
        <div
          className="chatbot-window"
          ref={modalRef}
          onMouseDown={startDragging}
        >
          <div className="chatbot-header">
            <span>Chatbot</span>
            <button className="close-button" onClick={closeModal}>
              &times;
            </button>
          </div>
          <iframe
            src="http://127.0.0.1:8000"
            title="Agent"
            className="chatbot-iframe"
          ></iframe>
        </div>
      )}
    </div>
  );
}

export default Agent;
