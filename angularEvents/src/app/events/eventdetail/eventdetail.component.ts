import { ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';
import { EventService } from '../../service/event.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eventdetail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eventdetail.component.html',
  styleUrl: './eventdetail.component.css'
})
export class EventdetailComponent {
  @Input() selectedEventId!: string;
  event: any;
  joinedEventIds: number[] = [];

  constructor(private eventService: EventService , private cdRef: ChangeDetectorRef) {}



  ngOnChanges(changes: SimpleChanges): void {
    this.event = null;
    console.log(this.selectedEventId)
    if (changes['selectedEventId'] && this.selectedEventId) {
      this.eventService.getEvent(this.selectedEventId).subscribe(data => {
        console.log( this.event);
        this.event = data;
        console.log("AFTERT" + JSON.stringify(this.event, null, 2));
        this.checkIfUserJoinedEvents();

      });
    }
  }

  hasUserJoined(): boolean {
    console.log(this.joinedEventIds)
    return this.joinedEventIds.includes(Number(this.selectedEventId));
  }

  loadEventDetails(eventId: string) {
    this.event = null;
    this.eventService.getEvent(eventId).subscribe(data => {
      this.event = data;
    });
  }

  checkIfUserJoinedEvents() {
    this.eventService.getJoinEvent().subscribe({
      next: (joinedEventIds) => {
        this.joinedEventIds = joinedEventIds;
        console.log('Joined event IDs:', this.joinedEventIds);
      },
      error: (error) => {
        console.error('Error fetching joined event IDs:', error);
        if (error.status === 404) {
          console.log('No joined events found for the user.');
          this.joinedEventIds = []; 
        }
      }
    });
  }


  joinEvent(eventId: string) {
    this.eventService.joinEvent(eventId).subscribe({
      next: (response) => {
        console.log('Response:', response);
        console.log('Successfully joined the event!');
        this.joinedEventIds.push(Number(eventId));
        this.checkIfUserJoinedEvents();

      },
      error: (error) => {
        if (error.error && error.error.detail) {
          console.error('Failed to join the event:', error.error.detail);
          console.log('Failed to join the event. Please try again later.');
        } else {
          console.error('Failed to join the event:', error.message);
          console.log('Failed to join the event. Please try again later.');
        }
      }
    });
  }


}
