#!/usr/bin/env python
from flask import Flask, request
from flask_cors import CORS
from os import environ
from pymongo import MongoClient
from bson.json_util import dumps
import requests
import xmltodict

app = Flask(__name__)
CORS(app)

if 'MONGODB_URI' in environ:
    mongo = MongoClient(environ['MONGODB_URI'])
else:
    mongo = MongoClient('mongodb://localhost:27017/test')

db = mongo.get_default_database()

def to_json(xml_string):
    return dumps(xmltodict.parse(xml_string))

@app.route('/work')
def get_work():
    id = request.args.get('id')
    print id
    xml_body = requests.get('http://oai.bnf.fr/oai2/OAIHandler?verb=GetRecord&metadataPrefix=oai_dc&identifier=oai:bnf.fr:gallica/{}'.format(id)).content
    return app.response_class(to_json(xml_body), content_type='application/json')

@app.route('/mongo/test')
def mongo_test():
    return app.response_class(dumps(list(db.test.find({}))), content_type='application/json')

# /quests -> user_id, [quest_id...]
# /quest/start?quest_id=&user_id=
# /quest/finish?quest_id=&user_id=
if __name__ == '__main__':
    app.run()