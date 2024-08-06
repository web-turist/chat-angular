import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[dnd]',
  standalone: true
})
export class DndDirective {

  @Output() fileDropper = new EventEmitter<File>()

  //этот декоратор добавляет класс 'filover' кэлементу на котором висит директива
  @HostBinding('class.fileover')
  fileover: boolean = false

  //фотка зависает над областью drag and drop
  @HostListener('dragover', ['$event'])
    onDragOver(event: DragEvent) {
      event.preventDefault();
      event.stopPropagation();

      this.fileover = true

    }

  //фотка покидает область drag and drop
  @HostListener('dragleave', ['$event'])
  onDragLeav(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.fileover = false

  }

  //фотка помещена в область drag and drop
  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.fileover = false;

    this.fileDropper.emit(event.dataTransfer?.files[0]);
  }

}
