import React, {useState} from "react";

const TripTrove = () => {
    const [inputText, setInputText] = useState("");
    const [inputList, setInputList] = useState(["","","","",""]);
    const [addBtnActive, setAddBtnActive] = useState(true);
    const [genBtnActive, setGenBtnActive] = useState(false);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleAddInput = () => {
        console.log("Add button clicked.");
        console.log(inputText);
        console.log(inputList.length);
        if (inputText.trim() !== "" && inputList.length < 5) {
            setInputList((prevInput) => [...prevInput, inputText]);
            setInputText("");
            if (inputList.length + 1 === 5) {
                setAddBtnActive(false);
            }
            if (inputList.length === 0) {
                setGenBtnActive(true);
            }
        }
        else if (inputText.trim() !== ""){
            //Error: Maximum of 5 words reached
        } else{
            //Error: Input is empty
        }
    };

    const handleRemoveInput = (index) => {
        setInputList((prevInput) => {
            const updatedList = [...prevInput];
            updatedList.splice(index, 1);
            // Activate 'Add' button when an item is removed
            setAddBtnActive(true);
            // Deactivate 'Generate' button when all words are removed
            setGenBtnActive(updatedList.length > 0);
            return updatedList;
        });
    };

    const handleGenerate = () => {
        console.log("Button clicked")
    };

    return (
        <div id={"home-container"}>
            <h1>Find your new vacation destination with <span className={"title"}>TripTrove</span></h1>
            <div className={"row"}>

                <section id="user-input" className={"half-page column"}>
                    <h2>Where are you leading yourself?</h2>
                    <div id={"input-div"}>
                        <input
                            type="text"
                            value={inputText}
                            onChange={handleInputChange}
                            placeholder="Replace with quote API"/>
                        <button
                            id={"add-btn"}
                            onClick={handleAddInput}
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
                                disabled={!genBtnActive}>
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
        </div>
    )
}

export default TripTrove;