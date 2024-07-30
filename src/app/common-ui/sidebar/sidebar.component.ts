import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom, from, Observable } from 'rxjs';
import { Profile } from '../../data/interfaces/profile.interface';
import { ProfileService } from '../../data/services/profile.service';
import { ImgUrlPipe } from "../../helpers/pipes/img-url.pipe";
import { SvgIconComponent } from "../svg-icon/svg-icon.component";
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [SvgIconComponent, SubscriberCardComponent, RouterLink, AsyncPipe, JsonPipe, ImgUrlPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  profileService: ProfileService = inject(ProfileService);

  subscribers$: Observable<Profile[]> = from(this.profileService.getSubscribersShortList());
  me = this.profileService.me;

  menuItems: {label: string, icon: string, link: string}[] = [
    {
      label: 'Моя страница',
      icon: 'sidebar_icon_home',
      link: ''
    },
    {
      label: 'Чаты',
      icon: 'sidebar_icon_chat',
      link: ''
    },
    {
      label: 'Поиск',
      icon: 'sidebar_icon_loupe',
      link: 'search'
    },
  ];

  ngOnInit() {
    firstValueFrom(this.profileService.getMe())
  }
}
