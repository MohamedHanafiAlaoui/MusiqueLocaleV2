import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Track } from '../../models/track';
import { TrackService } from '../../service/track-service.service';
import { ErrorService } from '../../service/error-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-track-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './track-form.component.html',
  styleUrl: './track-form.component.css'
})
export class TrackFormComponent implements OnInit {
  trackForm: FormGroup;
  isEditMode = false;
  trackId: number | null = null;
  loading = false;
  selectedFile: File | null = null;
  audioDuration: number = 0;

  categories = [
    { value: 'pop', label: 'Pop' },
    { value: 'rock', label: 'Rock' },
    { value: 'rap', label: 'Rap' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'classical', label: 'Classical' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'reggae', label: 'Reggae' },
    { value: 'other', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private trackService: TrackService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.trackForm = this.createForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.trackId = +id;
      this.loadTrack(+id);
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      artist: ['', [Validators.required, Validators.maxLength(100)]],
      category: ['', Validators.required],
      description: ['', Validators.maxLength(500)],
      duration: [0],
      coverImage: ['']
    });
  }

  loadTrack(id: number): void {
    this.loading = true;
    this.trackService.getTrackById(id).subscribe({
      next: (track) => {
        this.trackForm.patchValue({
          title: track.title,
          artist: track.artist,
          category: track.category,
          description: track.description || '',
          duration: track.duration || 0,
          coverImage: track.coverImage || ''
        });
        this.loading = false;
      },
      error: (error) => {
        this.errorService.handleError(error);
        this.loading = false;
      }
    });
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.extractAudioDuration(file);
    }
  }

  extractAudioDuration(file: File): void {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    
    audio.addEventListener('loadedmetadata', () => {
      this.audioDuration = Math.floor(audio.duration);
      this.trackForm.patchValue({ duration: this.audioDuration });
      URL.revokeObjectURL(url);
    });
    
    audio.addEventListener('error', () => {
      console.error('Error loading audio metadata');
      URL.revokeObjectURL(url);
    });
    
    audio.src = url;
  }

  onSubmit(): void {
    if (this.trackForm.invalid) {
      this.markFormGroupTouched(this.trackForm);
      return;
    }

    this.loading = true;
    const formData = this.createFormData();

    const request = this.isEditMode 
      ? this.trackService.updateTrack(this.trackId!, formData)
      : this.trackService.createTrack(formData);

    request.subscribe({
      next: () => {
        this.router.navigate(['/tracks']);
      },
      error: (error) => {
        this.errorService.handleError(error);
        this.loading = false;
      }
    });
  }

  createFormData(): FormData {
    const formData = new FormData();
    const formValue = this.trackForm.value;

    formData.append('title', formValue.title);
    formData.append('artist', formValue.artist);
    formData.append('category', formValue.category);
    formData.append('description', formValue.description || '');
    formData.append('duration', formValue.duration.toString());
    formData.append('coverImage', formValue.coverImage || '');

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    } else if (!this.isEditMode) {
      alert('Please select an audio file');
      this.loading = false;
      throw new Error('Audio file is required');
    }

    return formData;
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/tracks']);
  }

  getFieldError(fieldName: string): string {
    const field = this.trackForm.get(fieldName);
    if (field?.touched && field?.invalid) {
      if (field.errors?.['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors?.['maxlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is too long`;
      }
    }
    return '';
  }
}
