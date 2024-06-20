# Webshop

i.

- Name: Sunny Chowdhury
- Email: Sunny.Chowdhury@abo.fi

ii. All the mandatory and optional requirements are implemented.

iii. To run the project, follow the instructions below.

#### The instructions are based on linux (ubuntu) machine.

- clone to project inside a directory.

```sh
git clone https://github.com/AA-IT-WebTechCourse/webshopproject2023-Sunnycse10.git
cd webshopproject2023-Sunnycse10/
git checkout demo
```

- This webshopproject2023-Sunnycse10 directory contains backend and frontend directory. At first, go to backend directory.
- Then install virutal environment inside backend directory.
- Activate the virtual environment.
- Install the requirements from the requirements.txt file.

```sh
cd backend/
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

- Go to my_ecommerce_project directory, then migrate the database and then run the backend application.

```sh
cd my_ecommerce_project/
python manage.py migrate
python manage.py runserver
```

- Now, the server should be running at http://localhost:8000/
- Now open another terminal and go back to the webshopproject2023-Sunnycse10 directory. There is another directory named "frontend", go to frontend directory, then install the required packages using npm and then run the frontend application.

```sh
cd frontend/
npm install
npm run dev
```

- The frontend application should be running at http://localhost:3000/
- Go to browser ( \*use chrome please, because I faced few issued on edge) , go to this link http://localhost:3000/ , the navbar should include a button named "populate db", clicking on it should generate demo database according to the project requirements. The landing page also has a button like this. If you want to generate from landing page, go to http://localhost:8000/ and click on "populate db"
- All the options in navbar are self explanatory and they should act according to the project requirement.

## Tech

##### Backend

- Django
- Django rest framework
- djangorestframework-simplejwt

##### Frontend

- Next.js (version 14.2.3)
- Next-auth (4.24)
