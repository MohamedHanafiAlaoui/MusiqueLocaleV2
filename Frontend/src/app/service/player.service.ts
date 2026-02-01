import { Injectable } from '@angular/core';
import { Track } from '../models/track';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private currentTrackSubject = new BehaviorSubject<Track | null>(null);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private progressSubject = new BehaviorSubject<number>(0);
  private currentTimeSubject = new BehaviorSubject<string>('0:00');
  private durationSubject = new BehaviorSubject<string>('0:00');
  private volumeSubject = new BehaviorSubject<number>(1);
  private isMutedSubject = new BehaviorSubject<boolean>(false);

  // Observable streams
  currentTrack$ = this.currentTrackSubject.asObservable();
  isPlaying$ = this.isPlayingSubject.asObservable();
  progress$ = this.progressSubject.asObservable();
  currentTime$ = this.currentTimeSubject.asObservable();
  duration$ = this.durationSubject.asObservable();
  volume$ = this.volumeSubject.asObservable();
  isMuted$ = this.isMutedSubject.asObservable();

  // Audio element
  private audio: HTMLAudioElement | null = null;
  private progressInterval: any = null;

  constructor() {}

  playTrack(track: Track) {
    this.currentTrackSubject.next(track);
    this.initializeAudio();
    this.playAudio();
  }

  togglePlay() {
    if (!this.audio) {
      const track = this.currentTrackSubject.value;
      if (track) {
        this.initializeAudio();
      }
    }

    if (this.isPlayingSubject.value) {
      this.pauseAudio();
    } else {
      this.playAudio();
    }
  }

  stopTrack() {
    this.stopAudio();
  }

  setProgress(progress: number) {
    this.progressSubject.next(progress);
  }

  setCurrentTime(time: string) {
    this.currentTimeSubject.next(time);
  }

  setDuration(duration: string) {
    this.durationSubject.next(duration);
  }

  setVolume(volume: number) {
    this.volumeSubject.next(volume);
    if (this.audio) {
      this.audio.volume = volume;
      this.isMutedSubject.next(volume === 0);
    }
  }

  toggleMute() {
    if (this.audio) {
      if (this.isMutedSubject.value) {
        this.audio.volume = this.volumeSubject.value;
        this.isMutedSubject.next(false);
      } else {
        this.audio.volume = 0;
        this.isMutedSubject.next(true);
      }
    }
  }

  seekTo(percentage: number) {
    if (this.audio) {
      const seekTime = (percentage / 100) * this.audio.duration;
      this.audio.currentTime = seekTime;
    }
  }

  private initializeAudio() {
    const track = this.currentTrackSubject.value;
    if (track?.fileUrl) {
      // Create full URL if it's a relative path
      const audioUrl = track.fileUrl.startsWith('http') 
        ? track.fileUrl 
        : `http://localhost:8080${track.fileUrl}`;
      
      console.log('Loading audio from:', audioUrl);
      this.audio = new Audio(audioUrl);
      
      this.audio.addEventListener('loadedmetadata', () => {
        const duration = this.formatDuration(Math.floor(this.audio!.duration));
        this.durationSubject.next(duration);
      });

      this.audio.addEventListener('timeupdate', () => {
        if (this.audio) {
          const current = Math.floor(this.audio.currentTime);
          const total = Math.floor(this.audio.duration);
          const progress = total > 0 ? (current / total) * 100 : 0;
          const currentTime = this.formatDuration(current);
          
          this.progressSubject.next(progress);
          this.currentTimeSubject.next(currentTime);
        }
      });

      this.audio.addEventListener('ended', () => {
        this.stopAudio();
      });

      this.audio.addEventListener('error', (e) => {
        console.error('Error loading audio file:', e);
        console.error('Audio error code:', this.audio?.error);
        this.isPlayingSubject.next(false);
      });
    }
  }

  private playAudio() {
    if (this.audio) {
      this.audio.play();
      this.isPlayingSubject.next(true);
      this.startProgressTracking();
    }
  }

  private pauseAudio() {
    if (this.audio) {
      this.audio.pause();
      this.isPlayingSubject.next(false);
      this.stopProgressTracking();
    }
  }

  private stopAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlayingSubject.next(false);
      this.progressSubject.next(0);
      this.currentTimeSubject.next('0:00');
      this.stopProgressTracking();
    }
  }

  private startProgressTracking() {
    this.progressInterval = setInterval(() => {
      if (this.audio && !this.audio.paused) {
        const current = Math.floor(this.audio.currentTime);
        const total = Math.floor(this.audio.duration);
        const progress = total > 0 ? (current / total) * 100 : 0;
        this.progressSubject.next(progress);
      }
    }, 1000);
  }

  private stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // Getter methods
  getCurrentTrack(): Track | null {
    return this.currentTrackSubject.value;
  }

  getIsPlaying(): boolean {
    return this.isPlayingSubject.value;
  }

  getProgress(): number {
    return this.progressSubject.value;
  }

  getCurrentTime(): string {
    return this.currentTimeSubject.value;
  }

  getDuration(): string {
    return this.durationSubject.value;
  }

  getVolume(): number {
    return this.volumeSubject.value;
  }

  getIsMuted(): boolean {
    return this.isMutedSubject.value;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  getFullImageUrl(imageUrl?: string): string {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';
    return imageUrl.startsWith('http') ? imageUrl : `http://localhost:8080${imageUrl}`;
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'POP': '#FF6B6B',
      'ROCK': '#4ECDC4',
      'JAZZ': '#45B7D1',
      'CLASSICAL': '#96CEB4',
      'ELECTRONIC': '#9B59B6',
      'HIP_HOP': '#F39C12',
      'RAP': '#E74C3C',
      'REGGAE': '#27AE60'
    };
    return colors[category] || '#95A5A6';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  ngOnDestroy() {
    this.stopAudio();
    if (this.audio) {
      this.audio.src = '';
      this.audio = null;
    }
  }
}
