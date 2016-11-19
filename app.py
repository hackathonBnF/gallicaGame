#!/usr/bin/env python
from flask import Flask, request
from flask_cors import CORS
import json
import requests
import xmltodict

app = Flask(__name__)
CORS(app)

def to_json(xml_string):
    return json.dumps(xmltodict.parse(xml_string))

@app.route('/work')
def get_work():
    id = request.args.get('id')
    print id
    xml_body = requests.get('http://oai.bnf.fr/oai2/OAIHandler?verb=GetRecord&metadataPrefix=oai_dc&identifier=oai:bnf.fr:gallica/{}'.format(id)).content
    return app.response_class(to_json(xml_body), content_type='application/json')

if __name__ == '__main__':
    app.run()