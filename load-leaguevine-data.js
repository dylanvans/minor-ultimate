require('dotenv').config();

const rp = require('request-promise');
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

// import all of our models - they need to be imported only once
const Team = require('./models/Team');

const universalAccessToken = process.env.UNIVERSALACCESSTOKEN;
const seasonId = process.env.SEASONID;
const tournamentId = process.env.TOURNAMENTID;

const teamsFromTournamentOptions = {
    uri: 'http://api.playwithlv.com/v1/tournament_teams/',
    qs: {
        tournament_ids: `[${tournamentId}]`,
        season_id: seasonId,
        access_token: universalAccessToken,
        limit: 70
    },
    json: true
};

let teams;

rp(teamsFromTournamentOptions)
    .then(data => {
      teams = data.objects;
      // console.log(teams.length, teams);
      let idArray = [];
      teams.forEach(team => {
        idArray.push(team.team_id)
      });

      const getTeamInfoOptions = {
        uri: 'http://api.playwithlv.com/v1/teams/',
        qs: {
          team_ids: `[${idArray.join(',')}]`,
            season_id: seasonId,
            access_token: universalAccessToken,
            limit: teams.length
        },
        json: true
    };

    return rp(getTeamInfoOptions)
    })
    .then(data => {
        teamsFormatted = [];
        data.objects.forEach(team => {
            teamsFormatted.push( {
                name: team.name,
                shortName: team.short_name,
                leaguevineId: team.id,
                description: team.info,
                city: team.city,
                country: team.country
            });
        });

        teamsFormatted.forEach(team => {
            const t = (new Team(team)).save(() => {
                console.log('busy', team)
            });
        });
    })
    .catch(err => {
      console.log(`Oops API call failed: ${err}`)
    });
