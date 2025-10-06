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
    
    if (this.type === 'single-elimination') {
      this.generateSingleEliminationBracket();
    } else if (this.type === 'round-robin') {
      this.generateRoundRobinMatches();
    } else if (this.type === 'double-elimination') {
      this.generateDoubleEliminationBracket();
    }
  }

  generateSingleEliminationBracket() {
    const teams = [...this.teams];
    let round = 1;
    let currentTeams = teams;
    
    // Shuffle teams for random seeding
    currentTeams = this.shuffleArray(currentTeams);
    
    while (currentTeams.length > 1) {
      const roundMatches = [];
      const nextRoundTeams = [];
      
      for (let i = 0; i < currentTeams.length; i += 2) {
        if (i + 1 < currentTeams.length) {
          const match = new Match(currentTeams[i], currentTeams[i + 1], round);
          match.tournamentId = this.id;
          roundMatches.push(match);
        } else {
          // Odd number of teams, one gets a bye
          const match = new Match(currentTeams[i], null, round);
          match.tournamentId = this.id;
          match.winner = currentTeams[i];
          match.status = 'completed';
          match.team1Score = 1;
          match.team2Score = 0;
          roundMatches.push(match);
          nextRoundTeams.push(currentTeams[i]);
        }
      }
      
      this.matches.push(...roundMatches);
      currentTeams = nextRoundTeams;
      round++;
    }
  }

  generateRoundRobinMatches() {
    const teams = [...this.teams];
    let matchId = 1;
    
    // Generate all possible match combinations
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const match = new Match(teams[i], teams[j], 1);
        match.tournamentId = this.id;
        match.matchNumber = matchId++;
        this.matches.push(match);
      }
    }
  }

  generateDoubleEliminationBracket() {
    // Simplified double elimination - starts with single elimination
    this.generateSingleEliminationBracket();
    
    // Add losers bracket matches (simplified implementation)
    const losersBracketMatches = [];
    let round = 1;
    
    // This is a simplified version - full double elimination is complex
    this.matches.forEach(match => {
      if (match.status === 'completed' && match.winner) {
        const loserMatch = new Match(match.loser, null, round + 100); // +100 to distinguish from winners bracket
        loserMatch.tournamentId = this.id;
        losersBracketMatches.push(loserMatch);
      }
    });
    
    this.matches.push(...losersBracketMatches);
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getBracketData() {
    const bracket = {
      rounds: [],
      type: this.type
    };
    
    if (this.type === 'single-elimination') {
      const maxRound = Math.max(...this.matches.map(m => m.round));
      
      for (let round = 1; round <= maxRound; round++) {
        const roundMatches = this.matches.filter(m => m.round === round);
        bracket.rounds.push({
          round: round,
          matches: roundMatches.map(match => ({
            id: match.id,
            team1: match.team1,
            team2: match.team2,
            team1Score: match.team1Score,
            team2Score: match.team2Score,
            winner: match.winner,
            status: match.status,
            scheduledTime: match.scheduledTime
          }))
        });
      }
    }
    
    return bracket;
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
