import React, {useState} from "react";

const TripTrove = () => {
    const [inputText, setInputText] = useState("");
    const [inputList, setInputList] = useState("");

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleAddInput = () => {
        if (inputText.trim() !== '') {
            setInputList((prevInput) => [...prevInput, inputText]);
            setInputText('');
        }
    };

    const handleGenerate = () => {
        console.log("Button clicked")
    };

    return (
        <div id={"home-container"}>
            <div id="user-input-card">
                <h2>Where are you leading yourself?</h2>
                <div>
                    <input
                        type="text"
                        value={inputText}
                        onChange={handleInputChange}
                        placeholder="Replace with quote API"/>
                    <button onClick={handleAddInput}>
                        Add
                    </button>
                </div>
            </div>

            <div id="input-list">
                <ul>
                    {inputList.map((input, index) => (
                        <li key={index}>{input}</li>
                    ))}
                </ul>
                <button onClick={handleGenerate}>
                    Generate your next journey
                </button>
            </div>

        </div>
    )
}

export default TripTrove;