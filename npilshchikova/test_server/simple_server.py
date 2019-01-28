import datetime
import random
import urllib.request
import urllib.error
from flask import Flask
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse


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
    return final_date.strftime('%Y-%m-%d')


def random_bool():
    value = random.random()
    return value < 0.5


def generate_sample_data():

    tasks = []

    # add tasks to list
    for i in range(random.randint(5, 25)):
        # task will be a dict to simplify serialization to json
        tasks.append({
            'id': i,
            'name': create_random_task_name(),
            'description': create_random_task_description(),
            'deadline': random_date(),
            'done': random_bool()
        })

    return tasks


# global sample data
tasks = generate_sample_data()


class TaskList(Resource):

    def get(self):
        return tasks


class Task(TaskList):

    def get(self, task_id):
        for task in tasks:
            if task_id == task['id']:
                return task, 200
        return 'Nod found', 404

    def post(self, task_id):
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        parser.add_argument('description')
        parser.add_argument('deadline')
        parser.add_argument('done', type=bool)
        args = parser.parse_args()

        for task in tasks:
            if task_id == task['id']:
                return 'Task with id {} already exists'.format(task_id), 400

        new_task = {
            'id': task_id,
            'name': args['name'],
            'description': args['description'],
            'deadline': args['deadline'],
            'done': args['done']
        }
        tasks.append(new_task)
        return new_task, 201

    def put(self, task_id):
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        parser.add_argument('description')
        parser.add_argument('deadline')
        parser.add_argument('done', type=bool)
        args = parser.parse_args()

        for task in tasks:
            if task_id == task['id']:
                if args['name'] is not None:
                    task['name'] = args['name']
                if args['description'] is not None:
                    task['description'] = args['description']
                if args['deadline'] is not None:
                    task['deadline'] = args['deadline']
                if args['done'] is not None:
                    task['done'] = args['done']
                return task, 200

        new_task = {
            'id': task_id,
            'name': args['name'],
            'description': args['description'],
            'deadline': args['deadline'],
            'done': args['done']
        }
        tasks.append(new_task)
        return new_task, 201

    def delete(self, task_id):
        global tasks
        tasks = [task for task in tasks if task['id'] != task_id]
        return 'Task with id {} deleted'.format(task_id), 200


if __name__ == '__main__':
    # flask application
    app = Flask(__name__)
    api = Api(app)
    api.add_resource(TaskList, '/tasks')
    api.add_resource(Task, '/tasks/<int:task_id>')

    # CORS
    cors = CORS(app, resources={
        r"/tasks": {"origins": "*"},
        r"/tasks/*": {"origins": "*"}
    })

    # run
    app.run()
