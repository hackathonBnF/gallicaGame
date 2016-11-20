#!/usr/bin/env python
from flask import Flask, request, redirect, url_for
from flask_cors import CORS
from util import create_mongo_client, to_json, create_response
import requests

app = Flask(__name__)
CORS(app)

# Globals
user_id_generator = 0
steps = 0
quests = {
    1: {
        "Name": "Quest 1",
        "Desctiption": "This is the first quest.",
        "Steps": {
            1: "",
            2: "",
            3: ""
        }
    }
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
        response = "Quest '" + str(quest_id) + "' does not exist. Thank to use one of those : "
        response += ", ".join(str(x) for x in keys) + "."
        return create_response(app,
            {
                "Error": response,
                "ErrorCode": 0
            }, 403)
        
    user_id_generator += 1
    return redirect(url_for('start_quest', quest_id=quest_id, user_id = user_id_generator))
    
@app.route('/quest/start/<int:quest_id>/<int:user_id>/')
def start_quest(quest_id, user_id):
    global user_id_generator
    if user_id > user_id_generator+1:
        return redirect(url_for('start_quest', quest_id=quest_id, user_id = user_id_generator+1))
    
    if user_id > user_id_generator:
        user_id_generator+=1
    
    item = {
        "user_id": user_id,
        "quest_id": quest_id,
        "started": True
    }
    
    found = list(db.quests.find(item))
    if found != []:
        response = db.quests.update(
        {'user_id': user_id, 'quest_id': quest_id},
        {'$set': {'finished': False}})
        found = list(db.quests.find({"user_id": user_id, "quest_id": quest_id}))
        return create_response(app, {"action": "find", "value": found})
        
    item['finished'] = False
    db.quests.insert(item)
    return create_response(app, {"action": "add", "value": [item]})

# /quest/update?quest_id=&step=
@app.route('/quest/update/<int:quest_id>/<step>/')
def update_quest(quest_id, step):
    global steps
    steps+=1
    return create_response(app,
    {
        "action": "update",
        "step": steps})

# /quest/finish?quest_id=&user_id=
@app.route('/quest/finish/<int:quest_id>/<int:user_id>/')
def finish_quest(quest_id, user_id):
    # bad user
    if user_id > user_id_generator:
        return create_response(app,
            {
                "Error": "user_id '" + str(user_id) + "' does not exist.",
                "ErrorCode": 1
            }, 403)
    
    item = {
        "user_id": user_id,
        "quest_id": quest_id,
        "started": True,
        "finished": False
    }
    
    found = list(db.quests.find(item))
    # try to finish a non-started quest
    if found == []:
        message = "User '" + str(user_id) + "' does not start quest '" + quests[quest_id]['Name'] + "'"
        return create_response(app,
            {
                "Error": message,
                "ErrorCode": 2
            }, 403)
    
    response = db.quests.update(
        {'user_id': user_id, 'quest_id': quest_id},
        {'$set': {'finished': True}})
    found = list(db.quests.find({"user_id": user_id, "quest_id": quest_id}))
    return create_response(app, {"action": "update", "value": found})
    
if __name__ == '__main__':
    app.run()
