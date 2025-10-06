const express = require('express');
const router = express.Router();
const Match = require('../models/Match');

// In-memory storage (in production, use a database)
let matches = [];

// GET /api/matches - Get all matches
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: matches.map(m => m.toJSON())
  });
});

// GET /api/matches/:id - Get specific match
router.get('/:id', (req, res) => {
  const match = matches.find(m => m.id === req.params.id);
  if (!match) {
    return res.status(404).json({
      success: false,
      error: 'Match not found'
    });
  }
  res.json({
    success: true,
    data: match.toJSON()
  });
});

// POST /api/matches - Create new match
router.post('/', (req, res) => {
  try {
    const { team1, team2, round } = req.body;
    
    if (!team1 || !team2 || !round) {
      return res.status(400).json({
        success: false,
        error: 'Team1, Team2, and round are required'
      });
    }

    const match = new Match(team1, team2, round);
    matches.push(match);
    
    res.status(201).json({
      success: true,
      data: match.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/matches/:id/start - Start match
router.put('/:id/start', (req, res) => {
  const match = matches.find(m => m.id === req.params.id);
  if (!match) {
    return res.status(404).json({
      success: false,
      error: 'Match not found'
    });
  }

  try {
    match.startMatch();
    res.json({
      success: true,
      data: match.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/matches/:id/score - Update match score
router.put('/:id/score', (req, res) => {
  const match = matches.find(m => m.id === req.params.id);
  if (!match) {
    return res.status(404).json({
      success: false,
      error: 'Match not found'
    });
  }

  try {
    const { team1Score, team2Score } = req.body;
    
    if (typeof team1Score !== 'number' || typeof team2Score !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Scores must be numbers'
      });
    }

    match.updateScore(team1Score, team2Score);
    res.json({
      success: true,
      data: match.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/matches/:id/complete - Complete match
router.put('/:id/complete', (req, res) => {
  const match = matches.find(m => m.id === req.params.id);
  if (!match) {
    return res.status(404).json({
      success: false,
      error: 'Match not found'
    });
  }

  try {
    match.completeMatch();
    res.json({
      success: true,
      data: match.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/matches/:id/schedule - Schedule match
router.put('/:id/schedule', (req, res) => {
  const match = matches.find(m => m.id === req.params.id);
  if (!match) {
    return res.status(404).json({
      success: false,
      error: 'Match not found'
    });
  }

  try {
    const { scheduledTime } = req.body;
    
    if (!scheduledTime) {
      return res.status(400).json({
        success: false,
        error: 'Scheduled time is required'
      });
    }

    match.scheduleMatch(scheduledTime);
    res.json({
      success: true,
      data: match.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/matches/:id - Delete match
router.delete('/:id', (req, res) => {
  const matchIndex = matches.findIndex(m => m.id === req.params.id);
  if (matchIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Match not found'
    });
  }

  matches.splice(matchIndex, 1);
  res.json({
    success: true,
    message: 'Match deleted'
  });
});

module.exports = router;
