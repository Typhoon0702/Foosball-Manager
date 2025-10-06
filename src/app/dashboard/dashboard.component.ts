import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  title = 'Dashboard';
  tournaments = [
    { id: 1, name: 'Spring Championship', status: 'Active', teams: 8 },
    { id: 2, name: 'Summer League', status: 'Completed', teams: 12 },
    { id: 3, name: 'Fall Tournament', status: 'Upcoming', teams: 6 }
  ];

  getActiveTournaments(): number {
    return this.tournaments.filter(t => t.status === 'Active').length;
  }

  getTotalTeams(): number {
    return this.tournaments.reduce((sum, t) => sum + t.teams, 0);
  }
}