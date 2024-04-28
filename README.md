# survey_app

## Installation procedure

Two separate project need to setup for run complete application.

### Backend(Django)

For implement backend/api I use Django, Django Rest Framework and Postgresql database. For install full project
and dependency follow below instruction,

1. Python3 and Pip and Venv Must be installed in your system
2. Activate the Venv by this command
    ```
    source bin/activate
    ```
3. Create a database in postgresql, named **survey_app**.
4. Create a **.env** file and add those two lines ->
   ```
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   ```
5. Run the command below to install all the packages
   ```
   pip install - r requirements.txt
   ```
   
6. Now go to project directory and run those two commands to create database
tables.
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```
7. Now create a super user by running this command and follow the instruction.
   ```
   python manage.py createsuperuser
   ```
8. Finally Run the project with this commnd.
   ```
   python manage.py runserver
   ```
   

### Frontend (Angular.js)
Frontend or client side application are implemented with Angular.js that is a javascript
framework. To install this project it is a very easy and simple steps we need to follow.

1. Node and angular cli must be installed in your system.
2. Now go to project directory and run ->
   ```
   npm install
   ```
   This should install all dependencies of the project.
3. Now run this command to deploy project on localhost.
   ```
   ng server

   ```

## Overview
![Screenshot from 2024-04-28 21-12-15](https://github.com/Md-Jahid-Hasan/survey_app/assets/58201576/bc0a4de0-ba27-463d-81e9-b8d6dfdf17bf)

This is a page for viewing the list of survey. Red indicates that survey end. In the right most button if the text is **Join** then you already join the survey and if the text is **Enter** you don't join in that survey.

![Untitled (1)](https://github.com/Md-Jahid-Hasan/survey_app/assets/58201576/5c56512b-84e1-421d-8a2f-26ef55b75ae0)

In the left side there is a timer and based on how much time left it change the color. In the right side ther is **Logout** button and the a small button indicate **save** that remark that my current is saved in database. If it indicate **draft** and red color then it remark thak my current change still not saved in database. And then **Previous** and **Next** button for switch question and submit button.

