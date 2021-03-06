# Meesterproef - Ultimate Windmill App
This repo contains everything about the team application I made for Windmill. In this document I will discuss my process, all the features and subsequent information about the project.

[Live Demo](https://windmill-team-app.herokuapp.com)

## The Assignment
### What is Windmill?
> The Windmill Tournament is a yearly Ultimate frisbee tournament held in Amsterdam. The three day event is loaded with Ultimate action and off the field antics, resulting in an unforgettable weekend of intense sport and constant fun.

### User story 
1. > With the app, I can easily keep the score, publish final scores and fill in spirit scores
2. > With the app, I get an overview of where which match is played, what the live scores are and what the current ranking is.

## Concept
The user group that my concept focusses on is the participants of the tournament. They have to know quickly where, when and against whom their next game will be. Also, they must be able to keep their score and submit the spirit points. Before, this was a problem for the organization, because to generate the next round of games all scores must be submitted and not all teams submitted their score and spirit points on time.

In the app a user can join his team and follow everything surrounding his team. What the next game will be, what the latest results were and which position on the ranking they posses.

The app will notify teams when their game is finished and they have to submit their game score and spirit points. This will become a 'To Do' for the teams and will only disappear when they're done.

## Features
- Register/Login users
- Link users to LeagueVine Team
- On the 'My Team' page, show the next game, the live game and results
- Show which games on the tournament are live (Homepage)
- Starred teams so users can follow other teams
- Updates feed on homepage. With updates from the organization, 'My Team' and the starred teams.
- Organization page to send updates to users(/crew)
- 'To Do' for submitting spirit points
- 'To Do' for submitting final score
- Send score updates for teams to LeagueVine 
- Feedback to users by means of flash messages

## To Do
- [ ] Notify users linked to a team with an open 'To Do'
- [ ] Filter live games on 'My Team' or 'Starred Teams'
- [ ] Edit account for users
- [ ] Make organization page password protected
- [ ] Highlight the selected team in Swiss Standing
- [ ] Fill info page with relevant information about the tournament
- [ ] Multiple tournaments functionality 


## Installation
1. Clone repository
```
git clone https://github.com/dylanvans/minor-ultimate && cd minor-ultimate
```
2. Install dependencies
```
npm install
```
3. Setup .env variables
```
DATABASE
SESSION_SECRET
SESSION_KEY
LEAGUEVINE_REDIRECT_URI
LEAGUEVINE_CLIENT_ID
LEAGUEVINE_CLIENT_SECRET_KEY
UNIVERSALACCESSTOKEN
SEASONID
TOURNAMENTID
```
4. Load tournament teams
```
npm run leaguevine-data
```
5. Start server
```
npm start
```

## Dev options
Start nodemon and watch CSS and JS
```
npm run start:dev
```
Lint
```
npm run lint 
```

## Tech
[NodeJS](https://nodejs.org/en/) + [Express](https://expressjs.com/) + [EJS](https://www.npmjs.com/package/ejs) + [mongoDB](https://www.mongodb.com/) + [Leaguevine API](https://www.leaguevine.com/)

### Other
- [Moment.js](https://momentjs.com/)
- [Passport.js](http://passportjs.org/)
- [Mongoose](http://mongoosejs.com/)
- [Heroku](https://www.heroku.com/)
- [Xo linter](https://github.com/sindresorhus/xo)


