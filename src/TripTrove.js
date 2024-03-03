import React, {useState} from "react";

const TripTrove = () => {
    const [inputText, setInputText] = useState("");
    const [inputList, setInputList] = useState([]);

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleAddInput = () => {
        if (inputText.trim() !== '') {
            setInputList((prevInput) => [...prevInput, inputText]);
            setInputText('');
        }
    };

    const handleRemoveInput = (index) => {
        setInputList((prevInput) => prevInput.filter((_, i) => i !== index));
    }

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
                        <button id={"add-btn"} onClick={handleAddInput}>
                            Add
                        </button>
                    </div>
                </section>

                <section id="input-list" className={"half-page column"}>
                    <ul>
                        <button id={"gen-btn"} onClick={handleGenerate}>
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