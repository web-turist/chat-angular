import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileCardComponent } from './common-ui/profile-card/profile-card.component';
import { Profile } from './data/interfaces/profile.interface';
import { ProfileService } from './data/services/profile.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, ProfileCardComponent, JsonPipe],
})
export class AppComponent {
  title = 'small-talk';
  profileService = inject(ProfileService);
  profiles: Profile[] = [];

  constructor() {
    this.profileService.getAccounts().subscribe((data) => {
      this.profiles = data;
    });
  }
}
