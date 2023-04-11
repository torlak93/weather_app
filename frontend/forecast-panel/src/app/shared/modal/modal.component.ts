import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter();
  @Input() priority = false;

  constructor() { }

  ngOnInit(): void {
    this.setBodyModalHidden(true);
  }

  onClose() {
    this.close.emit();
    this.setBodyModalHidden(false);
  }

  setBodyModalHidden(isHidden: boolean) {
    document.getElementsByTagName('body').item(0).style.overflowY = isHidden ? 'hidden' : '';
  }

  isScrollbarClick(event): boolean {
    if(event.clientX + 18 >= document.documentElement.offsetWidth) {
      return false;
    }

    return true;
      
  }

  ngOnDestroy() {
    this.setBodyModalHidden(false);
  }

}
