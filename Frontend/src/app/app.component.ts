import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterPlayerComponent } from './components/footer-player/footer-player.component';
import { Track } from './models/track';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, NavbarComponent, FooterPlayerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Music Track Manager';
  
  @ViewChild(FooterPlayerComponent) footerPlayer!: FooterPlayerComponent;
  
  allTracks: Track[] = [];
  currentTrackIndex: number = -1;

  // Handle play track event from track list
  onPlayTrackInFooter(track: Track): void {
    if (this.footerPlayer) {
      this.footerPlayer.playTrackFromCard(track);
      this.currentTrackIndex = this.allTracks.findIndex(t => t.id === track.id);
    }
  }
}
