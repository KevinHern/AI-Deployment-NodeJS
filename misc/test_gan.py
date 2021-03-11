import json
import requests
import base64

try:
	r = requests.get('http://127.0.0.1:16000/predict')
	json_data = json.loads(r.text)
	print(json_data)
	imgdata = base64.b64decode(json_data['generated_img'])
	filename = 'new_img.jpg'
	with open(filename, 'wb') as f:
		f.write(imgdata)
except Exception as e:
	print(e)