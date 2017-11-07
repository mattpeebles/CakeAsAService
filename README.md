# Cake as a Service
[![Build Status](https://travis-ci.org/mattpeebles/CakeAsAService.svg?branch=master)](https://travis-ci.org/mattpeebles/CakeAsAService)

## Design Decisions

The only information I allowed to travel from the back-end to front-end was the TopLeft Coordinate object via the api. The only information I allowed to travel from the front to back-end was the body that POST required. I did this so that the backend API could easily function outside of the frontend that I built.

### Backend Design
The biggest design decision on the backend was using the image-size npm package to determine the sizes of the images. This package allows analysis of many different image file types and can analyze urls or direct uploads.
	Currently the backend only supports URLs, returning a 400 status code anything else. As image-size returns a promise when analyzing URLs, the `canContain` function are chained promises to take advantage of that. This allows easy chaining in the route. If canContain resolves false then we can immediately send a 400 status code.

The logic of the API is split into two main functions - `canContain` and `centerLogo`. These are the only two functions that are called directly within the api/design-a-cake route in `cake.js`.
	`canContain` returns a boolean value based on whether the base can contain the logo based on the areas of the images. If it can, it also provides the dimensions of the base and logo for `centerLogo` to calculate the top left coordinate of the logo.
	`centerLogo` calculates the top left coordinate of the logo by subtracting the width and height of the logo from the width and height of the base and then divides each by two. To ensure that this top left coordinate centers the image, `isCentered` calculates the other 3 coordinates and ensures the area above the logo equals the area below, and likewise for the area to the left and right. If so,
	it then rounds the top left coordinate down to correspond to an actual pixel within the image. Doing so after the check, ensures that isCentered does not need to deal with rounding areas. 

The middleware is contained in index.js, the router is contained in the route folder, and the server in server.js. Modularizing like this allows for an easy seperation of concerns so it is much easier to debug and expand as needed.

### Frontend Design
The frontend was created using React. I wanted to give users feedback about their images as they typed/pasted the url into the form, specifically what the image looked like and the size of the image. Reacts ability to focus updates on particular areas of the DOM made this extremely quick to render changes. React's lifecycle events also gives me great control over components that had mounted or updated. - making it extremely easy to know if my images had loaded on the DOM, for instance.

Finally, I didn't want to use any external libraries for image manipulation, so I used the canvas to combine the elements.


## Framework Reasoning
On the backend, node.js and Express were used. The main reason I used these frameworks is because I'm extremely familiar with node and like the wealth of libraries npm makes available.

On the frontend, React was used. To summarize, I wanted to provide users instant feedback, have control over component lifecycles, and keep track of state in the app to provide a better user experience.

## References
- Getting image size on front end - https://stackoverflow.com/a/20569043/8454047
- Integrating Express and React on Heroku - https://daveceddia.com/create-react-app-express-production/
- image-size corrupt streaming issue - https://github.com/image-size/image-size/issues/37
- Understanding how to rotate the canvas https://stackoverflow.com/questions/24004820/how-can-i-rotate-a-canvas-containing-an-image-by-90-180-270-degrees

## cURL command
curl -H "Content-Type: application/json" -d '{"base":"`BASE-IMAGE-URL`", "logo":"`LOGO-IMAGE-URL`"}' https://fast-anchorage-86250.herokuapp.com/api/design-a-cake

## Setup

The backend and frontend are independent and do not need each other to function properly.

### Backend
After downloading the repo to your local machine, run `npm init` and `npm start`. If you'd like to further develop it, I recommend `npm run dev` to have the server automatically refresh on changes. You can then make curl requests to 
curl -H "Content-Type: application/json" -d '{"base":"`BASE-IMAGE-URL`", "logo":"`LOGO-IMAGE-URL`"}' http://localhost:3030/api/design-a-cake

### Frontend
After downloading the repo to your local machine, `cd` into `client` and run `npm init` and `npm start`. This will start the react client which will automatically open on localhost:3000.

If you'd like to concurrently develop the front and backend, change the proxy in `client/package.json` to `http://localhost:3030` and change the `fetch` url in the `getTopLeftCoordinate` function in `client/App.js`.