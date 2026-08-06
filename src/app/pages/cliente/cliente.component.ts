import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';

import { ClienteService } from '../../services/cliente.service';

import { ClienteViewMapper } from '../../views-mapers/cliente-view.mapper';
import { Cliente } from '../../models/cliente.model';
import { ClienteView } from '../../interface/cliente-view.interface';
import { finalize } from 'rxjs';
import { ContextMenuService } from '../../shared/directives/context-menu.service';

@Component({
    selector: 'app-cliente',
    templateUrl: './cliente.component.html',
    styleUrl: './cliente.component.css',
    standalone: false
})
export class ClienteComponent {

  private readonly contextMenu = inject(ContextMenuService);
  private clienteService = inject(ClienteService);
  

  //private subscription!: Subscription;
  //nueva forma subscripcion
  private destroyRef= inject(DestroyRef);

  ///////////////////////////////////////
  /////////////////DATA//////////////////
  ///////////////////////////////////////

  public clientes: Cliente[] = [];
  public clientesView: ClienteView[] = [];

  public textoBusqueda = '';

  ///////////////////////////////////////
  //////////////UI STATE/////////////////
  ///////////////////////////////////////

  //para reducir variables de las cajas crear, editar e info
  public ui = {
    modo: 'none' as 'crear' | 'editar' | 'info' | 'none',
    modalVisible: false,

    cargando: false,
    error: '',

    clienteSeleccionado:{
      id:0,
      index: -1
    }
  }



  ngOnInit():void{
    this.initData();
    this.initSubscriptions();
  }

  ///////////////////////////////////////
  ///////////////INITS///////////////////
  ///////////////////////////////////////

  private initData(): void{
    this.cargarClientes();
  }

  private initSubscriptions(): void {

    this.clienteService.clienteCreado$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cargarClientes(this.textoBusqueda));
  }

  ///////////////////////////////////////
  ////////////DATA CLIENTE///////////////
  ///////////////////////////////////////

  cargarClientes(texto?: string): void{

    const textoNormalizado = texto?.trim() ?? '';

    this.ui.cargando = true;
    this.ui.error = '';

    const peticion = textoNormalizado 
      ? this.clienteService.buscarClientes(textoNormalizado)
      : this.clienteService.cargarCliente()

    peticion
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.ui.cargando = false;
        })
      )
      .subscribe({
        next: (clientes) => {
          this.clientes = clientes;

          this.clientesView = clientes.map(c =>
            ClienteViewMapper.toTable(c)
          );
        },
        error: (err: Error) => {
          console.error(err.message);

          this.clientes = [];
          this.clientesView = [];

          this.ui.error = textoNormalizado 
          ? 'No fue posible buscar los clientes. Intenta nuevamente'
          : 'No fue posible cargar los clientes. Intenta nuevamente'
        }
      })
  }

  ///////////////////////////////////////
  //////////////UI METODOS///////////////
  ///////////////////////////////////////

  public mostrarCrear():void{

    this.resetClienteSeleccionado();
    this.cerrarMenuContextual();
    this.abrirModal('crear');
  }

  public mostrarEditar(id: number, index: number): void{

    this.seleccionarCliente(id, index);
    this.cerrarMenuContextual();
    this.abrirModal('editar');
  }

  public mostrarInfo(id: number, index: number): void{

    this.seleccionarCliente(id, index);
    this.cerrarMenuContextual();
    this.abrirModal('info');
  }

  cerrarModal(): void{
    this.ui.modalVisible=false;
  }

  onModalCerrado(): void{
    this.ui.modalVisible = false;
    this.ui.modo='none';
    this.resetClienteSeleccionado();
  }

  private abrirModal(modo: 'crear' | 'editar' | 'info'): void{
    this.cerrarMenuContextual();
    this.ui.modo = modo;
    this.ui.modalVisible = true;
  }

  public buscar(texto:string):void{
    this.textoBusqueda = texto.trim();

    this.cerrarMenuContextual();

    this.cargarClientes(this.textoBusqueda);
  }

  ///////////////////////////////////////
  //////////ELIMINAR CLIENTE/////////////
  ///////////////////////////////////////

  public eliminarCliente(id:number){

    this.cerrarMenuContextual();
  
    Swal.fire({
      title: '¿Eliminar Cliente?',
      text: 'Esta accion no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar'
    }).then((result) => {

      if(!result.isConfirmed) return;

      this.clienteService.eliminarCliente(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({

          next: () => {
            this.clienteService.notificarClienteCreado();

            Swal.fire({
              title: 'Cliente eliminado',
              icon: 'success'
            });
          },
          error: (err: Error) => {
          
            Swal.fire({
              title: 'Error',
              text: err.message,
              icon: 'error'
            });
          }
        });
    });
  }

  ///////////////////////////////////////
  /////////////////HELPERS///////////////
  ///////////////////////////////////////

  resetClienteSeleccionado(): void {
    this.ui.clienteSeleccionado = {
      id: 0,
      index: -1
    };
  }

  private seleccionarCliente(id:number, index: number): void{
    this.ui.clienteSeleccionado = {
      id,
      index
    };
  }

  public cerrarMenuContextual(): void{
    this.contextMenu.cerrar();
  }

}
