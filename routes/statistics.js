const express = require('express');
const router = express.Router();

// In-memory storage (in production, use a database)
let tournaments = [];
let teams = [];
let players = [];
let matches = [];

// GET /api/statistics/overview - Get overall statistics
router.get('/overview', (req, res) => {
  try {
    const totalTournaments = tournaments.length;
    const activeTournaments = tournaments.filter(t => t.status === 'active').length;
    const completedTournaments = tournaments.filter(t => t.status === 'completed').length;
    const totalTeams = teams.length;
    const totalPlayers = players.length;
    const totalMatches = matches.length;
    const completedMatches = matches.filter(m => m.status === 'completed').length;

    const overview = {
      tournaments: {
        total: totalTournaments,
        active: activeTournaments,
        completed: completedTournaments
      },
      teams: {
        total: totalTeams
      },
      players: {
        total: totalPlayers
      },
      matches: {
        total: totalMatches,
        completed: completedMatches,
        pending: totalMatches - completedMatches
      }
    };

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/statistics/leaderboard/teams - Get team leaderboard
router.get('/leaderboard/teams', (req, res) => {
  try {
    const leaderboard = teams
      .map(team => ({
        id: team.id,
        name: team.name,
        wins: team.wins,
        losses: team.losses,
        winPercentage: team.getWinPercentage(),
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        goalDifference: team.getGoalDifference(),
        totalGames: team.wins + team.losses
      }))
      .filter(team => team.totalGames > 0)
      .sort((a, b) => {
        // Sort by win percentage first, then by goal difference
        if (b.winPercentage !== a.winPercentage) {
          return b.winPercentage - a.winPercentage;
        }
        return b.goalDifference - a.goalDifference;
      });

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/statistics/leaderboard/players - Get player leaderboard
router.get('/leaderboard/players', (req, res) => {
  try {
    const leaderboard = players
      .map(player => ({
        id: player.id,
        name: player.name,
        wins: player.wins,
        losses: player.losses,
        winPercentage: player.getWinPercentage(),
        goalsFor: player.goalsFor,
        goalsAgainst: player.goalsAgainst,
        goalDifference: player.getGoalDifference(),
        totalGames: player.wins + player.losses
      }))
      .filter(player => player.totalGames > 0)
      .sort((a, b) => {
        // Sort by win percentage first, then by goal difference
        if (b.winPercentage !== a.winPercentage) {
          return b.winPercentage - a.winPercentage;
        }
        return b.goalDifference - a.goalDifference;
      });

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/statistics/tournaments/:id/standings - Get tournament standings
router.get('/tournaments/:id/standings', (req, res) => {
  try {
    const tournament = tournaments.find(t => t.id === req.params.id);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        error: 'Tournament not found'
      });
    }

    const standings = tournament.teams
      .map(team => ({
        id: team.id,
        name: team.name,
        wins: team.wins,
        losses: team.losses,
        winPercentage: team.getWinPercentage(),
        goalsFor: team.goalsFor,
        goalsAgainst: team.goalsAgainst,
        goalDifference: team.getGoalDifference(),
        totalGames: team.wins + team.losses
      }))
      .sort((a, b) => {
        // Sort by win percentage first, then by goal difference
        if (b.winPercentage !== a.winPercentage) {
          return b.winPercentage - a.winPercentage;
        }
        return b.goalDifference - a.goalDifference;
      });

    res.json({
      success: true,
      data: standings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/statistics/recent-matches - Get recent matches
router.get('/recent-matches', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const recentMatches = matches
      .filter(match => match.status === 'completed')
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, limit)
      .map(match => ({
        id: match.id,
        team1: match.team1,
        team2: match.team2,
        team1Score: match.team1Score,
        team2Score: match.team2Score,
        winner: match.winner,
        completedAt: match.completedAt,
        tournamentId: match.tournamentId
      }));

    res.json({
      success: true,
      data: recentMatches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
