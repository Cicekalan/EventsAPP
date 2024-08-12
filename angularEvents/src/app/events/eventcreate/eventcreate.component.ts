import { Component, EventEmitter, inject, Output } from '@angular/core';
import { EventCreate } from '../../Models/eventcreate.model';
import { EventService } from '../../service/event.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-eventcreate',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './eventcreate.component.html',
  styleUrl: './eventcreate.component.css'
})
export class EventcreateComponent {
  enteredTitle: string = '';
  enteredDescription: string = '';
  enteredDate: string = '';
  enteredLocation: string = '';
  @Output() onCancel = new EventEmitter<void>();
  @Output() eventCreated = new EventEmitter<void>();

  
  private eventService = inject(EventService);



  onSubmit() {
    const newEvent: EventCreate = {
      name: this.enteredTitle,
      description: this.enteredDescription,
      date: this.enteredDate,
      location: this.enteredLocation
    };

    this.eventService.createEvent(newEvent).subscribe({
      next: response => {
        console.log('Event created successfully:', response);
        this.onCancel.emit();
        this.eventCreated.emit();
      },
      error: error => {
        console.error('Error creating event:', error);
      },
      complete: () => {
        console.log('Event creation request completed');
      }
    });
  }
  

  handleCancel() {
    this.onCancel.emit(); 
  }

}
