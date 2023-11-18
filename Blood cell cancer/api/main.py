import uvicorn
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


MODEL = tf.keras.models.load_model("../saved_models/1")

CLASS_NAMES = ['Benign', '[Malignant] Pre-B', '[Malignant] Pro-B', '[Malignant] early Pre-B']


def read_file_as_image(data) -> np.ndarray:

    image = np.array(Image.open(BytesIO(data)).resize((256,256)))
    return image


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        image = read_file_as_image(await file.read())
        image_batch = np.expand_dims(image, 0)
        prediction = MODEL.predict(image_batch)
        predicted_class = CLASS_NAMES[np.argmax(prediction[0])]
        confidence = float(np.max(prediction[0]))
        confidence = f"{confidence:.3f}"
        return {
            'class': predicted_class,
            'confidence': confidence
        }
    except Exception as e:
        return {
            'error': str(e)
        }





# Example usage:



if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8000)
