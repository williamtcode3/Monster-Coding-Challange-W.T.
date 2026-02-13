import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class FormPage {
  airline = '';
  flightNumber = '';
  arrivalDate = '';
  arrivalTime = '';
  numOfGuests!: number;
  comments = '';

  success = false;
  error = '';
  loading = false;

  showSuccessModal = false;
  successModalMessage = 'Submission successful!';

  today = new Date().toISOString().split('T')[0];

  arrivalHour = '';
  arrivalMinute = '';
  meridiem: 'AM' | 'PM' = 'AM';

  hours = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  minutes = [
    '00','01','02','03','04','05','06','07','08','09',
    '10','11','12','13','14','15','16','17','18','19',
    '20','21','22','23','24','25','26','27','28','29',
    '30','31','32','33','34','35','36','37','38','39',
    '40','41','42','43','44','45','46','47','48','49',
    '50','51','52','53','54','55','56','57','58','59'
  ];

  private readonly endpoint =
    'https://us-central1-crm-sdk.cloudfunctions.net/flightInfoChallenge';

  private readonly tokenHeaderValue =
    'WW91IG11c3QgYmUgdGhlIGN1cmlvdXMgdHlwZS4gIEJyaW5nIHRoaXMgdXAgYXQgdGhlIGludGVydmlldyBmb3IgYm9udXMgcG9pbnRzICEh';

  private readonly candidateName = 'William Troscher';

  constructor(
    private http: HttpClient,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  blockInvalidNumberInput(event: KeyboardEvent) {
    if (['e', 'E', '+', '-', '.'].includes(event.key)) {
      event.preventDefault();
    }
  }

  async submit() {
    this.zone.run(() => {
      this.success = false;
      this.error = '';
      this.loading = true;
    });
    this.cdr.detectChanges();

    this.arrivalTime = `${this.arrivalHour}:${this.arrivalMinute} ${this.meridiem}`;

    if (
      !this.airline.trim() ||
      !this.flightNumber.trim() ||
      !this.arrivalDate ||
      !this.arrivalHour ||
      !this.arrivalMinute
    ) {
      this.zone.run(() => {
        this.error = 'Please fill out all required fields.';
        this.loading = false;
      });
      this.cdr.detectChanges();
      return;
    }

    const guests = Number(this.numOfGuests);
    if (!Number.isFinite(guests) || guests <= 0) {
      this.zone.run(() => {
        this.error = 'Number of guests must be a valid number greater than 0.';
        this.loading = false;
      });
      this.cdr.detectChanges();
      return;
    }

    const payload: {
      airline: string;
      arrivalDate: string;
      arrivalTime: string;
      flightNumber: string;
      numOfGuests: number;
      comments?: string;
    } = {
      airline: this.airline.trim(),
      arrivalDate: this.arrivalDate,
      arrivalTime: this.arrivalTime,
      flightNumber: this.flightNumber.trim(),
      numOfGuests: guests,
    };

    const cleanedComments = this.comments.trim();
    if (cleanedComments) payload.comments = cleanedComments;

    const headers = new HttpHeaders({
      token: this.tokenHeaderValue,
      candidate: this.candidateName,
    });

    try {
        await firstValueFrom(
        this.http.post(this.endpoint, payload, { headers })
        );

      this.zone.run(() => {
        this.success = true;
        this.showSuccessModal = true;
      });
    } catch (e) {
      const err = e as HttpErrorResponse;

      const serverMsg =
        typeof err.error === 'string'
          ? err.error
          : err.error?.message || err.message;

      this.zone.run(() => {
        this.error = serverMsg || 'Request failed.';
        this.success = false;
      });
    } finally {
      this.zone.run(() => {
        this.loading = false;
      });
      this.cdr.detectChanges();
    }
  }

  isFieldInvalid(value: any) {
    return this.error === 'Please fill out all required fields.' && !value;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;

    this.airline = '';
    this.flightNumber = '';
    this.arrivalDate = '';
    this.arrivalTime = '';
    this.arrivalHour = '';
    this.arrivalMinute = '';
    this.meridiem = 'AM';
    this.numOfGuests = undefined as any;
    this.comments = '';

    this.success = false;
    this.error = '';
  }
}
