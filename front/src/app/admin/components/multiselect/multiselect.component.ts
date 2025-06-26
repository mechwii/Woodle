import {Component, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

export interface Option {
  value: string;
  name: string;
}

@Component({
  selector: 'app-multiselect',
  imports: [
    FormsModule
  ],
  templateUrl: './multiselect.component.html',
  styleUrl: './multiselect.component.css'
})
export class MultiselectComponent {
  @Input() options: Option[] = [];
  @Input() placeholder: string = 'Sélectionner des options...';
  @Input() iconType: 'user' | 'ue' = 'user';
  @Input() selectedValues: string[] = [];

  @Output() selectionChange = new EventEmitter<Option[]>();
  @Output() optionAdded = new EventEmitter<Option>();
  @Output() optionRemoved = new EventEmitter<Option>();

  isOpen = false;
  filterValue = '';
  selectedOptions: Option[] = [];
  filteredOptions: Option[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.initializeSelectedOptions();
    this.updateFilteredOptions();
  }

  ngOnChanges() {
    this.initializeSelectedOptions();
    this.updateFilteredOptions();
  }

  private initializeSelectedOptions() {
    console.log(this?.selectedOptions);
    this.selectedOptions = this.options.filter(option =>
      this.selectedValues.includes(option.value)
    );
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filterValue = '';
      this.updateFilteredOptions();
    }
  }

  toggleOption(option: Option) {
    const index = this.selectedOptions.findIndex(selected => selected.value === option.value);

    if (index > -1) {
      // Désélectionner
      this.selectedOptions.splice(index, 1);
      this.optionRemoved.emit(option);
    } else {
      // Sélectionner
      this.selectedOptions.push(option);
      this.optionAdded.emit(option);
    }

    this.selectionChange.emit([...this.selectedOptions]);
  }

  removeTag(option: Option, event: Event) {
    event.stopPropagation();
    const index = this.selectedOptions.findIndex(selected => selected.value === option.value);

    if (index > -1) {
      this.selectedOptions.splice(index, 1);
      this.optionRemoved.emit(option);
      this.selectionChange.emit([...this.selectedOptions]);
    }
  }

  isSelected(option: Option): boolean {
    return this.selectedOptions.some(selected => selected.value === option.value);
  }

  onFilterChange() {
    this.updateFilteredOptions();
  }

  private updateFilteredOptions() {
    if (!this.filterValue.trim()) {
      this.filteredOptions = [...this.options];
    } else {
      const filter = this.filterValue.toLowerCase();
      this.filteredOptions = this.options.filter(option =>
        option.name.toLowerCase().includes(filter) ||
        option.value.toLowerCase().includes(filter)
      );
    }
  }

  getIconClass(): string {
    return this.iconType === 'ue' ? 'fa-solid fa-graduation-cap' : 'fa-user';
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
