import datetime
import random
import urllib.request
import urllib.error
from flask import Flask
from flask_restful import Api, Resource, reqparse


class TaskList(Resource):

    def get(self, task_id):
        pass

    def post(self, task_id):
        pass

    def put(self, task_id):
        pass

    def delete(self, task_id):
        pass


def create_random_task_description():
    starts = ['I should', 'It is necessary to', 'I must', 'It is planned to']
    actions = ['do', 'create', 'find', 'investigate', 'explore', 'update', 'pass', 'write', 'read', 'buy', 'send']
    adjectives = ['a funny', 'a nice', 'an incredible', 'a scary', 'a really difficult', 'an interesting', 'a useful',
                  'a very important', 'a useless', 'a dummy', 'a forgotten']
    objects = ['exam', 'task', 'umbrella', 'mountain climbing', 'code review', 'project', 'story', 'book', 'doll',
               'hamburger', 'teapot', 'apple', 'picture', 'rope', 'bottle', 'candy', 'bed', 'violin', 'answer']
    subjects = ['my mom', 'a boss', 'sister\'s dog', 'our planet', 'wild animals', 'my parents', 'old lady',
                'our neighbours', 'geranium', 'team members', 'teachers', 'students', 'kitties']
    conclusions = ['until it will be too late', 'in future', 'sometime... may be after college', 'today',
                   'before my parents come back home', 'by the weekend', 'by the end of the day', 'today... or later']

    return ' '.join([random.choice(v) for v in [starts, actions, adjectives, objects, ['for'], subjects, conclusions]])


def create_random_task_name():
    try:
        url = 'https://frightanic.com/goodies_content/docker-names.php'  # docker names generation service
        response = urllib.request.urlopen(url)
        response_string = response.read().decode()
        name = ' '.join([w.capitalize() for w in response_string.strip().split('_')])
    except urllib.error.URLError:
        name = 'Some name'
    return name


def random_date():
    current_date = datetime.datetime.today()
    if random.random() < 0.5:
        final_date = current_date - datetime.timedelta(days=random.randint(0, 15))
    else:
        final_date = current_date + datetime.timedelta(days=random.randint(0, 15))
    return final_date.strftime('%d-%m-%Y')


def random_bool():
    value = random.random()
    return value < 0.5


def generate_sample_data():

    tasks = []

    # add tasks to list
    for i in range(random.randint(5, 20)):
        # task will be a dict to simplify serialization to json
        tasks.append({
            'id': i,
            'name': create_random_task_name(),
            'description': create_random_task_description(),
            'deadline': random_date(),
            'done': random_bool()
        })

    return tasks


if __name__ == '__main__':
    # sample data
    sample_data = generate_sample_data()

    # flask application
    app = Flask(__name__)
    api = Api(app)
    api.add_resource(TaskList, 'tasks/<string:id>')

    # run
    app.run()
