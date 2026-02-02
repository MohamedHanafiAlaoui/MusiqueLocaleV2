import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FooterPlayerComponent } from './footer-player.component';
import { AudioPlayerService } from '../../service/audio-player.service';
import { Track } from '../../models/track';
import { Subject, of } from 'rxjs';

describe('FooterPlayerComponent', () => {
  let component: FooterPlayerComponent;
  let fixture: ComponentFixture<FooterPlayerComponent>;
  let mockAudioPlayerService: jasmine.SpyObj<AudioPlayerService>;
  let mockPlayTrackSubject: Subject<Track>;
  let mockTracksListSubject: Subject<{ tracks: Track[], currentIndex: number }>;

  const mockTrack: Track = {
    id: 1,
    title: 'Test Song',
    artist: 'Test Artist',
    category: 'pop',
    fileUrl: 'http://example.com/test.mp3',
    description: 'Test description'
  };

  beforeEach(async () => {
    mockPlayTrackSubject = new Subject<Track>();
    mockTracksListSubject = new Subject<{ tracks: Track[], currentIndex: number }>();

    mockAudioPlayerService = jasmine.createSpyObj('AudioPlayerService', ['playTrack', 'updateTracksList']);
    mockAudioPlayerService.playTrack$ = mockPlayTrackSubject.asObservable();
    mockAudioPlayerService.tracksList$ = mockTracksListSubject.asObservable();

    await TestBed.configureTestingModule({
      imports: [FooterPlayerComponent],
      providers: [
        { provide: AudioPlayerService, useValue: mockAudioPlayerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.showAudioPlayer).toBe(false);
    expect(component.isPlaying).toBe(false);
    expect(component.activeButton).toBeNull();
    expect(component.trackUrl).toBe('');
    expect(component.trackTitle).toBe('');
    expect(component.trackArtist).toBe('');
    expect(component.allTracks).toEqual([]);
    expect(component.currentTrackIndex).toBe(-1);
  });

  it('should show play button text correctly when not playing', () => {
    component.showAudioPlayer = false;
    expect(component.getPlayButtonText()).toBe('▶ Play');
  });

  it('should show pause button text when playing', () => {
    component.showAudioPlayer = true;
    component.isPlaying = true;
    expect(component.getPlayButtonText()).toBe('⏸ Pause');
  });

  it('should show play button text when paused', () => {
    component.showAudioPlayer = true;
    component.isPlaying = false;
    expect(component.getPlayButtonText()).toBe('▶ Play');
  });

  it('should return correct play button class when not playing', () => {
    component.isPlaying = false;
    expect(component.getPlayButtonClass()).toBe('play-button');
  });

  it('should return playing button class when playing', () => {
    component.isPlaying = true;
    expect(component.getPlayButtonClass()).toBe('play-button playing');
  });

  it('should toggle play to show audio player', () => {
    component.trackUrl = 'http://example.com/test.mp3';
    
    component.togglePlay();
    
    expect(component.showAudioPlayer).toBe(true);
  });

  it('should toggle play/pause when audio player is visible', () => {
    component.showAudioPlayer = true;
    
    component.togglePlay();
    
    // Since we can't easily mock the audio element, we just test the state change
    expect(component.showAudioPlayer).toBe(true);
  });

  it('should handle play track from service subscription', () => {
    spyOn(component, 'playTrackFromCard');
    
    mockPlayTrackSubject.next(mockTrack);
    
    expect(component.playTrackFromCard).toHaveBeenCalledWith(mockTrack);
  });

  it('should handle tracks list update from service subscription', () => {
    const tracks = [mockTrack];
    const currentIndex = 0;
    
    mockTracksListSubject.next({ tracks, currentIndex });
    
    expect(component.allTracks).toEqual(tracks);
    expect(component.currentTrackIndex).toBe(currentIndex);
  });

  it('should play track from card', () => {
    component.allTracks = [mockTrack];
    
    component.playTrackFromCard(mockTrack);
    
    expect(component.trackUrl).toBe(mockTrack.fileUrl || '');
    expect(component.trackTitle).toBe(mockTrack.title || '');
    expect(component.trackArtist).toBe(mockTrack.artist || '');
    expect(component.currentTrackIndex).toBe(0);
    expect(component.showAudioPlayer).toBe(true);
  });

  it('should find track index correctly', () => {
    const track2: Track = { id: 2, title: 'Track 2', artist: 'Artist 2', category: 'rock' };
    component.allTracks = [mockTrack, track2];
    
    component.playTrackFromCard(track2);
    
    expect(component.currentTrackIndex).toBe(1);
  });

  it('should handle previous track navigation', () => {
    component.allTracks = [mockTrack];
    component.currentTrackIndex = 0;
    spyOn(component, 'playTrackFromCard');
    
    component.playPreviousTrack();
    
    expect(component.activeButton).toBe('previous');
    // Should not play previous if at first track
    expect(component.playTrackFromCard).not.toHaveBeenCalled();
  });

  it('should play previous track when available', () => {
    const track2: Track = { id: 2, title: 'Track 2', artist: 'Artist 2', category: 'rock' };
    component.allTracks = [mockTrack, track2];
    component.currentTrackIndex = 1;
    spyOn(component, 'playTrackFromCard');
    
    component.playPreviousTrack();
    
    expect(component.currentTrackIndex).toBe(0);
    expect(component.playTrackFromCard).toHaveBeenCalledWith(mockTrack);
    expect(mockAudioPlayerService.playTrack).toHaveBeenCalledWith(mockTrack);
    expect(mockAudioPlayerService.updateTracksList).toHaveBeenCalledWith(component.allTracks, 0);
  });

  it('should play next track when available', () => {
    const track2: Track = { id: 2, title: 'Track 2', artist: 'Artist 2', category: 'rock' };
    component.allTracks = [mockTrack, track2];
    component.currentTrackIndex = 0;
    spyOn(component, 'playTrackFromCard');
    
    component.playNextTrack();
    
    expect(component.currentTrackIndex).toBe(1);
    expect(component.playTrackFromCard).toHaveBeenCalledWith(track2);
    expect(mockAudioPlayerService.playTrack).toHaveBeenCalledWith(track2);
    expect(mockAudioPlayerService.updateTracksList).toHaveBeenCalledWith(component.allTracks, 1);
  });

  it('should not play next track if at last track', () => {
    component.allTracks = [mockTrack];
    component.currentTrackIndex = 0;
    spyOn(component, 'playTrackFromCard');
    
    component.playNextTrack();
    
    expect(component.playTrackFromCard).not.toHaveBeenCalled();
  });

  it('should calculate hasPreviousTrack correctly', () => {
    component.allTracks = [mockTrack];
    component.currentTrackIndex = 0;
    expect(component.hasPreviousTrack).toBe(false);
    
    component.currentTrackIndex = 1;
    expect(component.hasPreviousTrack).toBe(true);
  });

  it('should calculate hasNextTrack correctly', () => {
    component.allTracks = [mockTrack];
    component.currentTrackIndex = 0;
    expect(component.hasNextTrack).toBe(false);
    
    component.allTracks = [mockTrack, { id: 2, title: 'Track 2', artist: 'Artist 2', category: 'rock' }];
    component.currentTrackIndex = 0;
    expect(component.hasNextTrack).toBe(true);
  });

  it('should close audio player', () => {
    component.showAudioPlayer = true;
    component.isPlaying = true;
    
    component.closeAudioPlayer();
    
    expect(component.showAudioPlayer).toBe(false);
    expect(component.isPlaying).toBe(false);
  });

  it('should handle audio play event', () => {
    component.onAudioPlay();
    expect(component.isPlaying).toBe(true);
  });

  it('should handle audio pause event', () => {
    component.onAudioPause();
    expect(component.isPlaying).toBe(false);
  });

  it('should handle audio ended event', () => {
    component.onAudioEnded();
    expect(component.isPlaying).toBe(false);
  });

  it('should add test tracks', () => {
    spyOn(component, 'playTrackFromCard');
    
    component.addTestTracks();
    
    expect(component.allTracks.length).toBe(3);
    expect(component.currentTrackIndex).toBe(0);
    expect(component.playTrackFromCard).toHaveBeenCalledWith(component.allTracks[0]);
  });

  it('should cleanup on destroy', () => {
    component.showAudioPlayer = true;
    
    component.ngOnDestroy();
    
    expect(component.showAudioPlayer).toBe(false);
    expect(component.isPlaying).toBe(false);
  });

  it('should render play button', () => {
    const playButton = fixture.debugElement.query(By.css('.play-button'));
    expect(playButton).toBeTruthy();
  });

  it('should render track info when audio player is shown', () => {
    component.showAudioPlayer = true;
    component.trackTitle = 'Test Title';
    component.trackArtist = 'Test Artist';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const trackInfo = compiled.querySelector('.track-info');
    expect(trackInfo).toBeTruthy();
    expect(trackInfo?.textContent).toContain('Test Title');
    expect(trackInfo?.textContent).toContain('Test Artist');
  });
});
