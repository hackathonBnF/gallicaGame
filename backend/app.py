#!/usr/bin/env python
from flask import Flask, request
from flask_cors import CORS
from util import create_mongo_client, to_json, create_response
import requests

app = Flask(__name__)
CORS(app)
user_id_generator = 0
db = create_mongo_client()

@app.route('/work')
def get_work():
    id = request.args.get('id')
    print id
    xml_body = requests.get('http://oai.bnf.fr/oai2/OAIHandler?verb=GetRecord&metadataPrefix=oai_dc&identifier=oai:bnf.fr:gallica/{}'.format(id)).content
    return create_response(to_json(xml_body))

@app.route('/mongo/test')
def mongo_test():
    items = list(db.test.find({}))
    return create_response(app, items)

# /quests -> user_id, [quest_id...]
@app.route('/quests')
def get_quests():
    global user_id_generator
    user_id_generator += 1
    quests = {
        1: "Quest 1",
        2: "Quest 2",
        3: "Quest 3"
    }
    response = {
        'user_id': user_id_generator,
        'quests': quests
    }
    return create_response(app, response)

# /quest/start?quest_id=&user_id=
@app.route('/quest/start/<int:quest_id>/<int:user_id>')
def start_quest(quest_id, user_id):
    # todo Caro!
    pass

# /quest/finish?quest_id=&user_id=
if __name__ == '__main__':
    app.run()
