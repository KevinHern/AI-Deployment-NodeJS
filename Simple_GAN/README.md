# AI Deployment in NodeJS: MNIST GAN
Small demo to deploy a simple GAN that can generate digits from 0 to 9.

## How to install the app
Clone the repo and run the following command inside the cloned directory:

```bat
npm install
```

## How to run app

```bat
node index.js
```

## How to make the AI work
The AI is a simple Generator from a GAN (model taken from this [colab](https://colab.research.google.com/github/tensorflow/docs/blob/master/site/en/tutorials/generative/dcgan.ipynb)). No parameters should be sent.
The app listens on the port 16000 and by default, it runs locally on your machine (127.0.0.1).
Use an app that can send GET requests to the said port and IP address:

http://127.0.0.1:16000/predict

## Where is the AI model?
It is located in the *__assets/ai/__* directory. Make sure that there are 4 files inside the directory:
1. model.json
2. group1-shard1of3.bin
3. group1-shard2of3.bin
4. group1-shard3of3.bin

## Testing
A file with the name of *test_gan.py* in the *__misc/__* directory has been provided to test this app. Execute the program and it will send a GET request to the AI server. It will receive an ecoded base64 image from said server and the python program will decode it and create a new 28x28 grayscale image.

It requires the following libs to work:
* json
* requests
* base64

To use the python program, execute the following:

```bat
python test_gan.py
```

## Additional Notes
* To check how to the code works, make sure to read the *__index.js__* file.