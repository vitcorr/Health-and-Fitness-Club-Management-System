# project
CONTRIBUTERS
------------
Doyinsola Sayyidah Akindele     101192813
Victor Kolawole                 101201377

HOW TO RUN
----------
1. Make sure you're in the project directory
2. Open pgAdmin4 and create a database called project_1
3. Open project/sql/create_and_populate.sql and run to create all the tables and populate with initial data you can test with.
4. Install node modules with
    - npm install
5. Run website with
    - nodemon server.js OR 
      node server.js
6. To run the scenario queries, open project/sql/queries.sql in pgAdmin4

NOTE: The connection string is based on my personal details. If yours doesn't match, change line 10 or server.js
username: postgres
password: password
host: localhost
server: 5432
database name: project_1

FUNCTIONALITY
-------------
- Login as a member with username = damibisi and password = damispassword
- Change and save personal details
- Add new health metric
- Get exercise routine
- Register as a new member
- Login as admin with username = admin and password = admin
- Get all trainers
- Create new trainer
- Log in as a trainer