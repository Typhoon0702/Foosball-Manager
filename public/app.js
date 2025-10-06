// Global state
let tournaments = [];
let teams = [];
let players = [];
let matches = [];

// API Base URL
const API_BASE = '/api';

// Utility functions
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API call failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        showAlert('error', error.message);
        throw error;
    }
}

function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.insertBefore(alertDiv, document.body.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Hide hero section
    document.getElementById('hero').style.display = 'none';
    
    // Show selected section
    document.getElementById(sectionName).style.display = 'block';
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load data for the section
    loadSectionData(sectionName);
}

function loadSectionData(sectionName) {
    switch (sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'tournaments':
            loadTournaments();
            break;
        case 'teams':
            loadTeams();
            break;
        case 'players':
            loadPlayers();
            break;
        case 'statistics':
            loadStatistics();
            break;
        case 'bracket':
            loadBracket();
            break;
    }
}

// Dashboard functions
async function loadDashboard() {
    try {
        await Promise.all([
            loadTournaments(),
            loadTeams(),
            loadPlayers(),
            loadMatches()
        ]);
        
        updateDashboardStats();
        displayRecentTournaments();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function updateDashboardStats() {
    document.getElementById('totalTournaments').textContent = tournaments.length;
    document.getElementById('totalTeams').textContent = teams.length;
    document.getElementById('totalPlayers').textContent = players.length;
    document.getElementById('totalMatches').textContent = matches.length;
}

function displayRecentTournaments() {
    const container = document.getElementById('recentTournaments');
    
    if (tournaments.length === 0) {
        container.innerHTML = '<p class="text-muted">No tournaments yet. Create your first tournament!</p>';
        return;
    }
    
    const recentTournaments = tournaments.slice(0, 5);
    container.innerHTML = recentTournaments.map(tournament => `
        <div class="card tournament-card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="card-title mb-1">${tournament.name}</h6>
                        <small class="text-muted">${tournament.teams.length} teams • ${tournament.type}</small>
                    </div>
                    <span class="badge bg-${getStatusColor(tournament.status)} status-badge">
                        ${tournament.status}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusColor(status) {
    switch (status) {
        case 'upcoming': return 'secondary';
        case 'active': return 'success';
        case 'completed': return 'primary';
        default: return 'secondary';
    }
}

// Tournament functions
async function loadTournaments() {
    try {
        const response = await apiCall('/tournaments');
        tournaments = response.data;
    } catch (error) {
        console.error('Error loading tournaments:', error);
    }
}

async function displayTournaments() {
    const container = document.getElementById('tournamentsList');
    
    if (tournaments.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted">No tournaments yet. Create your first tournament!</p></div>';
        return;
    }
    
    container.innerHTML = tournaments.map(tournament => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card tournament-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${tournament.name}</h5>
                    <p class="card-text">
                        <small class="text-muted">
                            ${tournament.teams.length} teams • ${tournament.type}
                        </small>
                    </p>
                    <span class="badge bg-${getStatusColor(tournament.status)} mb-3">
                        ${tournament.status}
                    </span>
                    <div class="d-grid gap-2">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewTournament('${tournament.id}')">
                            <i class="fas fa-eye me-1"></i>View
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteTournament('${tournament.id}')">
                            <i class="fas fa-trash me-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function showCreateTournamentModal() {
    const modal = new bootstrap.Modal(document.getElementById('createTournamentModal'));
    modal.show();
}

async function createTournament() {
    try {
        const name = document.getElementById('tournamentName').value;
        const type = document.getElementById('tournamentType').value;
        const maxTeams = parseInt(document.getElementById('maxTeams').value);
        
        if (!name.trim()) {
            showAlert('error', 'Tournament name is required');
            return;
        }
        
        const response = await apiCall('/tournaments', {
            method: 'POST',
            body: JSON.stringify({ name, type, maxTeams })
        });
        
        tournaments.push(response.data);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('createTournamentModal'));
        modal.hide();
        
        document.getElementById('createTournamentForm').reset();
        showAlert('success', 'Tournament created successfully!');
        
        if (document.getElementById('tournaments').style.display !== 'none') {
            displayTournaments();
        }
    } catch (error) {
        console.error('Error creating tournament:', error);
    }
}

async function deleteTournament(tournamentId) {
    if (!confirm('Are you sure you want to delete this tournament?')) {
        return;
    }
    
    try {
        await apiCall(`/tournaments/${tournamentId}`, {
            method: 'DELETE'
        });
        
        tournaments = tournaments.filter(t => t.id !== tournamentId);
        showAlert('success', 'Tournament deleted successfully!');
        
        if (document.getElementById('tournaments').style.display !== 'none') {
            displayTournaments();
        }
        
        if (document.getElementById('dashboard').style.display !== 'none') {
            updateDashboardStats();
            displayRecentTournaments();
        }
    } catch (error) {
        console.error('Error deleting tournament:', error);
    }
}

// Team functions
async function loadTeams() {
    try {
        const response = await apiCall('/teams');
        teams = response.data;
    } catch (error) {
        console.error('Error loading teams:', error);
    }
}

async function displayTeams() {
    const container = document.getElementById('teamsList');
    
    if (teams.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted">No teams yet. Create your first team!</p></div>';
        return;
    }
    
    container.innerHTML = teams.map(team => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${team.name}</h5>
                    <p class="card-text">
                        <strong>Players:</strong><br>
                        ${team.player1}<br>
                        ${team.player2}
                    </p>
                    <p class="card-text">
                        <small class="text-muted">
                            ${team.wins}W - ${team.losses}L • ${team.goalsFor}:${team.goalsAgainst}
                        </small>
                    </p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewTeam('${team.id}')">
                            <i class="fas fa-eye me-1"></i>View
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteTeam('${team.id}')">
                            <i class="fas fa-trash me-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function showCreateTeamModal() {
    const modal = new bootstrap.Modal(document.getElementById('createTeamModal'));
    modal.show();
}

async function createTeam() {
    try {
        const name = document.getElementById('teamName').value;
        const player1 = document.getElementById('player1').value;
        const player2 = document.getElementById('player2').value;
        
        if (!name.trim() || !player1.trim() || !player2.trim()) {
            showAlert('error', 'All fields are required');
            return;
        }
        
        const response = await apiCall('/teams', {
            method: 'POST',
            body: JSON.stringify({ name, player1, player2 })
        });
        
        teams.push(response.data);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('createTeamModal'));
        modal.hide();
        
        document.getElementById('createTeamForm').reset();
        showAlert('success', 'Team created successfully!');
        
        if (document.getElementById('teams').style.display !== 'none') {
            displayTeams();
        }
    } catch (error) {
        console.error('Error creating team:', error);
    }
}

async function deleteTeam(teamId) {
    if (!confirm('Are you sure you want to delete this team?')) {
        return;
    }
    
    try {
        await apiCall(`/teams/${teamId}`, {
            method: 'DELETE'
        });
        
        teams = teams.filter(t => t.id !== teamId);
        showAlert('success', 'Team deleted successfully!');
        
        if (document.getElementById('teams').style.display !== 'none') {
            displayTeams();
        }
        
        if (document.getElementById('dashboard').style.display !== 'none') {
            updateDashboardStats();
        }
    } catch (error) {
        console.error('Error deleting team:', error);
    }
}

// Player functions
async function loadPlayers() {
    try {
        const response = await apiCall('/players');
        players = response.data;
    } catch (error) {
        console.error('Error loading players:', error);
    }
}

async function displayPlayers() {
    const container = document.getElementById('playersList');
    
    if (players.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-muted">No players yet. Add your first player!</p></div>';
        return;
    }
    
    container.innerHTML = players.map(player => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${player.name}</h5>
                    ${player.email ? `<p class="card-text"><small class="text-muted">${player.email}</small></p>` : ''}
                    <p class="card-text">
                        <small class="text-muted">
                            ${player.wins}W - ${player.losses}L • ${player.goalsFor}:${player.goalsAgainst}
                        </small>
                    </p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewPlayer('${player.id}')">
                            <i class="fas fa-eye me-1"></i>View
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deletePlayer('${player.id}')">
                            <i class="fas fa-trash me-1"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function showCreatePlayerModal() {
    const modal = new bootstrap.Modal(document.getElementById('createPlayerModal'));
    modal.show();
}

async function createPlayer() {
    try {
        const name = document.getElementById('playerName').value;
        const email = document.getElementById('playerEmail').value;
        
        if (!name.trim()) {
            showAlert('error', 'Player name is required');
            return;
        }
        
        const response = await apiCall('/players', {
            method: 'POST',
            body: JSON.stringify({ name, email: email || null })
        });
        
        players.push(response.data);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('createPlayerModal'));
        modal.hide();
        
        document.getElementById('createPlayerForm').reset();
        showAlert('success', 'Player added successfully!');
        
        if (document.getElementById('players').style.display !== 'none') {
            displayPlayers();
        }
    } catch (error) {
        console.error('Error creating player:', error);
    }
}

async function deletePlayer(playerId) {
    if (!confirm('Are you sure you want to delete this player?')) {
        return;
    }
    
    try {
        await apiCall(`/players/${playerId}`, {
            method: 'DELETE'
        });
        
        players = players.filter(p => p.id !== playerId);
        showAlert('success', 'Player deleted successfully!');
        
        if (document.getElementById('players').style.display !== 'none') {
            displayPlayers();
        }
        
        if (document.getElementById('dashboard').style.display !== 'none') {
            updateDashboardStats();
        }
    } catch (error) {
        console.error('Error deleting player:', error);
    }
}

// Match functions
async function loadMatches() {
    try {
        const response = await apiCall('/matches');
        matches = response.data;
    } catch (error) {
        console.error('Error loading matches:', error);
    }
}

// Bracket functions
let currentTournamentId = null;

function showBracket(tournamentId) {
    currentTournamentId = tournamentId;
    showSection('bracket');
}

async function loadBracket() {
    if (!currentTournamentId) {
        document.getElementById('bracketContainer').innerHTML = '<p>No tournament selected</p>';
        return;
    }

    try {
        const response = await fetch(`/api/tournaments/${currentTournamentId}/bracket`);
        const result = await response.json();

        if (result.success) {
            renderBracket(result.data);
        } else {
            showAlert('Failed to load bracket: ' + result.error, 'danger');
        }
    } catch (error) {
        showAlert('Error loading bracket: ' + error.message, 'danger');
    }
}

function renderBracket(bracketData) {
    const container = document.getElementById('bracketContainer');
    
    if (bracketData.type === 'single-elimination') {
        container.innerHTML = `
            <div class="bracket-container">
                ${bracketData.rounds.map(round => `
                    <div class="bracket-round">
                        <div class="round-title">Round ${round.round}</div>
                        ${round.matches.map(match => `
                            <div class="bracket-match ${match.status}">
                                <div class="bracket-team ${match.winner === match.team1 ? 'winner' : ''}">
                                    <span>${match.team1 || 'TBD'}</span>
                                    <span class="bracket-score">${match.team1Score || 0}</span>
                                </div>
                                <div class="bracket-team ${match.winner === match.team2 ? 'winner' : ''}">
                                    <span>${match.team2 || 'TBD'}</span>
                                    <span class="bracket-score">${match.team2Score || 0}</span>
                                </div>
                                ${match.status === 'scheduled' ? `
                                    <div class="text-center mt-2">
                                        <button class="btn btn-sm btn-primary" onclick="startMatch('${match.id}')">Start Match</button>
                                    </div>
                                ` : ''}
                                ${match.status === 'in-progress' ? `
                                    <div class="text-center mt-2">
                                        <button class="btn btn-sm btn-success" onclick="completeMatch('${match.id}')">Complete Match</button>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        container.innerHTML = `<p>Bracket type ${bracketData.type} not yet supported in visualization</p>`;
    }
}

// Statistics functions
async function loadStatistics() {
    try {
        await Promise.all([
            loadOverviewStats(),
            loadTeamLeaderboard(),
            loadPlayerLeaderboard(),
            loadRecentMatches()
        ]);
    } catch (error) {
        showAlert('Error loading statistics: ' + error.message, 'danger');
    }
}

async function loadOverviewStats() {
    try {
        const response = await fetch('/api/statistics/overview');
        const result = await response.json();

        if (result.success) {
            const stats = result.data;
            document.getElementById('overviewStats').innerHTML = `
                <div class="col-md-3">
                    <div class="stat-item">
                        <div class="stat-number">${stats.tournaments.total}</div>
                        <div class="stat-label">Total Tournaments</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-item">
                        <div class="stat-number">${stats.tournaments.active}</div>
                        <div class="stat-label">Active Tournaments</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-item">
                        <div class="stat-number">${stats.teams.total}</div>
                        <div class="stat-label">Total Teams</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-item">
                        <div class="stat-number">${stats.players.total}</div>
                        <div class="stat-label">Total Players</div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading overview stats:', error);
    }
}

async function loadTeamLeaderboard() {
    try {
        const response = await fetch('/api/statistics/leaderboard/teams');
        const result = await response.json();

        if (result.success) {
            const leaderboard = result.data;
            document.getElementById('teamLeaderboard').innerHTML = leaderboard.map((team, index) => `
                <div class="leaderboard-item">
                    <div class="leaderboard-rank">#${index + 1}</div>
                    <div class="leaderboard-name">${team.name}</div>
                    <div class="leaderboard-stats">
                        ${team.wins}W-${team.losses}L (${team.winPercentage.toFixed(1)}%)
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading team leaderboard:', error);
    }
}

async function loadPlayerLeaderboard() {
    try {
        const response = await fetch('/api/statistics/leaderboard/players');
        const result = await response.json();

        if (result.success) {
            const leaderboard = result.data;
            document.getElementById('playerLeaderboard').innerHTML = leaderboard.map((player, index) => `
                <div class="leaderboard-item">
                    <div class="leaderboard-rank">#${index + 1}</div>
                    <div class="leaderboard-name">${player.name}</div>
                    <div class="leaderboard-stats">
                        ${player.wins}W-${player.losses}L (${player.winPercentage.toFixed(1)}%)
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading player leaderboard:', error);
    }
}

async function loadRecentMatches() {
    try {
        const response = await fetch('/api/statistics/recent-matches?limit=5');
        const result = await response.json();

        if (result.success) {
            const matches = result.data;
            document.getElementById('recentMatches').innerHTML = matches.map(match => `
                <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <div>
                        <strong>${match.team1} vs ${match.team2}</strong>
                        <br>
                        <small class="text-muted">${formatDate(match.completedAt)}</small>
                    </div>
                    <div class="text-end">
                        <span class="badge bg-success">${match.team1Score} - ${match.team2Score}</span>
                        <br>
                        <small class="text-muted">Winner: ${match.winner}</small>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading recent matches:', error);
    }
}

// Placeholder functions for future features
function viewTournament(id) {
    showBracket(id);
}

function viewTeam(id) {
    showAlert('info', 'Team details view coming soon!');
}

function viewPlayer(id) {
    showAlert('info', 'Player details view coming soon!');
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Load initial data
    loadDashboard();
    
    // Set up navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionName = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showSection(sectionName);
        });
    });
});
