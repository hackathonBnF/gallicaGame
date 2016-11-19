from pymongo import MongoClient

mongo = MongoClient()

mongo.find({})
mongo.insert({})
mongo.update({}, {'$set': {'fieldName': 'newValue'}})