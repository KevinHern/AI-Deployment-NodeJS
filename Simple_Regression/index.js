/*
	THIS IS A NODEJS-EXPRESS BACKEND APPLICATION
	You must install 3 mandatory packages:
	1. Express JS (npm install express --save):
		To manage routing and function execution.
	2. Body Parser (npm install body-parser --save):
		To parse JSON, text, Raw and URL encoded data.
	3. Tensorflow JS (npm install @tensorflow/tfjs-node):
		Get the tensorflow library to manage all the AI related stuff.
*/

// Imports
const express = require('express');
const tf = require('@tensorflow/tfjs-node');

// Instantiation
var app = express();
app.use(express.json()); // To be able to read and write JSONs

// Functions
// IMPORTANT: the function that loads and calls the model must be an async function!
async function runModel(input){
	// 1. Provide the PATH to the model.json after the 'file://'
	const modelPath = 'file://assets/ai/model.json';		

	// 2. Load the model and await it
	const model = await tf.loadLayersModel(modelPath);

	// 2.1 When manipulating tensors and calling .predict on a model, wrap it up in a tf.tidy() function
	// This function frees the resources used when pre processing tensors.
	// Memory management is critical!
	const predictions = tf.tidy(() => {
		// 3. Data Preprocessing:
		// Transform the data into tensors and cast the data into the correct expected data type
		// (in this case, the model expects a float tensor)
		const data = tf.tensor1d([input]).cast('float32');

		// 4. Call the predict function. It is, by default, an async function. Do not forget
		// to add the '.dataSync()' method to retrieve the output tensor from the model
		return model.predict(data).dataSync();
	});

	// 5. Do stuff with the output tensor
	// (In this case, we want to return the predict value for the given input. The tensor shape is [1,1] so
	// we retrieve the value at the first position)
	return predictions[0];
}

// This is the main URL to do predictions
app.post('/predict', async function (req, res) {
	// Sanity Check: Checking if the x field in the JSON exists
	if (typeof req.body.x !== 'undefined' && req.body.x !== null){		
		try{
			// Run the Model and be sure to await it
			const results = await runModel(req.body.x);
			res.json({result: results});
		}
		catch(error){
			console.log(error);
			res.sendStatus(500);
		}
	}
	// Send error if the X field does not exist in the JSON
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