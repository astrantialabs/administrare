from pymongo import MongoClient

class Database():
    def getCluster(mongoDBURI: str):
        return MongoClient(mongoDBURI)


    def getDatabase(mongoDBURI: str, database: str):
        return MongoClient(mongoDBURI)[database]

    
    def getCollection(mongoDBURI: str, database: str, collection: str):
        return MongoClient(mongoDBURI)[database][collection]