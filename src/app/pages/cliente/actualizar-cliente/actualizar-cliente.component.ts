import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';

import { ClienteService } from '../../../services/cliente.service';

import { Cliente } from '../../../models/cliente.model';

import { ClienteForm } from '../../../type/form/cliente-form.type';

@Component({
    selector: 'app-actualizar-cliente',
    templateUrl: './actualizar-cliente.component.html',
    styleUrl: './actualizar-cliente.component.css',
    standalone: false
})
export class ActualizarClienteComponent implements OnInit, OnChanges{
  
  private clienteServices = inject(ClienteService)
  private fb = inject(NonNullableFormBuilder)
  private destroyRef = inject(DestroyRef)
  
  public clienteForm!:ClienteForm;
  public actualizar:boolean = true;

  @Input() idActualizar!:number;
  @Output() cancelar = new EventEmitter<void>();

  ///////////////////////////////////////
  //////////////UI STATE/////////////////
  ///////////////////////////////////////

  public ui = {
    actualizado: true,
    mostrarRFC: false,
    enviado: false
  }
  
  
  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const id = changes['idActualizar']?.currentValue;

    if(!id) return;

    this.cargarCliente(id);
  }
  
  ///////////////////////////////////////
  //////////////////INIT/////////////////
  ///////////////////////////////////////

  private initForm():void{
    this.clienteForm = this.fb.group({
      id: 0,
      nombre: ['', [Validators.required, this.noWhitespaceValidator]],
      direccion: ['', [Validators.required, this.noWhitespaceValidator]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, this.noWhitespaceValidator]],
      rfc: ['']
    });
  }

  ///////////////////////////////////////
  ////////////CARGAR CLIENTES////////////
  ///////////////////////////////////////

  private cargarCliente(id: number): void{

    this.clienteServices.cargarClienteById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next:(cliente) => this.pathForm(cliente),
        error: (error:Error) => this.handleError(error)
      });

  }

  ///////////////////////////////////////
  ///////SUMIT ACTUALIZAR CLIENTE////////
  ///////////////////////////////////////

  actualizarCliente():void {

    if(this.clienteForm.invalid){

      this.clienteForm.markAllAsTouched();
      return

    }

    this.ui.enviado = true;

    const cliente = this.buildCliente();

    this.clienteServices.actualizarCliente(cliente, this.idActualizar)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.handleSucces(),
        error: (error: Error) => this.handleError(error)
      });
  }

  ///////////////////////////////////////
  //////////////BUILDERS/////////////////
  ///////////////////////////////////////

  private buildCliente(): Cliente{

    const form = this.clienteForm.getRawValue();

    const rfc = this.ui.mostrarRFC ? form.rfc.trim() : '';

    return new Cliente (
      form.id,
      form.nombre.trim(),
      form.direccion.trim(),
      form.telefono.trim(),
      form.correo.trim(),
      rfc === '' ? null : rfc
    );

  }

  private pathForm(cliente: Cliente):void{

    this.clienteForm.patchValue({
      id: cliente.id,
      nombre: cliente.nombre,
      direccion: cliente.direccion,
      correo: cliente.correo,
      telefono: cliente.telefono,
      rfc: cliente.rfc ?? ''
    });

    this.ui.mostrarRFC = cliente.rfc !== null && cliente.rfc !== '';
  }


  ///////////////////////////////////////
  ///////////////HANDLERS////////////////
  ///////////////////////////////////////

  private handleSucces():void{

    this.ui.enviado = false;
  
    this.clienteServices.notificarClienteCreado();

    Swal.fire({
      title: 'Cliente Actualizado Correctamente',
      icon: 'success'
    });

    this.resetForm();

    this.cerrarCaja();
  }

  private handleError(error: Error):void{
    this.ui.enviado = false;

    Swal.fire({
      title: 'Error al crear cliente',
      text: error.message,
      icon: 'error'
    });
  }

  ///////////////////////////////////////
  ///////////////HELPERS/////////////////
  ///////////////////////////////////////

  //Validacion Custom
  private noWhitespaceValidator(control: AbstractControl){
    return (control.value || ``).trim().length === 0
      ? { whitespace: true }
      : null
  }

  cerrarCaja(){
    this.cancelar.emit();
  }

  resetForm():void{
    this.clienteForm.reset({
      id: 0,
      nombre: '',
      direccion: '',
      correo: '',
      telefono: '',
      rfc: ''
    });
    
    this.ui.mostrarRFC = false;
  }

  toggleRFC(value: boolean): void {

    this.ui.mostrarRFC = value;

    this.clienteForm.controls.rfc.setValue('');

  }

}
