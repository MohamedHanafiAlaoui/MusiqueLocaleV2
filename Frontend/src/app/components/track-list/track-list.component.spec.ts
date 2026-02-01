import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TrackListComponent } from './track-list.component';
import { TrackService } from '../../service/track-service.service';
import { ErrorService } from '../../service/error-service.service';
import { AudioPlayerService } from '../../service/audio-player.service';
import { Track } from '../../models/track';

describe('TrackListComponent', () => {
  let component: TrackListComponent;
  let fixture: ComponentFixture<TrackListComponent>;
  let mockTrackService: jasmine.SpyObj<TrackService>;
  let mockErrorService: jasmine.SpyObj<ErrorService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAudioPlayerService: jasmine.SpyObj<AudioPlayerService>;

  const mockTracks: Track[] = [
    {
      id: 1,
      title: 'Test Song 1',
      artist: 'Test Artist 1',
      category: 'pop',
      fileUrl: 'http://example.com/test1.mp3',
      duration: 180,
      fileSize: 1024000
    },
    {
      id: 2,
      title: 'Test Song 2',
      artist: 'Test Artist 2',
      category: 'rock',
      fileUrl: 'http://example.com/test2.mp3',
      duration: 240,
      fileSize: 2048000
    }
  ];

  const mockPaginatedResponse = {
    content: mockTracks,
    totalElements: 2,
    totalPages: 1,
    size: 8,
    number: 0
  };

  beforeEach(async () => {
    mockTrackService = jasmine.createSpyObj('TrackService', ['searchTracks', 'deleteTrack']);
    mockErrorService = jasmine.createSpyObj('ErrorService', ['handleError']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockAudioPlayerService = jasmine.createSpyObj('AudioPlayerService', ['playTrack', 'updateTracksList']);

    await TestBed.configureTestingModule({
      imports: [TrackListComponent],
      providers: [
        { provide: TrackService, useValue: mockTrackService },
        { provide: ErrorService, useValue: mockErrorService },
        { provide: Router, useValue: mockRouter },
        { provide: AudioPlayerService, useValue: mockAudioPlayerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TrackListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.tracks).toEqual([]);
    expect(component.currentPage).toBe(0);
    expect(component.pageSize).toBe(8);
    expect(component.totalPages).toBe(0);
    expect(component.totalElements).toBe(0);
    expect(component.loading).toBe(false);
    expect(component.searchTitle).toBe('');
    expect(component.searchCategory).toBe('');
    expect(component.currentlyPlayingTrackId).toBeNull();
  });

  it('should have correct categories', () => {
    expect(component.categories.length).toBe(8);
    expect(component.categories[0]).toEqual({ value: 'pop', label: 'Pop', color: '#FF6B6B' });
    expect(component.categories[1]).toEqual({ value: 'rock', label: 'Rock', color: '#4ECDC4' });
    expect(component.categories[7]).toEqual({ value: 'other', label: 'Other', color: '#B8B8B8' });
  });

  it('should load tracks on init', () => {
    mockTrackService.searchTracks.and.returnValue(of(mockPaginatedResponse));
    
    component.ngOnInit();
    
    expect(mockTrackService.searchTracks).toHaveBeenCalledWith(undefined, undefined, 0, 8);
    expect(component.tracks).toEqual(mockTracks);
    expect(component.totalPages).toBe(1);
    expect(component.totalElements).toBe(2);
    expect(component.loading).toBe(false);
  });

  it('should handle search with title and category', () => {
    mockTrackService.searchTracks.and.returnValue(of(mockPaginatedResponse));
    
    component.searchTitle = 'Test Song';
    component.searchCategory = 'pop';
    component.onSearch();
    
    expect(component.currentPage).toBe(0);
    expect(mockTrackService.searchTracks).toHaveBeenCalledWith('Test Song', 'pop', 0, 8);
  });

  it('should handle page change', () => {
    mockTrackService.searchTracks.and.returnValue(of(mockPaginatedResponse));
    
    component.onPageChange(2);
    
    expect(component.currentPage).toBe(2);
    expect(mockTrackService.searchTracks).toHaveBeenCalledWith(undefined, undefined, 2, 8);
  });

  it('should get category color correctly', () => {
    const color = component.getCategoryColor('pop');
    expect(color).toBe('#FF6B6B');
    
    const defaultColor = component.getCategoryColor('unknown');
    expect(defaultColor).toBe('#B8B8B8');
  });

  it('should play track', () => {
    component.tracks = mockTracks;
    
    component.playTrack(mockTracks[0]);
    
    expect(component.currentlyPlayingTrackId).toBe(1);
    expect(mockAudioPlayerService.playTrack).toHaveBeenCalledWith(mockTracks[0]);
    expect(mockAudioPlayerService.updateTracksList).toHaveBeenCalledWith(mockTracks, 0);
  });

  it('should toggle play state when same track is clicked', () => {
    component.tracks = mockTracks;
    component.currentlyPlayingTrackId = 1;
    
    component.playTrack(mockTracks[0]);
    
    expect(component.currentlyPlayingTrackId).toBeNull();
    expect(mockAudioPlayerService.playTrack).toHaveBeenCalledWith(mockTracks[0]);
  });

  it('should check if track is playing', () => {
    component.currentlyPlayingTrackId = 1;
    
    expect(component.isTrackPlaying(1)).toBe(true);
    expect(component.isTrackPlaying(2)).toBe(false);
  });

  it('should edit track', () => {
    component.editTrack(mockTracks[0]);
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tracks', 1, 'edit']);
  });

  it('should view track details', () => {
    component.viewTrackDetails(mockTracks[0]);
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tracks', 1]);
  });

  it('should delete track with confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockTrackService.deleteTrack.and.returnValue(of(void 0));
    mockTrackService.searchTracks.and.returnValue(of(mockPaginatedResponse));
    
    component.deleteTrack(1);
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this track?');
    expect(mockTrackService.deleteTrack).toHaveBeenCalledWith(1);
    expect(mockTrackService.searchTracks).toHaveBeenCalled();
  });

  it('should not delete track when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    
    component.deleteTrack(1);
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this track?');
    expect(mockTrackService.deleteTrack).not.toHaveBeenCalled();
  });

  it('should handle delete track error', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockTrackService.deleteTrack.and.returnValue(throwError(() => new Error('Delete error')));
    
    component.deleteTrack(1);
    
    expect(mockErrorService.handleError).toHaveBeenCalled();
  });

  it('should format duration correctly', () => {
    expect(component.formatDuration(180)).toBe('3:00');
    expect(component.formatDuration(65)).toBe('1:05');
    expect(component.formatDuration(0)).toBe('0:00');
    expect(component.formatDuration(undefined)).toBe('0:00');
  });

  it('should format file size correctly', () => {
    expect(component.formatFileSize(1024000)).toBe('0.98 MB');
    expect(component.formatFileSize(2048000)).toBe('1.95 MB');
    expect(component.formatFileSize(0)).toBe('0.00 MB');
    expect(component.formatFileSize(undefined)).toBe('0 MB');
  });

  it('should handle loading state', () => {
    mockTrackService.searchTracks.and.returnValue(of(mockPaginatedResponse));
    
    component.loadTracks();
    
    expect(component.loading).toBe(true);
    
    // After response
    expect(component.loading).toBe(false);
  });

  it('should handle load tracks error', () => {
    mockTrackService.searchTracks.and.returnValue(throwError(() => new Error('Load error')));
    
    component.loadTracks();
    
    expect(mockErrorService.handleError).toHaveBeenCalled();
    expect(component.loading).toBe(false);
  });

  it('should cleanup on destroy', () => {
    component.currentlyPlayingTrackId = 1;
    
    component.ngOnDestroy();
    
    expect(component.currentlyPlayingTrackId).toBeNull();
  });

  it('should render search form', () => {
    const searchForm = fixture.debugElement.query(By.css('.search-form'));
    expect(searchForm).toBeTruthy();
    
    const titleInput = fixture.debugElement.query(By.css('input[placeholder*="title"]'));
    const categorySelect = fixture.debugElement.query(By.css('select'));
    const searchButton = fixture.debugElement.query(By.css('button'));
    
    expect(titleInput).toBeTruthy();
    expect(categorySelect).toBeTruthy();
    expect(searchButton).toBeTruthy();
  });

  it('should render track list when tracks are loaded', () => {
    mockTrackService.searchTracks.and.returnValue(of(mockPaginatedResponse));
    component.loadTracks();
    fixture.detectChanges();
    
    const trackCards = fixture.debugElement.queryAll(By.css('.track-card'));
    expect(trackCards.length).toBe(2);
  });

  it('should render loading state', () => {
    component.loading = true;
    fixture.detectChanges();
    
    const loadingElement = fixture.debugElement.query(By.css('.loading'));
    expect(loadingElement).toBeTruthy();
  });

  it('should render empty state when no tracks', () => {
    component.tracks = [];
    fixture.detectChanges();
    
    const emptyState = fixture.debugElement.query(By.css('.empty-state'));
    expect(emptyState).toBeTruthy();
  });

  it('should render pagination when multiple pages', () => {
    component.totalPages = 3;
    component.currentPage = 1;
    fixture.detectChanges();
    
    const pagination = fixture.debugElement.query(By.css('.pagination'));
    expect(pagination).toBeTruthy();
  });

  it('should handle track with missing ID in delete', () => {
    const trackWithoutId = { ...mockTracks[0], id: undefined };
    
    component.deleteTrack(trackWithoutId.id);
    
    expect(mockTrackService.deleteTrack).not.toHaveBeenCalled();
  });

  it('should handle search with empty parameters', () => {
    mockTrackService.searchTracks.and.returnValue(of(mockPaginatedResponse));
    
    component.searchTitle = '';
    component.searchCategory = '';
    component.onSearch();
    
    expect(mockTrackService.searchTracks).toHaveBeenCalledWith(undefined, undefined, 0, 8);
  });
});
