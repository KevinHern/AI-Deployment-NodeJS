/*
	THIS IS A NODEJS-EXPRESS BACKEND APPLICATION
	You must install 4 mandatory packages:
	1. Express JS (npm install express --save):
		To manage routing and function execution.
	2. Body Parser (npm install body-parser --save):
		To parse JSON, text, Raw and URL encoded data.
	3. Tensorflow JS (npm install @tensorflow/tfjs-node):
		Get the tensorflow library to manage all the AI related stuff.
	4. Base64 to Uint8Array (npm install base64-to-uint8array):
		To decode base64 images
*/

// Imports
const express = require('express');
const tf = require('@tensorflow/tfjs');
const tfnode = require('@tensorflow/tfjs-node');
const fs = require('fs');
const toUint8Array = require('base64-to-uint8array')

// Instantiation
var app = express();
app.use(express.json()); // To be able to read and write JSONs

/* ----- FUNCTIONS ----- */
// This function does some preprocessing to the recieved image
function processImg(img64, modelInputShape, extension = ''){
	// 0. Setting up Image name and saving it (Optional)
	/*
	const timeStamp = Date.now().toString;
	const fileName = timeStamp + "." + extension;
	fs.writeFile('./temp/' + fileName, img64, 'base64', function(err) {
		console.log(err);
	});
	*/

	// 1. Pre Processing
	const newImg = tf.tidy(() => {
		// 1.1 Decoding Img
		const ui8Array = toUint8Array(img64);
		const decodedImg = tfnode.node.decodeImage(ui8Array);

		// 1.2 Resizing
		// Remember: modelInputShape is in the form of [newHeight, newWidth]
		const resizedImg = tf.image.resizeBilinear(decodedImg, modelInputShape);

		// 1.3 Normalizing [0, 1]

		/* METHOD 1: Getting min and max
		const maxVal = inputTensor.max();
		const minVal = inputTensor.min();

        const normalizedImg = decodedImg.sub(minVal).div(maxVal.sub(minVal));
        */

        /* METHOD 2: Manually set values */
        const normalizedImg = resizedImg.cast('float32').div(255.0);
        return normalizedImg;
	});
	//console.log(newImg.shape);

	// 2. Reshaping to match the model's input shape
	return newImg.reshape([1, 180, 180, 3]);
}

// IMPORTANT: the function that loads and calls the model must be an async function!
async function runModel(img64, extension = ''){
	/* ----- AI Section ----- */

	// 1. Provide the PATH to the model.json after the 'file://'
	const modelPath = 'file://assets/aiconv/model.json';	

	// 2. Load the model and await it
	const model = await tf.loadLayersModel(modelPath);

	// 2.1 When manipulating tensors and calling .predict on a model, wrap it up in a tf.tidy() function
	// This function frees the resources used when pre processing tensors.
	// Memory management is critical!
	const predictions = tf.tidy(() => {
		const img = processImg(img64, [180, 180], extension);
		// 3. Call the predict function. It is, by default, an async function. Do not forget
		// to add the '.dataSync()' method to retrieve the output tensor from the model
		return model.predict([img]).dataSync();
	});

	// 4. Do stuff with the output tensor
	// (In this case, we want to return the class the image belongs to)
	const classes = ['daisy', 'dandelion', 'roses', 'sunflowers', 'tulips'];
	const class_index = tf.argMax(predictions, 0).dataSync()[0];
	return classes[class_index];
}

// This is the main URL to do predictions
app.post('/predict', async function (req, res) {
	// Sanity Check: Checking if the 'img' field exists in the JSON
	if (typeof req.body.img !== 'undefined' && req.body.img !== null){
		try{
			// Run the Model and be sure to await it
			results = await runModel(req.body.img);
			res.json({predicted_class: results});
		}
		catch(error){
			console.log(error);
			res.sendStatus(500);
		}
	}
	// Send error if the 'img' field does not exist in the JSON
	else{
		res.sendStatus(500);
	}
	
})

// Route used for redirection if another route is attempted to get accesed
app.get('/*', function(req, res) {
	res.send('Hello :D');
});

// Route used for redirection if another route is attempted to get accesed
app.post('/*', function(req, res) {
	res.send('Hello :D');
});

// Instantiating the server
/*
	NOTE: There are 2 ports that the app can liston to.
	The process.env.PORT is port dynamically allocated to the app when it has been deployed on a production
	environment.
	The other port is a user assigned port for developing. This port only works locally
*/
var server = app.listen(process.env.PORT || 16000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})