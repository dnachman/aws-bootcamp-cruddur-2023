# Week 1 — App Containerization

-   Set up backend-flask as per the Readme.md
    -   set up venv - added `venv` to `.gitignore`
    -   running locally required loading the requirements.txt dependencies, not just flask:
        ` pip3 install -r requirements.txt`
        ![](assets/wk1/python-setup.png)
    -   Ran backend on gitpod, modified home_activities.py:
        ![](assets/wk1/run-backend.png)
    -   Created `Dockerfile`
    -   Build the image
        `docker build -t backend-flask:latest .`
        ![](assets/wk1/docker-images-backend.png)
-   Set up frontend-react-js
    -   `npm install`
    -   `cp .env.example .env` (this was a **gotcha** for me the first time - also ensure you rebuild the image if you change this)
    -   Created `Dockerfile`
    -   Added `.dockerignore` to exclude node_modules because I have a layer in the dockerfile that runs `npm install`
