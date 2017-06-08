const rp = require('request-promise');
const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const dotenv = require('dotenv');

dotenv.config();

// const leaguevineRedirectURI = process.env.LEAGUEVINE_REDIRECT_URI;
// const leaguevineClientId = process.env.LEAGUEVINE_CLIENT_ID;
// const leaguevineClientSecretKey = process.env.LEAGUEVINE_CLIENT_SECRET_KEY;

// const urlGetAuthCode = `http://www.playwithlv.com/oauth2/authorize/?client_id=${leaguevineClientId}&response_type=code&redirect_uri=${leaguevineRedirectURI}&scope=universal`;
// const urlGetAccessToken = `http://www.playwithlv.com/oauth2/token/?client_id=${leaguevineClientId}&client_secret=${leaguevineClientSecretKey}&grant_type=authorization_code&redirect_uri=${leaguevineRedirectURI}`;

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
			Team.findOneAndUpdate({ name: team.name }, team, {upsert: true});
    	});
    })
    .catch(err => {
    	console.log(`Oops API call failed: ${err}`)
    });