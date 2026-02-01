import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Track } from '../../models/track';
import { AudioPlayerService } from '../../service/audio-player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer-player.component.html',
  styleUrl: './footer-player.component.css'
})
export class FooterPlayerComponent implements OnDestroy {
  @Input() trackUrl: string = '';
  @Input() trackTitle: string = '';
  @Input() trackArtist: string = '';
  @Input() allTracks: Track[] = [];
  @Input() currentTrackIndex: number = -1;
  
  showAudioPlayer = false;
  isPlaying = false;
  activeButton: string | null = null; // Track which button is active
  
  private audioElement: HTMLAudioElement | null = null;
  private playTrackSubscription: Subscription = new Subscription();
  private tracksListSubscription: Subscription = new Subscription();

  constructor(private audioPlayerService: AudioPlayerService) {
    // Subscribe to play track events from other components
    this.playTrackSubscription = this.audioPlayerService.playTrack$.subscribe(track => {
      this.playTrackFromCard(track);
    });
    
    // Subscribe to tracks list updates
    this.tracksListSubscription = this.audioPlayerService.tracksList$.subscribe(({ tracks, currentIndex }) => {
      this.allTracks = tracks;
      this.currentTrackIndex = currentIndex;
    });
  }

  togglePlay(): void {
    if (!this.showAudioPlayer) {
      // First click - show the audio player and start playing
      this.showAudioPlayer = true;
      this.initializeAudio();
    } else {
      // Audio player is already visible - toggle play/pause
      this.toggleAudioPlayback();
    }
  }

  private initializeAudio(): void {
    if (!this.audioElement && this.trackUrl) {
      this.audioElement = new Audio(this.trackUrl);
      
      this.audioElement.addEventListener('loadedmetadata', () => {
        this.audioElement?.play().then(() => {
          this.isPlaying = true;
        }).catch(error => {
          console.error('Error playing audio:', error);
          this.isPlaying = false;
        });
      });

      this.audioElement.addEventListener('ended', () => {
        this.isPlaying = false;
      });

      this.audioElement.addEventListener('error', (e) => {
        console.error('Error loading audio file:', e);
        this.isPlaying = false;
      });
    }
  }

  private toggleAudioPlayback(): void {
    if (!this.audioElement) return;

    if (this.isPlaying) {
      this.audioElement.pause();
      this.isPlaying = false;
    } else {
      this.audioElement.play().then(() => {
        this.isPlaying = true;
      }).catch(error => {
        console.error('Error playing audio:', error);
        this.isPlaying = false;
      });
    }
  }

  onAudioPlay(): void {
    this.isPlaying = true;
  }

  onAudioPause(): void {
    this.isPlaying = false;
  }

  onAudioEnded(): void {
    this.isPlaying = false;
  }

  closeAudioPlayer(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
    this.showAudioPlayer = false;
    this.isPlaying = false;
  }

  getPlayButtonText(): string {
    if (!this.showAudioPlayer) {
      return '▶ Play';
    }
    return this.isPlaying ? '⏸ Pause' : '▶ Play';
  }

  getPlayButtonClass(): string {
    return this.isPlaying ? 'play-button playing' : 'play-button';
  }

  // Navigation helpers
  get hasPreviousTrack(): boolean {
    return this.currentTrackIndex > 0 && this.allTracks.length > 0;
  }

  get hasNextTrack(): boolean {
    return this.currentTrackIndex < this.allTracks.length - 1 && this.allTracks.length > 0;
  }

  // Navigation methods
  playPreviousTrack(): void {
    if (this.hasPreviousTrack) {
      this.activeButton = 'previous';
      const previousIndex = this.currentTrackIndex - 1;
      const previousTrack = this.allTracks[previousIndex];
      
      // Update current track info
      this.currentTrackIndex = previousIndex;
      this.playTrackFromCard(previousTrack);
      
      // Emit the new track to update the service
      this.audioPlayerService.playTrack(previousTrack);
      this.audioPlayerService.updateTracksList(this.allTracks, previousIndex);
      
      // Clear active state after a short delay
      setTimeout(() => {
        this.activeButton = null;
      }, 200);
    }
  }

  playNextTrack(): void {
    if (this.hasNextTrack) {
      this.activeButton = 'next';
      const nextIndex = this.currentTrackIndex + 1;
      const nextTrack = this.allTracks[nextIndex];
      
      // Update current track info
      this.currentTrackIndex = nextIndex;
      this.playTrackFromCard(nextTrack);
      
      // Emit the new track to update the service
      this.audioPlayerService.playTrack(nextTrack);
      this.audioPlayerService.updateTracksList(this.allTracks, nextIndex);
      
      // Clear active state after a short delay
      setTimeout(() => {
        this.activeButton = null;
      }, 200);
    }
  }

  // Public method to play a track from external components
  playTrackFromCard(track: Track): void {
    this.trackUrl = track.fileUrl || '';
    this.trackTitle = track.title || '';
    this.trackArtist = track.artist || '';
    
    // Find the track index in the allTracks array
    this.currentTrackIndex = this.allTracks.findIndex(t => t.id === track.id);
    
    if (this.trackUrl) {
      this.showAudioPlayer = true;
      this.initializeAudio();
    }
  }

  // Test method to add demo tracks
  addTestTracks(): void {
    const demoTracks: Track[] = [
      {
        id: 1,
        title: "Test Song 1",
        artist: "Test Artist 1",
        category: "pop",
        fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        description: "Demo track 1 for testing"
      },
      {
        id: 2,
        title: "Test Song 2", 
        artist: "Test Artist 2",
        category: "rock",
        fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        description: "Demo track 2 for testing"
      },
      {
        id: 3,
        title: "Test Song 3",
        artist: "Test Artist 3", 
        category: "jazz",
        fileUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        description: "Demo track 3 for testing"
      }
    ];

    this.allTracks = demoTracks;
    this.currentTrackIndex = 0;
    
    // Auto-play the first test track
    this.playTrackFromCard(demoTracks[0]);
    
    console.log('Test tracks added:', this.allTracks);
  }

  ngOnDestroy(): void {
    this.closeAudioPlayer();
    if (this.playTrackSubscription) {
      this.playTrackSubscription.unsubscribe();
    }
    if (this.tracksListSubscription) {
      this.tracksListSubscription.unsubscribe();
    }
  }


}
