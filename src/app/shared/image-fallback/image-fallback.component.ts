import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-fallback',
  standalone: false,
  templateUrl: './image-fallback.component.html',
  styleUrl: './image-fallback.component.css',
})
export class ImageFallbackComponent {
  @Input() src: string | null = null;
  @Input() alt = 'Imagen';
  @Input() mensaje = 'Imagen no disponible';

  public errorImagen = false;

  public manejarError(): void {
    this.errorImagen = true;
  }

  public manejarCarga(): void {
    this.errorImagen = false;
  }
}
