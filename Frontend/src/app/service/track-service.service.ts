import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Track } from "../models/track";

@Injectable({ providedIn: 'root' })
export class TrackService {

  private apiUrl = 'http://localhost:8080/api/tracks';

  constructor(private http: HttpClient) {}

  getTracks(params?: any): Observable<any> {
    return this.http.get<any>(this.apiUrl, { params });
  }

  getTrackById(id: number): Observable<Track> {
    return this.http.get<Track>(`${this.apiUrl}/${id}`);
  }

  createTrack(formData: FormData): Observable<Track> {
    return this.http.post<Track>(this.apiUrl, formData);
  }

  updateTrack(id: number, formData: FormData): Observable<Track> {
    return this.http.put<Track>(`${this.apiUrl}/${id}`, formData);
  }

  deleteTrack(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchTracks(title?: string, category?: string, page: number = 0, size: number = 8): Observable<any> {
    const params: any = { page, size };
    if (title) params.title = title;
    if (category) params.category = category;
    
    return this.http.get<any>(this.apiUrl, { params });
  }
}
