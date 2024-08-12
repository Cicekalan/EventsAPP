import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { EventCreate } from '../Models/eventcreate.model';
import { BehaviorSubject, catchError, empty, Observable, Subject, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
 apiUrl ='http://127.0.0.1:8000/api/events/';
 private eventsSubject = new BehaviorSubject<EventCreate[]>([]);
 events$ = this.eventsSubject.asObservable();

 private eventJoinedSubject = new Subject<number>();
 eventJoined$ = this.eventJoinedSubject.asObservable();


  constructor(
    private httpClient: HttpClient,
  ) { }

  private authService = inject(AuthService);

  createHeaders(){
    const token = this.authService.getToken();
    if (!token) {
      console.error('No token found, user might not be logged in.');
    }
   return new HttpHeaders({
  'Authorization': `Bearer ${token}`
});
  }

/*  getEvents(){

    const headers = this.createHeaders()
    console.log(this.httpClient.get(`${this.apiUrl}`, { headers }));
    return this.httpClient.get(`${this.apiUrl}`, { headers });

    //return this.httpClient.get(`${this.apiUrl}`)
  }
    */
  getEvents(): Observable<EventCreate[]> {
    const headers = this.createHeaders();
    this.httpClient.get<EventCreate[]>(this.apiUrl, { headers }).subscribe({
      next: (events) => {
        this.eventsSubject.next(events);
        console.log('Events fetched successfully:', events);
      },
      error: (error) => {
        console.error('Error fetching events:', error);
      },
      complete: () => {
        console.log('Event fetching process completed.');
      }
    });
    return this.events$;
  }

  clearEvents(): void {
    this.eventsSubject.next([]); 
    console.log(this.eventsSubject);
    console.log("Event list cleared.");
  }

  getEvent(eventId:string){
    const headers = this.createHeaders()
    return this.httpClient.get(`${this.apiUrl}${eventId}/`, { headers });
  }
/*
  joinEvent(eventId:string){
    const headers = this.createHeaders();
    return this.httpClient.post(`${this.apiUrl}${eventId}/join/`, {}, { headers });
  }
*/

joinEvent(eventId: string): Observable<any> {
  const headers = this.createHeaders();
  return this.httpClient.post(`${this.apiUrl}${eventId}/join/`, {}, { headers }).pipe(
    tap(() => {
      this.eventJoinedSubject.next(Number(eventId)); 
    })
  );
}
  getJoinEvent(): Observable<number[]> {
    const headers = this.createHeaders();
    return this.httpClient.get<number[]>(`http://127.0.0.1:8000/api/api/events/getJoinEvent/`, { headers }).pipe(
      tap((response: number[]) => {
        console.log('Successfully fetched joined event IDs:', response);
      }),
      catchError(this.handleError)
    );
  }
  createEvent(event: EventCreate){
    const headers = this.createHeaders();
    return this.httpClient.post(`${this.apiUrl}`, event, { headers });
  }

  addEventToList(event: EventCreate) {
    const currentEvents = this.eventsSubject.value;
    this.eventsSubject.next([...currentEvents, event]);
  }
  private handleError(error: HttpErrorResponse) {
    console.error('Error fetching joined event IDs:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
