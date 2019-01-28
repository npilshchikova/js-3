python3 flask server used as 'back-end' for current TODO list

to run it:

 * install python3
 * install requirements

```sh
pip3 install -r test_server/requirements.txt
```

 * run flask server

 ```
 python3 test_server/simple_server.py
 ```

after that, it will be available at `http://127.0.0.1:5000` with two possible endpoints: `/tasks` and `/tasks/id`.
New test data will be created in each server run, since random generation used.
