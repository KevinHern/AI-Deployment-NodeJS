import json
import requests
import base64
import sys

try:
	filename = sys.argv[0]
	data['ext'] = filename.split('.')[-1]
	data = {}
	with Image.open(filename) as img:
		width, height = img.size
	with open(filename, mode='rb') as file:
		data['img'] = base64.encodebytes(file.read()).decode('utf-8')
	r = requests.post('http://127.0.0.1:16000/predict', json=data)
	json_data = json.loads(r.text)
	print(json_data)
except Exception as e:
	print(e)