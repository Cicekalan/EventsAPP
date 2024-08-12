import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { EventService } from '../../service/event.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';
import { EventCreate } from '../../Models/eventcreate.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-eventlist',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './eventlist.component.html',
  styleUrl: './eventlist.component.css',
})
export class EventlistComponent {
  @Input() isLoggedIn = false;
  @Output() eventSelected = new EventEmitter<string>();
  selectedEventId: string | null = null;
  events: any[] = [];
  listnull = false;
  joinedEventIds: number[] = [];

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.eventService.clearEvents();
    const isLogin = this.authService.isLoggedIn();
    if (this.authService.isLoggedIn()) {
      this.loadEvents();
      this.checkIfUserJoinedEvents();
      this.eventService.eventJoined$.subscribe((eventId) => {
        if (!this.joinedEventIds.includes(eventId)) {
          this.joinedEventIds.push(eventId);
        }
      });
      if (this.events.length > 0) {
        this.listnull = true;
      }
    } else {
      this.events = [];
    }
  }

  hasUserJoined(eventId: string): boolean {
    return this.joinedEventIds.includes(Number(eventId));
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
      },
    });
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (data: any) => {
        this.events = data;
        this.selectedEventId = null;
        console.log('Events fetched successfully:', this.events);
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      },
      complete: () => {
        console.log('Event fetching process completed.');
      },
    });
  }
  selectEvent(eventId: string): void {
    this.selectedEventId = eventId;
    this.eventSelected.emit(eventId);
  }
}
