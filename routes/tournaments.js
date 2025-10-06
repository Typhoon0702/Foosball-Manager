const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const Team = require('../models/Team');

// In-memory storage (in production, use a database)
let tournaments = [];
let teams = [];

// GET /api/tournaments - Get all tournaments
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: tournaments.map(t => t.toJSON())
  });
});

// GET /api/tournaments/:id - Get specific tournament
router.get('/:id', (req, res) => {
  const tournament = tournaments.find(t => t.id === req.params.id);
  if (!tournament) {
    return res.status(404).json({
      success: false,
      error: 'Tournament not found'
    });
  }
  res.json({
    success: true,
    data: tournament.toJSON()
  });
});

// POST /api/tournaments - Create new tournament
router.post('/', (req, res) => {
  try {
    const { name, type, maxTeams } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Tournament name is required'
      });
    }

    const tournament = new Tournament(name, type, maxTeams);
    tournaments.push(tournament);
    
    res.status(201).json({
      success: true,
      data: tournament.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/tournaments/:id - Update tournament
router.put('/:id', (req, res) => {
  const tournament = tournaments.find(t => t.id === req.params.id);
  if (!tournament) {
    return res.status(404).json({
      success: false,
      error: 'Tournament not found'
    });
  }

  try {
    const { name, type, maxTeams } = req.body;
    
    if (name) tournament.name = name;
    if (type) tournament.type = type;
    if (maxTeams) tournament.maxTeams = maxTeams;
    
    tournament.updatedAt = new Date();
    
    res.json({
      success: true,
      data: tournament.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/tournaments/:id/teams - Add team to tournament
router.post('/:id/teams', (req, res) => {
  const tournament = tournaments.find(t => t.id === req.params.id);
  if (!tournament) {
    return res.status(404).json({
      success: false,
      error: 'Tournament not found'
    });
  }

  try {
    const { name, player1, player2 } = req.body;
    
    if (!name || !player1 || !player2) {
      return res.status(400).json({
        success: false,
        error: 'Team name and both players are required'
      });
    }

    const team = new Team(name, player1, player2);
    tournament.addTeam(team);
    teams.push(team);
    
    res.status(201).json({
      success: true,
      data: team.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/tournaments/:id/teams/:teamId - Remove team from tournament
router.delete('/:id/teams/:teamId', (req, res) => {
  const tournament = tournaments.find(t => t.id === req.params.id);
  if (!tournament) {
    return res.status(404).json({
      success: false,
      error: 'Tournament not found'
    });
  }

  try {
    tournament.removeTeam(req.params.teamId);
    teams = teams.filter(t => t.id !== req.params.teamId);
    
    res.json({
      success: true,
      message: 'Team removed from tournament'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/tournaments/:id/start - Start tournament
router.post('/:id/start', (req, res) => {
  const tournament = tournaments.find(t => t.id === req.params.id);
  if (!tournament) {
    return res.status(404).json({
      success: false,
      error: 'Tournament not found'
    });
  }

  try {
    tournament.startTournament();
    res.json({
      success: true,
      data: tournament.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/tournaments/:id/complete - Complete tournament
router.post('/:id/complete', (req, res) => {
  const tournament = tournaments.find(t => t.id === req.params.id);
  if (!tournament) {
    return res.status(404).json({
      success: false,
      error: 'Tournament not found'
    });
  }

  try {
    tournament.completeTournament();
    res.json({
      success: true,
      data: tournament.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/tournaments/:id - Delete tournament
router.delete('/:id', (req, res) => {
  const tournamentIndex = tournaments.findIndex(t => t.id === req.params.id);
  if (tournamentIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Tournament not found'
    });
  }

  tournaments.splice(tournamentIndex, 1);
  res.json({
    success: true,
    message: 'Tournament deleted'
  });
});

module.exports = router;
