import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StateType } from './state.type';

@Component({
  selector: 'app-state',
  standalone: false,
  templateUrl: './state.component.html',
  styleUrl: './state.component.css',
})
export class StateComponent {

  @Input({ required:true }) state!: StateType;
  @Input() message = '';
  @Input() icon = '';
  @Input() buttonText = 'Reintentar';

  @Output() retry = new EventEmitter<void>();

  get iconClass(): string {
    
    if(this.icon) return this.icon

    switch(this.state) {
      
      case 'loading':
        return 'fa-solid fa-spinner fa-spin';
      
      case 'error':
        return 'fa-solid fa-circle-exclamation';

      default:
        return 'fa-solid fa-box-open'
    }

  }

  onRetry():void {
    this.retry.emit();
  }

}
