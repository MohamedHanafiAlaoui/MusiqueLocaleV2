import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Track } from '../../models/track';
import { TrackService } from '../../service/track-service.service';
import { ErrorService } from '../../service/error-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-track-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-details.component.html',
  styleUrl: './track-details.component.css'
})
export class TrackDetailsComponent implements OnInit {
  track: Track | null = null;
  loading = false;
  isPlaying = false;

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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTrack(+id);
    }
  }

  loadTrack(id: number): void {
    this.loading = true;
    this.trackService.getTrackById(id).subscribe({
      next: (track) => {
        this.track = track;
        this.loading = false;
      },
      error: (error) => {
        this.errorService.handleError(error);
        this.loading = false;
      }
    });
  }

  getCategoryColor(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat ? cat.color : '#B8B8B8';
  }

  getCategoryLabel(category: string): string {
    const cat = this.categories.find(c => c.value === category);
    return cat ? cat.label : category;
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

  playAudio(): void {
    if (!this.track?.fileUrl) {
      alert('No audio file available for this track');
      return;
    }

    const audio = document.querySelector('audio') as HTMLAudioElement;
    if (audio) {
      if (this.isPlaying) {
        audio.pause();
        this.isPlaying = false;
      } else {
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          alert('Error playing audio file');
        });
        this.isPlaying = true;
      }
    }
  }

  onAudioEnded(): void {
    this.isPlaying = false;
  }

  editTrack(): void {
    if (this.track?.id) {
      this.router.navigate(['/tracks', this.track.id, 'edit']);
    }
  }

  deleteTrack(): void {
    if (this.track?.id && confirm('Are you sure you want to delete this track?')) {
      this.trackService.deleteTrack(this.track.id).subscribe({
        next: () => {
          this.router.navigate(['/tracks']);
        },
        error: (error) => {
          this.errorService.handleError(error);
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tracks']);
  }
}
