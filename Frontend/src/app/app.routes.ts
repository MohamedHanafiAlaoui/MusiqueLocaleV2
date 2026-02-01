import { Routes } from '@angular/router';
import { TrackListComponent } from './components/track-list/track-list.component';
import { TrackFormComponent } from './components/track-form/track-form.component';
import { TrackDetailsComponent } from './components/track-details/track-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/tracks', pathMatch: 'full' },
  { path: 'tracks', component: TrackListComponent },
  { path: 'tracks/create', component: TrackFormComponent },
  { path: 'tracks/:id', component: TrackDetailsComponent },
  { path: 'tracks/:id/edit', component: TrackFormComponent }
];
