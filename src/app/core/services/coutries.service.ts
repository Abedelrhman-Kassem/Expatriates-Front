import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CountriesService {
  countries = signal<string[]>([]);

  http = inject(HttpClient);

  loadCountries() {
    this.http.get<string[]>('countries-ar-names.json').subscribe((data) => {
      this.countries.set(data);
    });
  }
}
