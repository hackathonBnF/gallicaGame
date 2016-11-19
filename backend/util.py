from bson.json_util import dumps
from os import environ
from pymongo import MongoClient
import xmltodict

def create_mongo_client():
    if 'MONGODB_URI' in environ:
        mongo = MongoClient(environ['MONGODB_URI'])
    else:
        mongo = MongoClient('mongodb://localhost:27017/test')

    return mongo.get_default_database()

def create_response(app, content):
    return app.response_class(dumps(content), content_type='application/json')

def to_json(xml_string):
    return xmltodict.parse(xml_string)