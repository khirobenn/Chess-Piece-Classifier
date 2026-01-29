from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
import imageio.v3 as iio

class_names = ['Bishop', 'King', 'Knight', 'Pawn', 'Queen', 'Rook']

img_width = 224
img_height = 224

model = tf.keras.models.load_model("model_v2.keras")

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def ping():
    return "Hello, I am running !"

@app.post("/predict")
async def predict(file: UploadFile):
    img_bytes = await file.read()
    image = iio.imread(img_bytes, index=None)
    img_array = np.expand_dims(image, axis=0)
    img_array = tf.image.resize(img_array, [img_width, img_height])
    return class_names[np.argmax(model.predict(img_array))]    