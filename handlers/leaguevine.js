const rp = require('request-promise');
const mongoose = require('mongoose');
const Team = mongoose.model('Team');
const LiveGame = mongoose.model('LiveGame');
const dotenv = require('dotenv');
const moment = require('moment');

dotenv.config();

const universalAccessToken = process.env.UNIVERSALACCESSTOKEN;
const seasonId = process.env.SEASONID;
const tournamentId = process.env.TOURNAMENTID;

const momentFormat = 'YYYY-MM-DDTHH:mm:ss+02:00'; // TO DO timezone  still hardcoded

exports.setLiveGames = async () => {
    console.log('setting live games');
    
    const currentTime = moment().format(momentFormat);

    const getGamesOptions = {
        uri: 'http://api.playwithlv.com/v1/games/',
        qs: {
            tournament_id: tournamentId,
            season_id: seasonId,
            starts_before: currentTime,
            access_token: universalAccessToken
        },
        json: true
    };

    let liveGames = [];

    rp(getGamesOptions)
        .then(async data => {
            liveGames = data.objects;
            liveGames = liveGames.filter(game => {
                const startTime = moment(game.start_time, momentFormat);
                const endTime = moment(startTime).add(90, 'm'); // TO DO 90 minutes still hardcoded
                if(moment(currentTime).isBetween(startTime, endTime)) {
                    return game;
                }
            });

            for (var i = 0; i < liveGames.length; i++) {
                const team1Id = await Team.findOne({"leaguevineId": liveGames[i].team_1_id });
                const team2Id = await Team.findOne({"leaguevineId": liveGames[i].team_2_id });

                const gameFormatted = {
                    gameId: liveGames[i].id,
                    team1: team1Id,
                    team2: team2Id,
                    team1Score: liveGames[i].team_1_score,
                    team2Score: liveGames[i].team_2_score,
                    startTime: liveGames[i].start_time,
                    swissRoundId: liveGames[i].swiss_round_id,
                    field: liveGames[i].game_site.name
                }

                LiveGame.updateOne({ gameId: liveGames[i].id }, {$set: {
                        gameId: liveGames[i].id,
                        team1: team1Id,
                        team2: team2Id,
                        team1Score: liveGames[i].team_1_score,
                        team2Score: liveGames[i].team_2_score,
                        startTime: liveGames[i].start_time,
                        swissRoundId: liveGames[i].swiss_round_id,
                        field: liveGames[i].game_site.name
                    }
                }, {upsert: true}, () => {

                });
            }
        })
        .catch(err => {
            console.log(`Oops API call failed: ${err}`)
        });
}

exports.updateTeams = () => {
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
                Team.findOneAndUpdate({ name: team.name }, team, {upsert: true}, () => {

                });
            });
        })
        .catch(err => {
            console.log(`Oops API call failed: ${err}`)
        });
}