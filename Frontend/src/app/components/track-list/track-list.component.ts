import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Track } from '../../models/track';
import { TrackService } from '../../service/track-service.service';
import { ErrorService } from '../../service/error-service.service';
import { AudioPlayerService } from '../../service/audio-player.service';

@Component({
  selector: 'app-track-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './track-list.component.html',
  styleUrl: './track-list.component.css'
})
export class TrackListComponent implements OnInit, OnDestroy {
  tracks: Track[] = [];
  currentPage = 0;
  pageSize = 8;
  totalPages = 0;
  totalElements = 0;
  loading = false;
  
  searchTitle = '';
  searchCategory = '';
  
  currentAudio: HTMLAudioElement | null = null;
  currentlyPlayingTrackId: number | null = null;
  
  categories = [
    { value: 'pop', label: 'Pop', color: '#FF6B6B' },
    { value: 'rock', label: 'Rock', color: '#4ECDC4' },
    { value: 'rap', label: 'Rap', color: '#45B7D1' },
    { value: 'jazz', label: 'Jazz', color: '#96CEB4' },
    { value: 'classical', label: 'Classical', color: '#FFEAA7' },
    { value: 'electronic', label: 'Electronic', color: '#DDA0DD' },
    { value: 'reggae', label: 'Reggae', color: '#98D8C8' },
    { value: 'other', label: 'Other', color: '#B8B8B8' }
  ];

  constructor(
    private trackService: TrackService,
    private errorService: ErrorService,
    private router: Router,
    private audioPlayerService: AudioPlayerService
  ) {}

  ngOnInit(): void {
    this.loadTracks();
  }

  loadTracks(): void {
    this.loading = true;
    this.trackService.searchTracks(
      this.searchTitle || undefined,
      this.searchCategory || undefined,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next: (response) => {
        this.tracks = response.content;
        console.log('Loaded tracks:', this.tracks);
        this.tracks.forEach(track => {
          console.log('Track details:', {
            id: track.id,
            title: track.title,
            fileUrl: track.fileUrl,
            hasFileUrl: !!track.fileUrl
          });
        });
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        this.errorService.handleError(error);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadTracks();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTracks();
  }

  getCategoryColor(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat ? cat.color : '#B8B8B8';
  }

  playTrack(track: Track): void {
    console.log('Playing track in footer:', track);
    
    // Update the currently playing track ID for UI state
    if (this.currentlyPlayingTrackId === track.id) {
      this.currentlyPlayingTrackId = null;
    } else {
      this.currentlyPlayingTrackId = track.id || null;
    }
    
    // Send track to footer player
    this.audioPlayerService.playTrack(track);
    
    // Also send the tracks list and current index
    const currentIndex = this.tracks.findIndex(t => t.id === track.id);
    this.audioPlayerService.updateTracksList(this.tracks, currentIndex);
  }

  isTrackPlaying(trackId: number): boolean {
    return this.currentlyPlayingTrackId === trackId;
  }

  editTrack(track: Track): void {
    this.router.navigate(['/tracks', track.id, 'edit']);
  }

  viewTrackDetails(track: Track): void {
    this.router.navigate(['/tracks', track.id]);
  }

  deleteTrack(id: number | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this track?')) {
      this.trackService.deleteTrack(id).subscribe({
        next: () => {
          this.loadTracks();
        },
        error: (error) => {
          this.errorService.handleError(error);
        }
      });
    }
  }

  formatDuration(duration: number | undefined): string {
    if (!duration) return '0:00';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatFileSize(size: number | undefined): string {
    if (!size) return '0 MB';
    const mb = size / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }

  ngOnDestroy(): void {
    // Clean up audio when component is destroyed
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    this.currentlyPlayingTrackId = null;
  }
}
