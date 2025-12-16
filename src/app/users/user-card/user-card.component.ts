import { Component, input } from '@angular/core';
import { Admin } from '../users.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-card',
  imports: [RouterLink],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css',
})
export class UserCardComponent {
  user = input.required<Admin>();
}
