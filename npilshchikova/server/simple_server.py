from flask import Flask
from flask_restful import Api, Resource, reqparse


class Tasks(Resource):

    def get(self, id):
        pass

    def post(self, id):
        pass

    def put(self, id):
        pass

    def delete(self, id):
        pass


def generate_sample_data():
    return []


if __name__ == '__main__':
    # sample data
    sample_data = generate_sample_data()

    # flask application
    app = Flask(__name__)
    api = Api(app)
    api.add_resource(Tasks, 'tasks/<string:id>')

    # run
    app.run()
