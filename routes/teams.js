const express = require('express');
const router = express.Router();
const Team = require('../models/Team');

// In-memory storage (in production, use a database)
let teams = [];

// GET /api/teams - Get all teams
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: teams.map(t => t.toJSON())
  });
});

// GET /api/teams/:id - Get specific team
router.get('/:id', (req, res) => {
  const team = teams.find(t => t.id === req.params.id);
  if (!team) {
    return res.status(404).json({
      success: false,
      error: 'Team not found'
    });
  }
  res.json({
    success: true,
    data: team.toJSON()
  });
});

// POST /api/teams - Create new team
router.post('/', (req, res) => {
  try {
    const { name, player1, player2 } = req.body;
    
    if (!name || !player1 || !player2) {
      return res.status(400).json({
        success: false,
        error: 'Team name and both players are required'
      });
    }

    const team = new Team(name, player1, player2);
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

// PUT /api/teams/:id - Update team
router.put('/:id', (req, res) => {
  const team = teams.find(t => t.id === req.params.id);
  if (!team) {
    return res.status(404).json({
      success: false,
      error: 'Team not found'
    });
  }

  try {
    const { name, player1, player2 } = req.body;
    
    if (name) team.name = name;
    if (player1) team.player1 = player1;
    if (player2) team.player2 = player2;
    
    res.json({
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

// DELETE /api/teams/:id - Delete team
router.delete('/:id', (req, res) => {
  const teamIndex = teams.findIndex(t => t.id === req.params.id);
  if (teamIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Team not found'
    });
  }

  teams.splice(teamIndex, 1);
  res.json({
    success: true,
    message: 'Team deleted'
  });
});

module.exports = router;
