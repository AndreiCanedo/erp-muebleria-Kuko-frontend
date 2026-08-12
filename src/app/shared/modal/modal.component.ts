import { Component,EventEmitter, Input, Output, OnChanges, SimpleChanges, HostListener, inject } from '@angular/core';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {


  @Input() visible = false;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() title = '';
  @Input() showClose = true;
  @Input() closeOnBackdrop = true;
  @Input() closeOnEsc = true;

  @Output() cerrar = new EventEmitter<void>();

  private modalServices = inject(ModalService);

  private modalId = 0;

  public mostrar = false;

  public animacion = '';

  private cerrando = false;

  ngOnChanges(changes: SimpleChanges):void{


    if(changes['visible']){

      if(this.visible &&  !this.mostrar){
        this.abrir();
      }

      if(!this.visible && this.mostrar){
        this.cerrarModal();
      }
    }
  }

  private abrir():void{

    this.cerrando = false;

    this.mostrar = true;

    this.modalId = this.modalServices.registrar();

    //esperamos un frame para que el navegador pinte el DOM
    requestAnimationFrame(() => {
    
      this.animacion = 'modal__open';
    
    });
  }

  public cerrarModal():void{

    if(!this.mostrar) return;
  
    this.cerrando = true;
    this.animacion = 'modal__close';
  
  }

  public onBackdropClick(): void{

    if(!this.closeOnBackdrop) return;

    if(!this.modalServices.esElUltimo(this.modalId)) return;

    this.cerrarModal();
  }

  //nos ayuda esta funcion a eliminar la funcion setTimeout de cerrarModal()
  public onAnimationEnd(): void{
  
    if(this.cerrando) {
      this.modalServices.eliminar(this.modalId);

      this.cerrando = false;
      this.mostrar = false;

      this.cerrar.emit();

      return;
    }

    // Termino la animacion de apertura
    // Quitamos el transform del modal
    if (this.animacion === 'modal__open') {
      this.animacion = 'modal__opened';
    }
  
  }

  //Host Listener una funcion de Angular que espera o escucha cada 
  //tecla que usamos y espera a que precionemos ESC para cerrar modal
  @HostListener('document:keydown.escape')
  onEscape(): void{
  
    if(!this.closeOnEsc) return;

    if(!this.mostrar) return;

    if(!this.modalServices.esElUltimo(this.modalId)) return;

    this.cerrarModal();
  
  }
}
