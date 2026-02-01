import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FooterPlayerComponent } from './components/footer-player/footer-player.component';
import { Track } from './models/track';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Music Track Manager' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Music Track Manager');
  });

  it('should initialize with empty tracks array', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.allTracks).toEqual([]);
    expect(app.currentTrackIndex).toBe(-1);
  });

  it('should have footer player component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const footerPlayer = fixture.debugElement.query(By.directive(FooterPlayerComponent));
    expect(footerPlayer).toBeTruthy();
  });

  it('should handle play track event from footer', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    // Mock footer player
    const mockFooterPlayer = {
      playTrackFromCard: jasmine.createSpy('playTrackFromCard')
    } as any;
    app.footerPlayer = mockFooterPlayer;

    // Setup test data
    const testTrack: Track = {
      id: 1,
      title: 'Test Song',
      artist: 'Test Artist',
      category: 'pop',
      fileUrl: 'http://example.com/test.mp3'
    };
    app.allTracks = [testTrack];

    // Call the method
    app.onPlayTrackInFooter(testTrack);

    // Verify footer player method was called
    expect(mockFooterPlayer.playTrackFromCard).toHaveBeenCalledWith(testTrack);
    expect(app.currentTrackIndex).toBe(0);
  });

  it('should handle play track event with track not in list', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    
    // Mock footer player
    const mockFooterPlayer = {
      playTrackFromCard: jasmine.createSpy('playTrackFromCard')
    } as any;
    app.footerPlayer = mockFooterPlayer;

    // Setup test data
    const testTrack: Track = {
      id: 1,
      title: 'Test Song',
      artist: 'Test Artist',
      category: 'pop',
      fileUrl: 'http://example.com/test.mp3'
    };
    app.allTracks = []; // Empty tracks array

    // Call the method
    app.onPlayTrackInFooter(testTrack);

    // Verify footer player method was called
    expect(mockFooterPlayer.playTrackFromCard).toHaveBeenCalledWith(testTrack);
    expect(app.currentTrackIndex).toBe(-1); // Should be -1 when not found
  });

  it('should render router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should render navbar component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const navbar = compiled.querySelector('app-navbar');
    expect(navbar).toBeTruthy();
  });

  it('should render footer player component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const footerPlayer = compiled.querySelector('app-footer-player');
    expect(footerPlayer).toBeTruthy();
  });
});
