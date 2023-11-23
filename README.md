## Before starting
This project uses Node v18.

## Scripts
1. `npm install` installs dependencies
2. `npm start` starts the server
3. `npm test` executes the tests

## Project structure

### /src directory
1. `index.ts` entry point for the app
2. `controllers` directory - controllers for routes
3. `services` directory - services used by controller
4. `interfaces` directory - interfaces for all objects
6. `utils` directory - useful functions, constants etc...

### /test directory
Includes all test, uses jest test framework.

### firebase
1) Go to firebase page and create new project
2) Get server key and save it as `key.json` in root directory
3) Create `notes` collection.
4) Enable email/password authentication in `Authentication->Sign-in method`
5) Set rules for accessing documents:
```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow only authenticated content owners access
    match /some_collection/{userId}/{documents=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId
    }
  }
}
```


### API docs

1) Register as a user
POST /singup
body:
```
{
    email: "example@email.com",
    password: "password"
}
```

2) Create a note
POST /notes
body:
```
{
    title: "title",
    content: "content"
}
```

2) Read all notes
GET /notes

3) Read specific note
GET /notes/:id

4) Edit a note
PATCH /notes/:id
body:
```
{
    content: "new content"
}
```

3) Delete a note
DELETE /notes/:id