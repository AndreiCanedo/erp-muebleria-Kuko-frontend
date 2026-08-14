import { Component, HostListener } from '@angular/core';

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrl: './pages.component.css',
    standalone: false
})
export class PagesComponent {

    public menuAbierto = false;

    public abrirMenu(): void {
        this.menuAbierto = true;
    }

    public cerrarMenu(): void {
        this.menuAbierto = false;
    }

    public toggleMenu(): void {
        this.menuAbierto = !this.menuAbierto;
    }

    @HostListener('document:keydown.escape')
    public onEscape(): void {

        if (!this.menuAbierto) {
            return;
        }

        this.cerrarMenu();
    }

}
