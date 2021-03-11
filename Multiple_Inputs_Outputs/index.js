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
async function runModel(inputA, inputB){
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
		// (in this case, the model expects 2 float tensors)
		const dataA = tf.tensor1d([inputA]).cast('float32');
		const dataB = tf.tensor1d([inputB]).cast('float32');

		/*
			4. Call the predict function. In this case, the model expects 2 inputs; make sure both
			of them are in a list in the expected order. However, do not call '.dataSync()' yet,
			the model gives 2 outputs which are wrapped up in an array, so calling
			'model.predict(inputs).dataSync()' results in an error.
			This model gives 2 tensors as outputs, so after calling '.predict()', we have to iterate
			over all the raw results and call '.dataSync()' on them to get a Float32Array.

			And finally, do not forget to access position 0 of the Float32Array to retrieve the actual
			result!
		*/
		const inputs = [dataA, dataB];
		const tensorResults = model.predict(inputs);
		var results = {};
		for(var i = 0; i < tensorResults.length; i++){
			results['y' + i.toString()] = tensorResults[i].dataSync()[0];
		}
		return results;
	});

	// 5. Do stuff with the outputs
	// (In this case, the processing we have already done inside the tf.tidy() function is enough)
	return predictions;
}

// This is the main URL to do predictions
app.post('/predict', async function (req, res) {
	// Sanity Check: Checking if the x1 and x2 fields exist in the JSON
	if (typeof req.body.x1 !== 'undefined' && req.body.x1 !== null &&
		typeof req.body.x2 !== 'undefined' && req.body.x2 !== null){		
		try{
			// Run the Model and be sure to await it
			const results = await runModel(req.body.x1, req.body.x2);
			res.json(results);
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