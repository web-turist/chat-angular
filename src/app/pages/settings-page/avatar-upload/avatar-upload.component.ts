import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DndDirective } from '../../../common-ui/directives/dnd.directive';
import { SvgIconComponent } from '../../../common-ui/svg-icon/svg-icon.component';

@Component({
  selector: 'app-avatar-upload',
  standalone: true,
  imports: [SvgIconComponent, DndDirective, FormsModule],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.scss'
})
export class AvatarUploadComponent {

  preview = signal<string>('/assets/icons/avatar_default.svg');
  avatar: File | null = null;


  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];

    this.processFile(file)

  }

  onFileDropped(file: File) {

    this.processFile(file)

  }

  processFile(file: File | null | undefined) {
    if (!file) {
      console.log('Файла нет');
     }

     if (!file?.type.match('image')) {
      console.log('Это не картинка');
     }

     const reader: FileReader = new FileReader();

     reader.onload = event => {
      this.preview.set(event.target?.result?.toString() ?? '');
     }

     if (file) {
       reader.readAsDataURL(file);
       this.avatar = file;
      }
  }
}
