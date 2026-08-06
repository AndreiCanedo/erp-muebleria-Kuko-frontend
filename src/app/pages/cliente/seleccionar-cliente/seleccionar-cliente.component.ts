import { Component, DestroyRef, EventEmitter, inject, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ClienteService } from '../../../services/cliente.service';

import { Cliente } from '../../../models/cliente.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-seleccionar-cliente',
  standalone: false,
  templateUrl: './seleccionar-cliente.component.html',
  styleUrl: './seleccionar-cliente.component.css',
})
export class SeleccionarClienteComponent {

  private readonly clienteServices = inject(ClienteService);
  private readonly destroyRef = inject(DestroyRef);

  @Output() clienteSeleccionado = new EventEmitter<Cliente>;
  @Output() crearCliente = new EventEmitter<void>();


  public clientes: Cliente[] = [];

  public textoBusqueda = '';

  public ui = {
    cargando: false,
    error: ''
  }

  ngOnInit(): void{
    this.buscarClientes();
  }

  /*****************************************************/
  /********BUSCAR TODOS Y POR TEXTO CLIENTES************/
  /*****************************************************/

  //texto search y buscar cliente puede ir junto sin un if
  //porque searchbox ya usa debounce y al limpiar el campo emite una cadena vacia ('')
  public buscarClientes(texto?: string):void{
      this.ui.cargando = true;
      this.ui.error = '';

      const peticion = texto 
        ? this.clienteServices.buscarClientes(texto)
        : this.clienteServices.cargarCliente()

      peticion
        .pipe(takeUntilDestroyed(this.destroyRef),
          finalize(() => {
            this.ui.cargando = false;
          })
        )
        .subscribe({
          next: (clientes) => {

            this.clientes = clientes;
          },
          error: (err: Error) => {
            console.error(err.message);
            this.clientes = [];

            this.ui.error = 'No fue posible obtener clientes'
          }
        })
  }

  seleccionarCliente(cliente: Cliente): void{
    this.clienteSeleccionado.emit(cliente);
  }

  mostrarCrearCliente(): void{
    this.crearCliente.emit();
  } 

  buscar(texto: string): void{

    this.textoBusqueda = texto;
      
    this.buscarClientes(texto.trim());

  }

  reiniciarBusqueda(): void{

    this.textoBusqueda = '';

    this.buscarClientes();
  }



}
