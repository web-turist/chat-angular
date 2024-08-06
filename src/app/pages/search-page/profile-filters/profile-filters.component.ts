import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith, switchMap } from 'rxjs';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';
import { ProfileService } from '../../../data/services/profile.service';

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [SvgIconComponent, ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss'
})
export class ProfileFiltersComponent {
  fb = inject(FormBuilder);
  profileService = inject(ProfileService);

  serchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: ['']
  });

  constructor() {
    this.serchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
        switchMap(formValue => {
          return this.profileService.filterProfiles(formValue);
        }),
        takeUntilDestroyed()
      )
      .subscribe()
  }
}
