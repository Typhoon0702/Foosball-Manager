const { v4: uuidv4 } = require('uuid');

class Team {
  constructor(name, player1, player2) {
    this.id = uuidv4();
    this.name = name;
    this.player1 = player1;
    this.player2 = player2;
    this.wins = 0;
    this.losses = 0;
    this.goalsFor = 0;
    this.goalsAgainst = 0;
    this.createdAt = new Date();
  }

  addWin() {
    this.wins++;
  }

  addLoss() {
    this.losses++;
  }

  addGoalsFor(goals) {
    this.goalsFor += goals;
  }

  addGoalsAgainst(goals) {
    this.goalsAgainst += goals;
  }

  getWinPercentage() {
    const totalGames = this.wins + this.losses;
    return totalGames > 0 ? (this.wins / totalGames) * 100 : 0;
  }

  getGoalDifference() {
    return this.goalsFor - this.goalsAgainst;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      player1: this.player1,
      player2: this.player2,
      wins: this.wins,
      losses: this.losses,
      goalsFor: this.goalsFor,
      goalsAgainst: this.goalsAgainst,
      winPercentage: this.getWinPercentage(),
      goalDifference: this.getGoalDifference(),
      createdAt: this.createdAt
    };
  }
}

module.exports = Team;
