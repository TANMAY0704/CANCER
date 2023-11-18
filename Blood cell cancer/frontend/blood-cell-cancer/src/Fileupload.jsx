import { useState } from "react";
import './fileupload.css'

function FileUpload() {
    let [result, setResult] = useState({});
    let [file, setFile] = useState(null);
    let [isupload, setUpload] = useState(null);
    const handleChange = (event) => {
        setFile(event.target.files[0])
        if(event.target.files[0])
        setUpload(URL.createObjectURL(event.target.files[0]))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('file', file); // key, value
        console.log(formData)
        try {
            const endpoint = 'http://localhost:8000/predict'
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });
            const responseData = await response.json()
            setResult(responseData)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="container">
            <form className="form" action="submit" onSubmit={handleSubmit} >
                <div onClick={() => document.querySelector('.input-field').click()}>

                    {!isupload && (<label htmlFor="upload">UPLOAD IMAGE</label>)}
                    
                    <input className="input-field" type="file" name="upload" onChange={handleChange} hidden></input>
                    {isupload && <img className="image" src={isupload} width={250} height={200}></img>}
                </div>
                <button type="submit">Submit</button>
            </form>
            {result.class && result.confidence && (
                <div className="result">
                    <h1>Predicted Class: {result.class}</h1>
                    <h1>Confidence: {result.confidence}</h1>
                </div>
            )}
        </div>
    )
}

export default FileUpload;