const { v4: uuidv4 } = require('uuid');

class Tournament {
  constructor(name, type = 'single-elimination', maxTeams = 8) {
    this.id = uuidv4();
    this.name = name;
    this.type = type; // 'single-elimination', 'double-elimination', 'round-robin'
    this.maxTeams = maxTeams;
    this.status = 'upcoming'; // 'upcoming', 'active', 'completed'
    this.teams = [];
    this.matches = [];
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  addTeam(team) {
    if (this.teams.length >= this.maxTeams) {
      throw new Error('Tournament is full');
    }
    if (this.status !== 'upcoming') {
      throw new Error('Cannot add teams to active or completed tournament');
    }
    this.teams.push(team);
    this.updatedAt = new Date();
  }

  removeTeam(teamId) {
    if (this.status !== 'upcoming') {
      throw new Error('Cannot remove teams from active or completed tournament');
    }
    this.teams = this.teams.filter(team => team.id !== teamId);
    this.updatedAt = new Date();
  }

  startTournament() {
    if (this.teams.length < 2) {
      throw new Error('Need at least 2 teams to start tournament');
    }
    this.status = 'active';
    this.generateMatches();
    this.updatedAt = new Date();
  }

  generateMatches() {
    this.matches = [];
    // Simple single elimination bracket generation
    const teams = [...this.teams];
    let round = 1;
    
    while (teams.length > 1) {
      const roundMatches = [];
      for (let i = 0; i < teams.length; i += 2) {
        if (i + 1 < teams.length) {
          const match = new Match(teams[i], teams[i + 1], round);
          roundMatches.push(match);
        } else {
          // Odd number of teams, one gets a bye
          const match = new Match(teams[i], null, round);
          match.winner = teams[i];
          match.status = 'completed';
          roundMatches.push(match);
        }
      }
      this.matches.push(...roundMatches);
      teams.length = Math.ceil(teams.length / 2);
      round++;
    }
  }

  completeTournament() {
    this.status = 'completed';
    this.updatedAt = new Date();
  }

  getWinner() {
    if (this.status !== 'completed') {
      return null;
    }
    const finalMatch = this.matches.find(match => match.round === this.matches.length);
    return finalMatch ? finalMatch.winner : null;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      maxTeams: this.maxTeams,
      status: this.status,
      teams: this.teams,
      matches: this.matches,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Tournament;
