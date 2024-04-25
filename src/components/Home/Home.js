import React, { useState, useEffect } from "react";
import "./home.scss";
import bg from "../../assets/bg.png";
import lock from "../../assets/lock.png";
import Modal from "../Modal/Modal";
import arrow from "../../assets/Vector.png";
import enter from "../../assets/enter.png";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedNoteName, setSelectedNoteName] = useState(null);
  const [isInNotesBox, setIsInNotesBox] = useState(false);
  const [textareaValue, setTextareaValue] = useState("");
  const [notesByGroup, setNotesByGroup] = useState({});

  useEffect(() => {
    const storedGroups = JSON.parse(localStorage.getItem("groups")) || [];
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || {};

    setGroups(storedGroups);
    setNotesByGroup(storedNotes);
  }, []);

  const closeModal = () => setShowModal(false);

  const createGroup = (notesName, selectedColor) => {
    const notesIcon = generateNoteIcon(notesName);
    const newGroup = {
      name: notesName,
      icon: notesIcon,
      backgroundColor: selectedColor,
    };
    setGroups([...groups, newGroup]);

    localStorage.setItem("groups", JSON.stringify([...groups, newGroup]));
  };

  const generateNoteIcon = (noteName) => {
    if (!noteName) return '';
  
    const words = noteName.trim().split(/\s+/); 
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
  
    const firstWord = words[0];
    const lastWord = words[words.length - 1];
    return `${firstWord.charAt(0).toUpperCase()}${lastWord.charAt(0).toUpperCase()}`;
  };


  const handleNoteName = (nameOfNote) => {
    setSelectedNoteName((prevSelectedNoteName) =>
      prevSelectedNoteName === nameOfNote ? null : nameOfNote
    );

    setIsInNotesBox(true);

    if (window.innerWidth < 768) {
      document.querySelector(".menu").classList.add("menu-hidden-mobile");
      document.querySelector(".notes-box").classList.add("notes-box-visible-mobile");
    } else {
      document.querySelector(".menu").classList.remove("menu-hidden-mobile");
      document.querySelector(".notes-box").classList.remove("notes-box-visible-mobile");
    }
  };

  const handleArrowClick = () => {
    setIsInNotesBox(false);
    if (window.innerWidth < 768) {
      document.querySelector(".menu").classList.remove("menu-hidden-mobile");
    }
  };

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addNoteWithTimeDate(textareaValue);
      setTextareaValue("");
    }
  };

  const addNoteWithTimeDate = (noteText) => {
    const now = new Date();
    const day = now.getDate();
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(now);
    const year = now.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;
    const time = now.toLocaleTimeString();

    // Get the selected group's notes array or create a new one if it doesn't exist.
    const selectedNotes = notesByGroup[selectedNoteName] || [];

    const newNote = {
      text: noteText,
      time: time,
      date: formattedDate,
    };

    const updatedNotes = [...selectedNotes, newNote];

    setNotesByGroup({
      ...notesByGroup,
      [selectedNoteName]: updatedNotes,
    });

    // Update localStorage for the selected group's notes.
    const updatedLocalStorage = {
      ...JSON.parse(localStorage.getItem("notes")) || {},
      [selectedNoteName]: updatedNotes,
    };
    localStorage.setItem("notes", JSON.stringify(updatedLocalStorage));
  };

  const handleEnterImageClick = () => {
    if (textareaValue.trim() !== "") {
      addNoteWithTimeDate(textareaValue);
      setTextareaValue("");
    }
  };

  return (
    <>
      <div className="container">
        <div className="menu ">
          <div className="heading">
            <h1>Pocket Notes</h1>
          </div>
          <button className="add" onClick={() => setShowModal(true)}>
            <p id="symbol">+</p>
          </button>
          {showModal && (
            <Modal closeModal={closeModal} createGroup={createGroup} />
          )}
          <div className="notes scrollableContainer">
            {groups.map((note, index) => (
              <div
                className="notes-details"
                key={index}
                style={{
                  backgroundColor: note.name === selectedNoteName ? "#F7ECDC" : "transparent",
                  borderRadius: "20px"

                }}
              >
                <div
                  className="icon"
                  style={{ backgroundColor: note.backgroundColor }}
                >
                  <p>{note.icon}</p>
                </div>
                <div className="name">
                  <p onClick={() => handleNoteName(note.name)}>{note.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="notes-box">
          {isInNotesBox ? (
            <div className="notebox-heading">
              {selectedNoteName &&
                groups.map((note, index) => {
                  if (note.name === selectedNoteName) {
                    const selectedNotes = notesByGroup[selectedNoteName] || [];
                    return (
                      <>
                        <div key={index} className="note-header">
                          <p onClick={handleArrowClick}>
                            <img src={arrow} alt="" />
                          </p>
                          <div
                            className="icon"
                            style={{ backgroundColor: note.backgroundColor }}
                          >
                            <p>{note.icon}</p>
                          </div>
                          <h1>{note.name}</h1>
                        </div>
                        <div className="notes-written">
                          {selectedNotes.map((note, index) => (
                            <div key={index} className="notes-col">
                              <div className="desc">
                                <p>{note.text}</p>
                              </div>


                              <div className="time-date">
                               
                                <p>{note.date}</p>
                                
                        <span className="dot"></span>
                              <p>{note.time}</p>
                                
                              
                      
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="footer">
                          <textarea
                            placeholder="Enter your text here..."
                            value={textareaValue}
                            onChange={handleTextareaChange}
                            onKeyDown={handleEnterKeyPress}
                            
                          ></textarea>
                          <img
                            src={enter}
                            alt=""
                            width="20px"
                            height="20px"
                            onClick={handleEnterImageClick}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                      </>
                    );
                  }
                  return null;
                })}
            </div>
          ) : (
            <div className="content">
              <div className="center-content">
                <img src={bg} alt=""></img>
                <h2>Pocket Notes</h2>
                <p>
                  Send and receive messages without keeping your phone online.
                  Use Pocket Notes on up to 4 linked devices and 1 mobile phone
                </p>
              </div>
              <div className="bottom-content">
                <p>
                  <img src={lock} alt=""></img> end-to-end encrypted
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
