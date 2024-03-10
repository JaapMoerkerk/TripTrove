import React, {useEffect, useState} from "react";
import Modal from "react-modal";

const TripTrove = () => {
    //Config screen button and input states
    const [inputText, setInputText] = useState("");
    const [inputList, setInputList] = useState(["Mountains", "Terraces", "Hiking", "Europe"]);
    const [addBtnActive, setAddBtnActive] = useState(true);
    const [genBtnActive, setGenBtnActive] = useState(true);
    const [gptResponse, setGptResponse] = useState("");
    const [sessionId, setSessionId] = useState("");

    //Modal/chatbox
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [chatInputActive, setChatInputActive] = useState(false);
    const [weatherResponse, setWeatherResponse] = useState("");

    useEffect(() => {
        if (!sessionId) {
            const newSessionId = `session_${Date.now()}`;
            setSessionId(newSessionId);
        }
    }, [sessionId]);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
        setGenBtnActive(inputList.length > 0);
    };

    const handleAddInput = () => {
        if (inputText.trim() !== "" && inputList.length < 5) {
            setInputList((prevInput) => [...prevInput, inputText]);
            setInputText("");
            if (inputList.length === 4) {
                setAddBtnActive(false)
            }
            setGenBtnActive(true);
        }
    };

    const handleRemoveInput = (index) => {
        setInputList((prevInput) => {
            const updatedList = [...prevInput];
            updatedList.splice(index, 1);
            if (updatedList.length < 5) {
                setAddBtnActive(true);
            }
            setGenBtnActive(updatedList.length > 0);
            return updatedList;
        });
    };

    const handleGenerate = () => {
        console.log("Generate button clicked");
        setModalIsOpen(true);
        setLoading(true);
        apiCall(inputList);
    };

    const apiCall = (input, isChatInput = false) => {
        const apiUrl = "https://triptrove-backend.onrender.com/generate";
        const requestBody = isChatInput
            ? {chatInput: input, sessionId}
            : {inputList: input, sessionId};

        fetch(apiUrl, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(requestBody),
        })
            .then(response => response.json())
            .then(data => {
                setGptResponse(data.content);
                setLoading(false);
                setChatInputActive(true); // Reactivate chat input only after receiving response
                setChatInput(""); // Clear chat input after sending
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    };

    const handleSendChatInput = () => {
        if (chatInput.trim() !== "") {
            setLoading(true);
            setChatInputActive(false); // Deactivate chat input button to prevent multiple sends
            apiCall(chatInput, true); // Call API with chat input, indicating it's a chat response
        }
    }

    const fetchWeatherInfo = () => {
        const apiUrl = "https://triptrove-backend.onrender.com/weather";
        const requestBody = { sessionId };

        setLoading(true); // Show loading indicator while fetching weather info
        fetch(apiUrl, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        })
            .then(response => response.json())
            .then(data => {
                setWeatherResponse(data.content); // Set weather response
                setLoading(false); // Hide loading indicator
            })
            .catch(error => {
                console.error("Error fetching weather information:", error);
                setLoading(false); // Hide loading indicator in case of an error
                setWeatherResponse("Failed to fetch weather information."); // Error message
            });
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div id={"home-container"}>
            <h1>Find your new vacation destination with <span className={"title"}>TripTrove</span></h1>
            <div className={"row"}>

                <section id="user-input" className={"half-page column"}>
                    <h2>Where are you leading yourself?</h2>
                    <h3>Pick up to 5 words to start the search for your perfect destination.</h3>
                    <div id={"input-div"}>
                        <input
                            type="text"
                            value={inputText}
                            onChange={handleInputChange}
                            placeholder="Like 'Beach' or 'Clubbing'"/>
                        <button
                            id={"add-btn"}
                            onClick={handleAddInput}
                            className={addBtnActive ? "" : "btn-deactivated"}
                            disabled={!addBtnActive}
                        >
                            Add
                        </button>
                    </div>
                </section>

                <section id="input-list" className={"half-page column"}>
                    <ul>
                        <button id={"gen-btn"}
                                onClick={handleGenerate}
                                className={genBtnActive ? "" : "btn-deactivated"}
                                disabled={!genBtnActive}
                        >
                            Generate your next journey
                        </button>

                        {inputList.map((input, index) => (
                            <li key={index}>
                                {input}
                                <button id={"remove-btn"} onClick={() => handleRemoveInput(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </section>

            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel={"Chat Modal"}
                className={"Modal"}
                // Other modal props remain unchanged
            >
                <h4>The destination is AI generated based on your input. Feel free to ask questions about this location or ask for alternatives.</h4>
                {loading && <div className={"loading-icon"}>Loading...</div>}
                {!loading && (
                    <div id={"modal-content"}>
                        <p>{gptResponse}</p>
                        {chatInputActive && (
                            <div id={"chat-input"}>
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(event) => setChatInput(event.target.value)}
                                    placeholder="Type your answer..."
                                />
                                <button onClick={handleSendChatInput}
                                        className={chatInputActive ? "" : "btn-deactivated"}>
                                    Send
                                </button>
                            </div>
                        )}
                        {!loading && gptResponse && (
                            <div>
                                <button onClick={fetchWeatherInfo} className="weather-btn">
                                    What is the weather like there?
                                </button>
                                {weatherResponse && <p>{weatherResponse}</p>}
                            </div>
                        )}
                    </div>
                )}
            </Modal>

        </div>
    )
}

export default TripTrove;