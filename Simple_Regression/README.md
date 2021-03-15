# AI Deployment in Node.js: Simple Regression
Small demo on how to deploy an simple Linear Regression AI in a Node.js App.

## How to install the app
Clone the repository and run the following command inside the cloned directory:

```bat
npm install
```

## How to run the app

```bat
node index.js
```

## How to make the AI work
The AI is a simple linear regression predictor taken from this [colab](https://colab.research.google.com/drive/1fCnJRyOl71Pho3y-ZcSFil9KvV6edX9V). It receives a float number and outputs a result of the form of  *__y = 2x+1__* (for all positives. If negative, then it returns 0).
The app listens on the port 16000 and by default, it runs locally on your machine (127.0.0.1).
Use an app like Postman and send a POST request to the said port and IP address:

http://127.0.0.1:16000/predict

In the body, send a JSON with the following format:

```json
{
	"x": 100.0
}
```

*NOTE: You can replace the number to get a different output.*

The server returns a JSON with the following format:


```json
{
	"result": <number>
}
```

## Where is the AI model?
It is located in the *__assets/__* directory. Make sure that there are 2 files inside the directory:
1. model.json
2. group1-shard1of1.bin

## Additional Notes
* To check how to the code works, make sure to read the *__index.js__* file.