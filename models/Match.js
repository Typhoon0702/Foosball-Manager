const { v4: uuidv4 } = require('uuid');

class Match {
  constructor(team1, team2, round) {
    this.id = uuidv4();
    this.team1 = team1;
    this.team2 = team2;
    this.round = round;
    this.team1Score = 0;
    this.team2Score = 0;
    this.status = 'scheduled'; // 'scheduled', 'in-progress', 'completed'
    this.winner = null;
    this.loser = null;
    this.scheduledTime = null;
    this.completedAt = null;
    this.tournamentId = null;
    this.matchNumber = null;
    this.duration = null; // in minutes
    this.notes = '';
    this.createdAt = new Date();
  }

  startMatch() {
    this.status = 'in-progress';
  }

  updateScore(team1Score, team2Score) {
    if (this.status !== 'in-progress') {
      throw new Error('Match is not in progress');
    }
    this.team1Score = team1Score;
    this.team2Score = team2Score;
  }

  completeMatch() {
    if (this.status !== 'in-progress') {
      throw new Error('Match is not in progress');
    }
    
    this.status = 'completed';
    this.completedAt = new Date();
    
    if (this.team1Score > this.team2Score) {
      this.winner = this.team1;
      this.loser = this.team2;
    } else if (this.team2Score > this.team1Score) {
      this.winner = this.team2;
      this.loser = this.team1;
    } else {
      // Handle tie if needed
      this.winner = null;
      this.loser = null;
    }
    
    // Update team statistics
    if (this.winner && this.loser) {
      this.winner.addWin();
      this.loser.addLoss();
      this.winner.addGoalsFor(this.winner === this.team1 ? this.team1Score : this.team2Score);
      this.winner.addGoalsAgainst(this.winner === this.team1 ? this.team2Score : this.team1Score);
      this.loser.addGoalsFor(this.loser === this.team1 ? this.team1Score : this.team2Score);
      this.loser.addGoalsAgainst(this.loser === this.team1 ? this.team2Score : this.team1Score);
    }
  }

  scheduleMatch(dateTime) {
    this.scheduledTime = new Date(dateTime);
  }

  getScore() {
    return {
      team1: this.team1Score,
      team2: this.team2Score
    };
  }

  isCompleted() {
    return this.status === 'completed';
  }

  toJSON() {
    return {
      id: this.id,
      team1: this.team1,
      team2: this.team2,
      round: this.round,
      team1Score: this.team1Score,
      team2Score: this.team2Score,
      status: this.status,
      winner: this.winner,
      scheduledTime: this.scheduledTime,
      completedAt: this.completedAt,
      createdAt: this.createdAt
    };
  }
}

module.exports = Match;
