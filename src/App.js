import React, { useState } from 'react';
import './App.css'
export default function App() {
  const [prompts, setPrompts] = useState([{ text: '', image: null }]);
  const [loading, setLoading] = useState(false);

  async function query(data) {
    try {
      setLoading(true);
      const response = await fetch(
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
        {
          headers: {
            "Accept": "image/png",
            "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.blob();
      return URL.createObjectURL(result);
    } catch (error) {
      console.error("Error during API call:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e, index) => {
    const updatedPrompts = [...prompts];
    updatedPrompts[index].text = e.target.value;
    setPrompts(updatedPrompts);
  };

  const handleGenerateImage = async (index) => {
    try {
      const response = await query({ "inputs": prompts[index].text });
      const updatedPrompts = [...prompts];
      updatedPrompts[index].image = response;
      setPrompts(updatedPrompts);
    } catch (error) {
      console.error(`Error in handleGenerateImage (${index}):`, error.message);
    }
  };

  const handleAddPrompt = () => {
    setPrompts([...prompts, { text: '', image: null }]);
  };

  const handleRemovePrompt = (index) => {
    const updatedPrompts = [...prompts];
    updatedPrompts.splice(index, 1);
    setPrompts(updatedPrompts);
  };

  return (
    <div>
      <div>
        {/* <h1 className='safdf'>Comic Generator</h1> */}
        {prompts.map((prompt, index) => (
          <div key={index}>
            <label htmlFor={`inputText${index}`}>Enter Image Description {index + 1}:</label>
            <input
              type="text"
              id={`inputText${index}`}
              value={prompt.text}
              onChange={(e) => handleInputChange(e, index)}
            />
            <button onClick={() => handleGenerateImage(index)} disabled={loading}>
              Generate Image {index + 1}
            </button>
            {prompts.length > 1 && (
              <button onClick={() => handleRemovePrompt(index)}>
                Remove Prompt {index + 1}
              </button>
            )}
          </div>
        ))}
        <button onClick={handleAddPrompt}>Add New Prompt</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {prompts.map((prompt, index) => (
            <div key={index}>
              {prompt.image ? (
                <div>
                  <img src={prompt.image} alt={`Generated Image ${index + 1}`} />
                  <p>{prompt.text}</p>
                </div>
              ) : (
                <p>No image generated for prompt {index + 1} yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
