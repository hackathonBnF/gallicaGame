#!/usr/bin/env python
from flask import Flask, request, redirect, url_for
from flask_cors import CORS
from util import create_mongo_client, to_json, create_response
import requests

app = Flask(__name__)
CORS(app)
user_id_generator = 0
quests = {
    1: "Quest 1",
    2: "Quest 2",
    3: "Quest 3"
}

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
    response = {
        'user_id': user_id_generator,
        'quests': quests
    }
    return create_response(app, response)

# /quest/start?quest_id=&user_id=
@app.route('/quest/start/<int:quest_id>/')
def init_quest(quest_id):
    global user_id_generator    
    keys = quests.keys()
    
    if not quest_id in keys:
        response = "Cet id n'existe pas. Merci d'entrer l'un des ids suivants : "
        response += ", ".join(str(x) for x in keys) + "."
        return create_response(app, response)
        
    user_id_generator += 1
    return redirect(url_for('start_quest', quest_id=quest_id, user_id = user_id_generator))
    
@app.route('/quest/start/<int:quest_id>/<int:user_id>/')
def start_quest(quest_id, user_id):
    global user_id_generator
    if user_id > user_id_generator+1:
        user_id_generator +=1
        return redirect(url_for('start_quest', quest_id=quest_id, user_id= user_id_generator))
    
    if user_id > user_id_generator:
        user_id_generator+=1
    
    item = {
        "user_id": user_id,
        "quest_id": quest_id,
        "started": True,
        "finished": False
    }
    found = list(db.quests.find(item))
    if found != []:
        return create_response(app, {"action": "find", "value": found})
        
    db.quests.insert(item)
    return create_response(app, {"action": "add", "value": [item]})

# /quest/finish?quest_id=&user_id=
@app.route('/quest/finish/<int:quest_id>/<int:user_id>/')
def finish_quest(quest_id, user_id):
    # bad user
    if user_id > user_id_generator:
        return create_response(app, {"Error": "user_id '" + str(user_id) + "' does not exist."})
    
    item = {
        "user_id": user_id,
        "quest_id": quest_id,
        "started": True,
        "finished": False
    }
    
    found = list(db.quests.find(item))
    # try to finish a non-started quest
    if found == []:
        message = "user_id '" + str(user_id) + "' does not start quest '" + quests[quest_id] + "'"
        return create_response(app, {"Error": message})
    
    response = db.quests.update(
        {'user_id': user_id, 'quest_id': quest_id},
        {'$set': {'finished': True}})
    found = list(response)
    return create_response(app, {"action": "update", "value": found})
    
    
if __name__ == '__main__':
    app.run()
