import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { Pageble } from './../interfaces/pageble.interface';
import { Profile } from './../interfaces/profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  http = inject(HttpClient);
  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  me = signal<Profile | null>(null);
  filteredProfiles = signal<Profile[]>([]);

  getAccounts() {
    return this.http.get<Profile[]>(`${this.baseApiUrl}account/test_accounts`);
  }

  getAccount(id: string) {
    return this.http.get<Profile>(`${this.baseApiUrl}account/${id}`);
  }

  getMe() {
    return this.http.get<Profile>(`${this.baseApiUrl}account/me`)
      .pipe(
        tap((res: Profile) => this.me.set(res))
      )
  }

  getSubscribersShortList(amount: number = 4) {
    return this.http.get<Pageble<Profile>>(`${this.baseApiUrl}account/subscribers/`)
      .pipe(
        map((res: Pageble<Profile>): Profile[] => {
          return res.items.slice(0, amount);
        })
      )
  }

  patchProfile(profile: Partial<Profile>) {
    return this.http.patch<Profile>(
      `${this.baseApiUrl}account/me`,
      profile
    )
  }

  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append('image', file)
    return this.http.post(`${this.baseApiUrl}account/upload_image`, fd)
  }

  filterProfiles(params: Record<string, any>) {
    return this.http.get<Pageble<Profile>>(`${this.baseApiUrl}account/accounts`, { params })
      .pipe(
        tap(res => {
          this.filteredProfiles.set(res.items);
        })
      )
  }
}
