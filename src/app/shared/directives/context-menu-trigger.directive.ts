import { Directive, ElementRef, HostBinding, HostListener, inject, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ContextMenuService } from './context-menu.service';

@Directive({
  selector: '[appContextMenuTrigger]',
  standalone: false,
})
export class ContextMenuTriggerDirective implements OnChanges, OnDestroy{

  private readonly constextMenu = inject(ContextMenuService);
  private readonly element = inject(ElementRef<HTMLElement>);

  private idRegistrado: string | null = null;

  @Input('appContextMenuTrigger') public menuId!: string;

  @HostBinding('attr.aria-haspopup')
  public readonly ariaHasPopup = 'menu';

  @HostBinding('attr.aria-expanded')
  public get ariaExpanded(): boolean {
    return this.constextMenu.estaAbierto(this.menuId);
  }

  public ngOnChanges(changes: SimpleChanges): void {
      if(!changes['menuId']) return;

      if(this.idRegistrado){
        this.constextMenu.eliminarTrigger(this.idRegistrado);
      }

      if(!this.menuId) return;

      this.constextMenu.registrarTrigger(this.menuId, this.element);

      this.idRegistrado = this.menuId;
  }


  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void{

    event.stopPropagation();

    if(!this.menuId) return;

    this.constextMenu.toggle(this.menuId);
  }

  public ngOnDestroy(): void {
      if(!this.idRegistrado) return;

      this.constextMenu.eliminarTrigger(this.idRegistrado);
  }

}
