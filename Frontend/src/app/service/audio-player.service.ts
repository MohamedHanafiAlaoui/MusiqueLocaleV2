import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Track } from '../models/track';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private playTrackSubject = new Subject<Track>();
  private tracksListSubject = new Subject<{ tracks: Track[], currentIndex: number }>();
  
  playTrack$ = this.playTrackSubject.asObservable();
  tracksList$ = this.tracksListSubject.asObservable();

  playTrack(track: Track): void {
    this.playTrackSubject.next(track);
  }

  updateTracksList(tracks: Track[], currentIndex: number): void {
    this.tracksListSubject.next({ tracks, currentIndex });
  }
}
