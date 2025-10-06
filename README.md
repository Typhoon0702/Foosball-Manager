# Foosball Manager

A Node.js application for managing foosball tournaments, teams, players, and matches.

## Features

- 🏆 **Tournament Management**: Create and manage foosball tournaments
- 👥 **Team Organization**: Organize teams and track player statistics
- ⚽ **Match Scheduling**: Schedule matches and track results
- 📊 **Statistics**: Track wins, losses, goals, and performance metrics
- 🎨 **Modern UI**: Clean, responsive web interface

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd foosball-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Production

To run in production mode:

```bash
npm start
```

## API Endpoints

### Tournaments
- `GET /api/tournaments` - Get all tournaments
- `GET /api/tournaments/:id` - Get specific tournament
- `POST /api/tournaments` - Create new tournament
- `PUT /api/tournaments/:id` - Update tournament
- `DELETE /api/tournaments/:id` - Delete tournament
- `POST /api/tournaments/:id/start` - Start tournament
- `POST /api/tournaments/:id/complete` - Complete tournament

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get specific team
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get specific player
- `POST /api/players` - Create new player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player

### Matches
- `GET /api/matches` - Get all matches
- `GET /api/matches/:id` - Get specific match
- `POST /api/matches` - Create new match
- `PUT /api/matches/:id/start` - Start match
- `PUT /api/matches/:id/score` - Update match score
- `PUT /api/matches/:id/complete` - Complete match
- `DELETE /api/matches/:id` - Delete match

## Project Structure

```
foosball-manager/
├── models/              # Data models
│   ├── Tournament.js
│   ├── Team.js
│   ├── Player.js
│   └── Match.js
├── routes/              # API routes
│   ├── tournaments.js
│   ├── teams.js
│   ├── players.js
│   └── matches.js
├── public/              # Static files
│   ├── index.html
│   └── app.js
├── server.js            # Main server file
├── package.json
└── README.md
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), Bootstrap 5
- **Icons**: Font Awesome
- **Data Storage**: In-memory (easily replaceable with database)

## Future Enhancements

- [ ] Database integration (PostgreSQL, MongoDB)
- [ ] User authentication and authorization
- [ ] Real-time match updates
- [ ] Tournament brackets visualization
- [ ] Player statistics and leaderboards
- [ ] Mobile app (React Native/Flutter)
- [ ] Email notifications
- [ ] Tournament export/import

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.