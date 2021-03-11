# AI Deployment in NodeJS: Multiple Inputs and Outputs AI Model
Small demo to deploy an simple Linear Regression AI in a NodeJS App.

## How to install the app
Clone the repo and run the following command inside the cloned directory:

```bat
npm install
```

## How to run the app

```bat
node index.js
```

## How to make the AI work
The AI is a simple linear regression predictor. It receives 2 float numbers and outputs 2 results.
The app listens on the port 16000 and by default, it runs locally on your machine (127.0.0.1).
Use an app like Postman and send a POST request to the said port and IP address:

http://127.0.0.1:16000/predict

In the body, send a json with the following format:

```json
{
	"x1": 100.0,
	"x2": 5.0
}
```

*NOTE: You can replace the numbers to get a different output.*

The server returns a JSON with the following format:


```json
{
	"y1": <number>,
	"y2": <number>
}
```

## Where is the AI model?
It is located in the *__assets/__* directory. Make sure that there are 2 files inside the directory:
1. model.json
2. group1-shard1of1.bin

## Additional Notes
* To check how to the code works, make sure to read the *__index.js__* file.
