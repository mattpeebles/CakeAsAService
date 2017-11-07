# Cake as a Service
[![Build Status](https://travis-ci.org/mattpeebles/CakeAsAService.svg?branch=master)](https://travis-ci.org/mattpeebles/CakeAsAService)

## Design Decisions

### Backend Design
The biggest design decision on the backend was using the image-size npm package to determine the sizes of the images. This package allows analysis of many different image file types and can analyze urls or direct uploads.
	I split the function that actually returns the size of the image into two functions - `getSizeFromImageUrl` and `getSizeFromImage`. image-size returns a promise by neccessity when analyzing image urls, so for consistency getSizeFromImage also returns a promise. This allows easy chaining in the main function, `canContain`, so users can use both uploaded images and urls to make their cake.

The logic of the API is split into two main functions - `canContain` and `centerLogo`. These are the only two functions that are called directly within the api/design-a-cake route in `cake.js`.
	`canContain` returns a boolean value based on whether the base can contain the logo based on the areas of the images. If it can, it also provides the dimensions of the base and logo for `centerLogo` to calculate the top left coordinate of the logo.
	`centerLogo` calculates the top left coordinate of the logo by subtracting the width and height of the logo from the width and height of the base and then divides each by two. To ensure that this top left coordinate centers the image, `isCentered` calculates the other 3 coordinates and ensures the area above the logo equals the area below, and likewise for the area to the left and right. If so,
	it then rounds the top left coordinate down to correspond to an actual pixel within the image. Doing so after the check, ensures that isCentered does not need to deal with rounding areas. 

The middleware is contained in index.js, the router is contained in the route folder, and the server in server.js. Modularizing like this allows for an easy seperation of concerns so it is much easier to debug and expand as needed.

### Frontend Design



## Framework Reasoning
On the backend, node.js and Express were used. The main reason I used these frameworks is because I'm extremely familiar with node and like the wealth of libraries npm makes available.

## References
- Getting image size on front end - https://stackoverflow.com/a/20569043/8454047
- Integrating Express and React on Heroku - https://daveceddia.com/create-react-app-express-production/


## cURL command
curl -H "Content-Type: application/json" -d '{"base":"`BASE-IMAGE-URL`", "logo":"`LOGO-IMAGE-URL`"}' https://fast-anchorage-86250.herokuapp.com/api/design-a-cake

## Setup

The backend and frontend are technically independent and do not need each other to function properly.

### Backend
After downloading repo to your local machine, run `npm init` and `npm start`. If you'd like to further develop it, I recommend `npm run dev` to have the server automatically refresh on changes.

### Frontend
After downloading rep to your local machine, `cd` into `client` and run `npm init` and `npm start`. This will start the react client which will automatically open on localhost:3000.