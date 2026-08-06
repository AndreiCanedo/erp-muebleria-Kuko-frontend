import { AfterViewInit, Directive, effect, ElementRef, HostBinding, HostListener, inject, Input, OnDestroy } from '@angular/core';
import { ContextMenuService } from './context-menu.service';

@Directive({
  selector: '[appContextMenu]',
  standalone: false,
})
export class ContextMenuDirective implements AfterViewInit, OnDestroy{

  private readonly contextMenu = inject(ContextMenuService);
  private readonly element = inject(ElementRef<HTMLElement>);

  private readonly margen = 12;

  private menuEffect = effect(() => {
    const abierto = this.contextMenu.estaAbierto(this.menuId);

    this.oculto = !abierto;

    if(abierto){
      queueMicrotask(() => {
        this.calcularPosicion();
      });
    }
  });
  
  @Input('appContextMenu') public menuId!: string;

  @HostBinding('hidden') 
  public oculto = true;

  @HostBinding('class.context-menu--up')
  public abrirArriba = false;

  @HostBinding('class.context-menu--down')
  public get abrirAbajo(): boolean {
    return !this.abrirArriba;
  }

  @HostBinding('attr.role')
  public readonly role = 'menu';

  public ngAfterViewInit(): void {
    if(this.contextMenu.estaAbierto(this.menuId)){
      this.calcularPosicion();
    }
  }

  @HostListener('document:click', ['$event'])
  public clickDocumento(event: MouseEvent):void{

    if(!this.contextMenu.estaAbierto(this.menuId)) return;

    const target = event.target as Node;
    const menu = this.element.nativeElement;

    const trigger = this.contextMenu.obtenerTrigger(this.menuId)?.nativeElement;

    const clickDentroMenu = menu.contains(target);

    const clickDentroTrigger = trigger?.contains(target) ?? false;

    if(!clickDentroMenu && !clickDentroTrigger){
      this.contextMenu.cerrar();
    }
  }
  
  @HostListener('document:keydown.escape')
  public cerrarConEscape(): void{
    if(!this.contextMenu.estaAbierto(this.menuId)) return;

    const trigger = this.contextMenu.obtenerTrigger(this.menuId)?.nativeElement;

    this.contextMenu.cerrar();

    trigger?.focus();
  }

  @HostListener('window:resize')
  public alCambiarTamano(): void{
    this.reposicionar();
  }

  @HostListener('window:scroll')
  public alHacerScroll(): void{
    this.reposicionar();
  }

  private reposicionar(): void{

    if(!this.contextMenu.estaAbierto(this.menuId)) return;

    this.calcularPosicion();
  }

  private calcularPosicion(): void{
    const menu = this.element.nativeElement;

    const trigger = this.contextMenu.obtenerTrigger(this.menuId)?.nativeElement;

    if(!trigger){
      this.abrirArriba = false;
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();

    const alturaMenu = menu.offsetHeight;

    const espacioAbajo = window.innerHeight- triggerRect.bottom;

    const espacioArriba = triggerRect.top;

    const noCabeAbajo = espacioAbajo < alturaMenu + this.margen;

    const cabeArriba = espacioArriba >= alturaMenu + this.margen;

    this.abrirArriba = noCabeAbajo && cabeArriba;

  }

  public ngOnDestroy(): void {
      this.menuEffect.destroy();
  }

}
