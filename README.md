# ToDo's JS - Built with Snowpack and Tailwind CSS - Auth and Data with FaunaDB

Responsive todo app written in HTML, CSS and JavaScript and built with Snowpack and Tailwind CSS. Realtime CRUD operations with FaunaDB

## Features

- Responsive design
- User Authentication with `Fauna` built-in User authentication
- Fully integrated with `FaunaDB` for `CRUD` operations
- Saves `session` in the browser's `localstorage`
- Create Todo Lists
- Create Todo's Tasks
- Edit Task Name
- Prevents from creating duplicate Todo Lists
- Setup a `Desktop Notifications` per individual tasks (requires user permission)
- Background `worker` automatically marks tasks as `complete` if overdue and triggers notifications

## Getting Started

> Install dev dependencies

```sh
npm install
```

> Run the dev server

> All the dev files are in the `src` & `public` directories

```sh
npm start
```

> Get your free Fauna API KEY at https://fauna.com/

```js
// src/fauna.helpers.js
// Replace YOUR_API_KEY with yours
const fClient = new faunadb.Client({ secret: 'YOUR_API_KEY' })
```

> Build the production app

> All the production ready files will be put in the `build` directory

```sh
npm run build
```

## Optional

> Deploy to GitHub Pages for Free

> Must first activate this option on your own repo and set the `homepage` link in your `package.json`

> Learn more at https://guides.github.com/features/pages/

```sh
npm run deploy
```


See working demo at: https://luvagu.github.io/todos-js-snowpack-tailwind

Enjoy!
