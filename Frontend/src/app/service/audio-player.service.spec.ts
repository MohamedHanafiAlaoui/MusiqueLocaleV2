import { TestBed } from '@angular/core/testing';
import { AudioPlayerService } from './audio-player.service';
import { Track } from '../models/track';
import { Subject } from 'rxjs';

describe('AudioPlayerService', () => {
  let service: AudioPlayerService;
  let mockTrack: Track;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioPlayerService);

    mockTrack = {
      id: 1,
      title: 'Test Song',
      artist: 'Test Artist',
      category: 'pop',
      fileUrl: 'http://example.com/test.mp3',
      description: 'Test description'
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have playTrack$ observable', () => {
    expect(service.playTrack$).toBeDefined();
  });

  it('should have tracksList$ observable', () => {
    expect(service.tracksList$).toBeDefined();
  });

  it('should emit track when playTrack is called', (done) => {
    service.playTrack$.subscribe(track => {
      expect(track).toEqual(mockTrack);
      done();
    });

    service.playTrack(mockTrack);
  });

  it('should emit tracks list and current index when updateTracksList is called', (done) => {
    const tracks = [mockTrack];
    const currentIndex = 0;

    service.tracksList$.subscribe(data => {
      expect(data.tracks).toEqual(tracks);
      expect(data.currentIndex).toBe(currentIndex);
      done();
    });

    service.updateTracksList(tracks, currentIndex);
  });

  it('should handle multiple track emissions', () => {
    const emissions: Track[] = [];
    
    service.playTrack$.subscribe(track => {
      emissions.push(track);
    });

    const track2: Track = {
      id: 2,
      title: 'Test Song 2',
      artist: 'Test Artist 2',
      category: 'rock'
    };

    service.playTrack(mockTrack);
    service.playTrack(track2);

    expect(emissions.length).toBe(2);
    expect(emissions[0]).toEqual(mockTrack);
    expect(emissions[1]).toEqual(track2);
  });

  it('should handle multiple tracks list updates', () => {
    const updates: { tracks: Track[], currentIndex: number }[] = [];
    
    service.tracksList$.subscribe(data => {
      updates.push(data);
    });

    const tracks1 = [mockTrack];
    const tracks2 = [mockTrack, { id: 2, title: 'Track 2', artist: 'Artist 2', category: 'rock' }];

    service.updateTracksList(tracks1, 0);
    service.updateTracksList(tracks2, 1);

    expect(updates.length).toBe(2);
    expect(updates[0].tracks).toEqual(tracks1);
    expect(updates[0].currentIndex).toBe(0);
    expect(updates[1].tracks).toEqual(tracks2);
    expect(updates[1].currentIndex).toBe(1);
  });

  it('should handle empty tracks list', (done) => {
    service.tracksList$.subscribe(data => {
      expect(data.tracks).toEqual([]);
      expect(data.currentIndex).toBe(-1);
      done();
    });

    service.updateTracksList([], -1);
  });

  it('should handle track with minimal data', (done) => {
    const minimalTrack: Track = {
      id: 1,
      title: 'Minimal Track',
      artist: 'Minimal Artist',
      category: 'other'
    };

    service.playTrack$.subscribe(track => {
      expect(track.id).toBe(1);
      expect(track.title).toBe('Minimal Track');
      expect(track.artist).toBe('Minimal Artist');
      expect(track.category).toBe('other');
      expect(track.fileUrl).toBeUndefined();
      expect(track.description).toBeUndefined();
      done();
    });

    service.playTrack(minimalTrack);
  });

  it('should handle track with all properties', (done) => {
    const fullTrack: Track = {
      id: 1,
      title: 'Full Track',
      artist: 'Full Artist',
      description: 'Full description',
      duration: 180,
      category: 'pop',
      coverImage: 'http://example.com/cover.jpg',
      fileSize: 1024000,
      fileUrl: 'http://example.com/track.mp3'
    };

    service.playTrack$.subscribe(track => {
      expect(track).toEqual(fullTrack);
      done();
    });

    service.playTrack(fullTrack);
  });

  it('should handle concurrent emissions', () => {
    const playTrackEmissions: Track[] = [];
    const tracksListEmissions: { tracks: Track[], currentIndex: number }[] = [];

    service.playTrack$.subscribe(track => {
      playTrackEmissions.push(track);
    });

    service.tracksList$.subscribe(data => {
      tracksListEmissions.push(data);
    });

    // Simulate concurrent emissions
    service.playTrack(mockTrack);
    service.updateTracksList([mockTrack], 0);
    service.playTrack({ id: 2, title: 'Track 2', artist: 'Artist 2', category: 'rock' });
    service.updateTracksList([mockTrack, { id: 2, title: 'Track 2', artist: 'Artist 2', category: 'rock' }], 1);

    expect(playTrackEmissions.length).toBe(2);
    expect(tracksListEmissions.length).toBe(2);
  });
});
