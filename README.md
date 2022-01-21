# Todo Website 📝
a Todo app to manage your tasks and projects

## Features 💪
- User can add and delete tasks,
- User can add and delete projects.
- User can assign and move tasks to projects.
- User can add comments to tasks.
- User authentication with Google.
- Store tasks and projects in the cloud with firebase (for those who logged in).
- Store tasks and projects in local storage (for guests).

## Installation 🛠️
Run
```
npm install
```

The projects uses 3 environment variables, create `.env` file in the root with the following variables: <br/>
`API_KEY`: Browser key ( should be auto created by Firebase) from Google Cloud Platform <br/>
`AUTH_DOMAIN`: From Firebase Domain <br/>
`DATABASE_URL`: From Firebase Database <br/>
`APP_ID`: From Firebase <br/>
