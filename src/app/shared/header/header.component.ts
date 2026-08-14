import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    standalone: false
})
export class HeaderComponent {

    @Input() public menuAbierto = false;

    @Output() public menuClick = new EventEmitter<void>();

    public toggleMenu(): void {
        this.menuClick.emit();
    }
}
