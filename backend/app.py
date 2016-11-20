#!/usr/bin/env python
from flask import Flask, request, redirect, url_for
from flask_cors import CORS
from os import environ
from pymongo import MongoClient
from bson.json_util import dumps
import requests
import xmltodict

app = Flask(__name__)
CORS(app)
user_id_generator = 0
quests = {
    1: "Quest 1",
    2: "Quest 2",
    3: "Quest 3"
}

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
@app.route('/quests')
def get_quests():
    global user_id_generator
    user_id_generator += 1
    response = {
        'user_id': user_id_generator,
        'quests': quests
    }
    return app.response_class(dumps(response), content_type='application/json')

# /quest/start?quest_id=&user_id=
@app.route('/quest/start/<int:quest_id>/')
def init_quest(quest_id):
    global user_id_generator    
    keys = quests.keys()
    
    if not quest_id in keys:
        response = "Cet id n'existe pas. Merci d'entrer l'un des ids suivants : "
        response += ", ".join(str(x) for x in keys) + "."
        return app.response_class(dumps(response), content_type='application/json')
        
    user_id_generator += 1
    return redirect(url_for('start_quest', quest_id=quest_id, user_id = user_id_generator))
    
@app.route('/quest/start/<int:quest_id>/<int:user_id>/')
def start_quest(quest_id=None, user_id=None):
    item = {
        "user_id": user_id,
        "quest_id": quest_id,
        "started": True,
        "finished": False
    }
    
    response = db.quests.insert_one(item).inserted_id
    return app.response_class(dumps(response), content_type='application/json')

# /quest/finish?quest_id=&user_id=


if __name__ == '__main__':
    app.run()
