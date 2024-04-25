import React, { useState, useEffect } from "react";
import "./modal.scss";

const Modal = ({ closeModal, createGroup }) => {
  const [selectedColor, setSelectedColor] = useState('purple');
  const [noteName, setNoteName] = useState("");

  const selectColors = (color) => {
    if (selectedColor === color) {
      setSelectedColor(null);
    } else {
      setSelectedColor(color);
    }
  };

  const getBorderStyle = (color) => {
    return selectedColor === color ? { border: "1px solid black" } : {};
  };

  const handleNameChange = (e) => {
    setNoteName(e.target.value);
  };

  const handleForm = (e) => {
    e.preventDefault();
    if (noteName && selectedColor) {
      createGroup(noteName, selectedColor);
      const existingNoteNames = JSON.parse(localStorage.getItem("storedNoteName")) || [];
      const updatedNoteNames = [...existingNoteNames, noteName];
      localStorage.setItem("storedNoteName", JSON.stringify(updatedNoteNames));
    }
    closeModal();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.classList.contains("modal-wrapper")) {
        closeModal();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [closeModal]);

  return (
    <>
      <div className="modal-wrapper"></div>
      <div className="modal-container">
        <div className="modal">
          <div className="title">
            <h1>Create New Notes group</h1>
          </div>
          <div className="form">
            <form onSubmit={handleForm}>
              <label>Group Name</label>
              <input
                type="text"
                placeholder="Enter your group name..."
                required
                onChange={handleNameChange}
              ></input>
              <br />
              <div className="color-box">
                <label>Choose colour</label>

                <div className="colors">
                  <p
                    id="purple"
                    onClick={() => selectColors("#b38bfa")}
                    style={getBorderStyle("#b38bfa")}
                    
                  ></p>
                  <p
                    id="pink"
                    onClick={() => selectColors("#ff79f2")}
                    style={getBorderStyle("#ff79f2")}
                  ></p>
                  <p
                    id="green"
                    onClick={() => selectColors("#43e6fc")}
                    style={getBorderStyle("#43e6fc")}
                  ></p>
                  <p
                    id="orange"
                    onClick={() => selectColors("#f19576")}
                    style={getBorderStyle("#f19576")}
                  ></p>
                  <p
                    id="blue"
                    onClick={() => selectColors("#0047ff")}
                    style={getBorderStyle("#0047ff")}
                  ></p>
                  <p
                    id="skyblue"
                    onClick={() => selectColors("#6691ff")}
                    style={getBorderStyle("#6691ff")}
                  ></p>
                </div>
              </div>
              <div className="buttons">
                <button type="submit" >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
