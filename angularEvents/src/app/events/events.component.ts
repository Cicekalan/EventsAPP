import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventlistComponent } from './eventlist/eventlist.component';
import { CommonModule } from '@angular/common';
import { EventdetailComponent } from './eventdetail/eventdetail.component';
import { EventcreateComponent } from './eventcreate/eventcreate.component';
import { EventService } from '../service/event.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [FormsModule,EventlistComponent,CommonModule,EventdetailComponent,EventcreateComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {
  isLoggedIn = false;
  selectedEventId: string = '';
  showEventCreateForm: boolean = false;

  private eventService = inject(EventService);

  onLoginChange(loginStatus: boolean) {
    this.isLoggedIn = loginStatus;
  }

  toggleEventCreateForm() {
    this.showEventCreateForm = !this.showEventCreateForm;
  }

  onEventCreated() {
    this.eventService.getEvents().subscribe(); 
  }

}
