# AI Deployment in NodeJS: Image Classification
Small demo to deploy an Image Classificatior AI in a NodeJS App

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
The AI is a simple image classificator (model taken from this [colab](https://www.tensorflow.org/tutorials/images/classification)). It receives an image *encoded in base64* and returns the class it belongs to.
The app listens on the port 16000 and by default, it runs locally on your machine (127.0.0.1).
Use an app that can send images encoded en base 64 and be sure to send POST request to the said port and IP address:

http://127.0.0.1:16000/predict

In the body, send a json with the following format:

```json
{
	"img": <base64 string>,
	"ext": <image extension>
}
```

*NOTE: the image extension is an optional parameter.*

The server returns a JSON containing the following format:


```json
{
	"predicted_class": <class>
}
```

## Where is the AI model?
It is located in the *__assets/ai/__* directory. Make sure that there are 5 files inside the directory:
1. model.json
2. group1-shard1of4.bin
3. group1-shard2of4.bin
4. group1-shard3of4.bin
5. group1-shard4of4.bin

## Testing
A file with the name of *test_img_class.py* in the *__misc/__* directory has been provided to test this app. Pass the name of the image you want to classify to the app and it can encode it using base64 encription.

It requires the following libs to work:
* json
* requests
* base64

To use the python program, execute the following:

```bat
python test_img_class.py <path_to_img>
```


## Additional Notes
* To check how to the code works, make sure to read the *__index.js__* file.