const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// In-memory storage (in production, use a database)
let players = [];

// GET /api/players - Get all players
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: players.map(p => p.toJSON())
  });
});

// GET /api/players/:id - Get specific player
router.get('/:id', (req, res) => {
  const player = players.find(p => p.id === req.params.id);
  if (!player) {
    return res.status(404).json({
      success: false,
      error: 'Player not found'
    });
  }
  res.json({
    success: true,
    data: player.toJSON()
  });
});

// POST /api/players - Create new player
router.post('/', (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Player name is required'
      });
    }

    const player = new Player(name, email);
    players.push(player);
    
    res.status(201).json({
      success: true,
      data: player.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/players/:id - Update player
router.put('/:id', (req, res) => {
  const player = players.find(p => p.id === req.params.id);
  if (!player) {
    return res.status(404).json({
      success: false,
      error: 'Player not found'
    });
  }

  try {
    const { name, email } = req.body;
    
    if (name) player.name = name;
    if (email !== undefined) player.email = email;
    
    res.json({
      success: true,
      data: player.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/players/:id - Delete player
router.delete('/:id', (req, res) => {
  const playerIndex = players.findIndex(p => p.id === req.params.id);
  if (playerIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Player not found'
    });
  }

  players.splice(playerIndex, 1);
  res.json({
    success: true,
    message: 'Player deleted'
  });
});

module.exports = router;
