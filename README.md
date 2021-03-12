# AI Deployment in NodeJS
This is a repo that contains multiple examples to deploy different AI models in production using NodeJS.
Feel free to clone, use and modify the files according to your needs.

All of the examples are ready to be deployed on a heroku server. To do so, make sure to follow [this tutorial](https://devcenter.heroku.com/articles/deploying-nodejs).
Additionally, all the *__package.json__* files cointained within the multiple directories already have the "engine" section added. Do not forget to modify the NodeJS version to match the one you are currently using.

## Requirements
Make sure you have NodeJS and NPM installed in your computer. Follow [this link](https://nodejs.org/es/download/) to install both.

# FAQ

## How can I use my model trained in a Google Colab in a NodeJS app?
It is very simple.
First, to export your model, you need to install the __tensorflowjs__ library to access the export functions

```bat
!pip install tensorflowjs
```

Then, save your trained model using the __.save()__ method in a directory.

```python
# Example
temp_dir = './temp/'
model = tf.keras.models.Sequential()
.
.
.
model.save(temp_dir)
```

After that, execute the following command to export your saved model into a json file.

```bat
!tensorflowjs_converter --input_format=keras_saved_model ./temp/ ./prod/
```

*NOTE: The second parameter is the directory that contains your saved model. The third parameter is the directory that your exported model's files are going to be located. You must find a __model.json__ file and some binaries too.*

And finally, download all the files contained within the *__./prod/__* directory and place them inside the __assets__ directory of your NodeJS app. Execute the following code in the colab to compress all the files onto a zip and download said file.

```python
!zip packed_model.zip ./prod/*

from google.colab import files
files.download("packed_model.zip")
```

## Is it possible to export models with custom layers?
No. This [issue](https://github.com/tensorflow/tfjs/issues/2721) states that there is no support for custom layers. As stated by *__rthadur__*, the workaround is to define the model with equivalent layers. 