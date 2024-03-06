import React, {useState} from "react";
import Modal from "react-modal";

const TripTrove = () => {
    //Config screen button and input states
    const [inputText, setInputText] = useState("");
    const [inputList, setInputList] = useState([]);
    const [addBtnActive, setAddBtnActive] = useState(true);
    const [genBtnActive, setGenBtnActive] = useState(false);
    const [gptResponse, setGptResponse] = useState("");
    const [modalInput, setModalInput] = useState("");
    const [modalInputActive, setModalInputActive] = useState(false);

    //Modal
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

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
        apiCall();
    };

    const apiCall = () => {
        const apiUrl = "http://localhost:3095/generate";
        const requestBody = {
            inputList: inputList
        };

        fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => response.json())
            .then(data => {
                console.log("API response:", data); //Handling GPT response
                setGptResponse(data.content);
                setLoading(false);
                setModalInputActive(true);
            })
            .catch(error => {
                console.error("Error fetching data:", error); //Handling API errors
                setLoading(false);
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
            >
                {loading && <div className={"loading-icon"}>Loading...</div>}
                {!loading &&
                    <div id={"modal-content"}>
                        <h4>Please answer these short questions for your perfect destination.</h4>
                        <p>
                            {gptResponse}
                        </p>
                        {modalInputActive &&
                        <input
                            type="text"
                            value={modalInput}
                            placeholder=""/>
                        }
                    </div>
                }
            </Modal>

        </div>
    )
}

export default TripTrove;