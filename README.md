# Doge Labs VR Application

## Setup

Clone the repository.

Install the dependencies with Yarn or NPM. I used Node v20 in case there's any issues.

The `/.dev.vars` file contains the environment variable with the Neon Database connection string. I can provide mine if you need it, but best practices dictates not to put it in the repo.

`npm run preview` in the root directory to spin up a test app. Follow the instructions to open the app in a browser.

## Assumptions

Since this is for a game, I drew on my experience with social games like WoW and decided to forgo a "Friend Request" system that feels more suited to social media. A user can simply add a friend and that's that. Adding friend requests that need to be accepted by the recipient would be a matter of an extra table with an "approved" column. This could function as the friends list proper, or it could generate an entry in the existing friends table. 

There was no authentication mentioned in the project requirements, so there's no login, accounts, permissions, roles, or anything like that. Any user can delete anything, anybody can add anyone to a friends list, etc. It's the wild west out here. If users were logged in, a simple check to make sure the requester is allowed to edit the user would be a good start. Roles and permissions can get complicated, so that's not within the scope of this quick application/demo.

There is no upload image functionality or any way to set the user's avatar image. They are generated using robohash and the user's username. 

The homepage is not very mobile friendly. I'm making minor improvements as I go, but really I'm just testing on my laptop and not focusing on the mobile experience, since nobody else will ever see it.

## Backend

The backend is running on Cloudflare Pages, and the backend code lives within the `/functions` directory. The file structure dictates the route endpoints, as per the Cloudflare Pages Functions documentation. THere's a couple gotchas (folders named [users] and stuf...). The endpoints are just files holding onRequestXX functions, which then send the data to the appropriate controller. The endpoint files/request functions are spread out to properly access routing variables such as :id.

When the app is running/deployed, you can make `GET /api/users` for a list of all users in the app (with pagination) and some basic statistics. You can `POST /api/users` with JSON data to create a new user. There's some light validation and sanitization happening using `zod` and `drizzle-zod` here, but it could probably be more robust. You can `GET /api/users/:id` (replacing :id with a user ID) to get user details as well as a list of their friends and their friends details. Including the friend data for a specific user is just a convenience feature. `GET /api/users/:id/friends` will return just a list of the friend data, without the parent user. You can `DELETE /api/friends/:id` to delete a friendship, as well as `DELETE /api/users/:id/friends/:friendId`.

These endpoints are pretty easy to test with Postman or cURL.

## Frontend

The frontend is built with React/Typescript/Vite. I could have used a lot more strict typing, but since this is not a long-term project, I forced a few `any` types in there.

The frontend is a single page app, quite literally. There is no routing- only the main page. THe main page consists of the two statistics (total users, average friends per user), and a paginated list of all the users in the database. There are two Dialog windows, one that allows you to create a user, and one that allows you to see user details and add/remove friends from that specific user. 

The React site is built with React MUI, a Material UI component library. There are only 3 main components- UsersList, UserView, and UserAddForm. These could have been abstracted into smaller more reusable components. The list of users could be sortable/filterable, adding friends should use a search API to autocomplete friend matches. There should also be better feedback for things like a user being added or removed. 

The Create User functionality includes a way to auto-fill the user fields so you can create users very quickly. There is no input validation on the clientside aside from basic HTML validation (make sure an email is actually an email).

## TO DO
- Uniform error handling in frontend
- Implement toast handler
- Unit tests
- Responsive design

