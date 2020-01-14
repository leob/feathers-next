# feathers-next

This project shows how to integrate a [Next.js](https://github.com/zeit/next.js) application with a [Feathers](http://feathersjs.com) backend, including authentication (with user name/password) and Redux.

## About

The project was inspired by [feathers-next-example](https://github.com/Albert-Gao/feathers-next-example)
and by [this](https://github.com/hugotox/next.js/tree/canary/examples/with-cookie-auth-redux) example for the authentication part.

Contrary to [feathers-next-example](https://github.com/Albert-Gao/feathers-next-example), I decided to keep the Feathers backend (the API) separated from the "server" (SSR) part of the Next.js frontend. This means that we're running two separate server (node.js) processes.

This might add a (tiny) bit of overhead, but ultimately it makes the app easier to develop and maintain (and configure) because we don't mingle Feathers API backend code with Next.js server rendering code.

## Getting Started

The repository contains both the backend (Feathers) and the frontend (Next.js), in two separate directories ```server``` and ```client```.

To install the app (backend and frontend), open a terminal and issue the following commands:

```
# Clone the repo: 
git clone https://github.com/leob/feathers-next
# Now make sure that "nodemon" is installed, either as a global dependency, or as a local one -
# for details see the section 'Installing nodemon'
# Install and run the server part:
cd server
npm install
npm run start
# Then in another terminal, install and run the client part:
cd ..
cd client
npm install
npm run dev
# The command above ("npm run dev") supports hot reload, and is perfect for developing.
# For production however, be sure to do a "build" and "run" as follows:
npm run build
npm run start
# Click through the app both in 'development' and 'production' mode, and notice how the app is MUCH faster in production mode!
```
To view the app, open your browser and go to `http://localhost:3000`.
You should see the home page containing Login and Register links.

## Installing `nodemon`

When installing the project, right after the first step ("Cloning the repo"), you should make sure that `nodemon` is available, because this is needed for the app to run. You can do this in two ways: install `nodemon` globally, or install it locally.

If you want to install `nodemon` globally (so that it's available for all your node projects), then execute this command:

```
npm install nodemon -g
```

Alternatively, if you want to install it locally, add it as a dev dependency in `package.json` by executing:

```
npm install nodemon --save-dev
```

Both methods work, so this is a matter of preference (some people dislike global dependencies).

## Using the app

The home page of the app contains "Login" and "Register" links. Click on "Register", enter a user name and password of your choosing (choose anything you want, there are no restrictions) and click "Submit". You are now registered, and logged in.

Click on the other links (```private``` and ```private-perm-required```) to see if they work. The ```private``` page demonstrates how to call a Feathers service which requires authentication (in the Feathers backend we've implemented a simple "counters" service which always returns the same set of data).

To access the ```private-perm-required``` page, you need an "admin" user. Click ```Logout``` on the home page and then click ```Register```, and register a new user with the user name "admin". You should now be able to access the ```private-perm-required``` page.
