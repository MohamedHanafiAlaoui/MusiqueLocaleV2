import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchQuery = '';
  selectedCategory = '';
  showFilters = false;
  
  @Output() search = new EventEmitter<string>();
  @Output() categoryChange = new EventEmitter<string>();

  categories = [
    { value: '', label: 'All Categories' },
    { value: 'POP', label: 'Pop' },
    { value: 'ROCK', label: 'Rock' },
    { value: 'RAP', label: 'Rap' },
    { value: 'JAZZ', label: 'Jazz' },
    { value: 'CLASSICAL', label: 'Classical' },
    { value: 'ELECTRONIC', label: 'Electronic' },
    { value: 'REGGAE', label: 'Reggae' },
    { value: 'OTHER', label: 'Other' }
  ];

  onSearchInput() {
    this.search.emit(this.searchQuery);
  }

  applySearch() {
    this.showFilters = true;
    this.search.emit(this.searchQuery);
  }

  onCategorySelect() {
    this.showFilters = true;
    this.categoryChange.emit(this.selectedCategory);
  }

  clearSearch() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.showFilters = false;
    this.search.emit('');
    this.categoryChange.emit('');
  }
}
