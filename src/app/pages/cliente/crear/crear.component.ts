import { Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';

import { ClienteService } from '../../../services/cliente.service';

import { Cliente } from '../../../models/cliente.model';

import { ClienteForm } from '../../../type/form/cliente-form.type';

@Component({
    selector: 'app-crear',
    templateUrl: './crear.component.html',
    styleUrl: './crear.component.css',
    standalone: false
})
export class CrearComponent implements OnInit{

  private fb = inject(NonNullableFormBuilder)
  private clienteServices = inject(ClienteService)
  private destroyRef = inject(DestroyRef)
  
  @Output() cancelar = new EventEmitter<void>();
  @Output() clienteCreado = new EventEmitter<Cliente>();

  ///////////////////////////////////////
  ///////////////FORM////////////////////
  ///////////////////////////////////////

  public clienteForm!:ClienteForm;
  public actualizar:boolean = false;

  ///////////////////////////////////////
  //////////////UI STATE////////////////
  ///////////////////////////////////////

  public ui = {
    actualizado: false,
    mostrarRFC: false,
    enviado: false
  }

  ngOnInit(): void {
    this.initForm();
  }

  ///////////////////////////////////////
  ///////////////INITS//////////////////
  ///////////////////////////////////////

  // Inicializacion de Formulario Tipado
  private initForm():void{
    this.clienteForm = this.fb.group({
      id: 0,
      nombre: ['', [Validators.required, this.noWhitespaceValidator]],
      direccion: ['', [Validators.required, this.noWhitespaceValidator]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, this.noWhitespaceValidator]],
      rfc: ['N/A']
    });
  }


  ///////////////////////////////////////
  ///////SUBMIT GUARDAR CLIENTE//////////
  ///////////////////////////////////////

  guardarCliente(): void{

    console.log('submit ejecutado');

    if(this.clienteForm.invalid){

      console.log(this.clienteForm.errors);
      console.log(this.clienteForm.value);
      
      this.clienteForm.markAllAsTouched();
      return;
    }

    console.log('form valido');

    this.ui.enviado = true;

    const cliente = this.buildCliente();

      this.clienteServices.crearCliente(cliente)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (cliente) => this.handleSucces(cliente),
          error: (error:Error) => this.handleError(error)
        });
  }

  ///////////////////////////////////////
  /////////////BUILDERS//////////////////
  ///////////////////////////////////////

  private buildCliente(): Cliente{
    const form = this.clienteForm.getRawValue();

    const rfc = this.ui.mostrarRFC ? form.rfc.trim() : '';

    return new Cliente(
      0,
      form.nombre.trim(),
      form.direccion.trim(),
      form.telefono.trim(),
      form.correo.trim(),
      rfc === '' ? null : rfc
    );
  }

  ///////////////////////////////////////
  //////////////HANDLERS/////////////////
  ///////////////////////////////////////

  private handleSucces(cliente: Cliente):void{

    this.ui.enviado = false;

    //Notificacion de Cliente
    this.clienteServices.notificarClienteCreado();

    //Emitir cliente creado
    this.clienteCreado.emit(cliente);

    Swal.fire({
      title: 'Cliente Creado correctamente',
      icon: 'success'
    });

    this.resetForm();

    //Cerrar Form
    this.cerrarCaja();
  }

  private handleError(error: Error): void{
    this.ui.enviado = false;

    Swal.fire({
      title: 'Error al crear cliente',
      text: error.message,
      icon: 'error'
    });
  }

  ///////////////////////////////////////
  ////////////////HELPER/////////////////
  ///////////////////////////////////////


  //Validacion Custom
  private noWhitespaceValidator(control: AbstractControl){
    return (control.value || ``).trim().length === 0
      ? { whitespace: true }
      : null
  }


  //Cerrar Form
  cerrarCaja(){
    this.cancelar.emit();
  }

  //Reiniciar Form
  resetForm(): void{
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

  toggleRFC(value: boolean): void{

    this.ui.mostrarRFC = value;

    const rfcControl = this.clienteForm.controls.rfc;

    rfcControl.setValue('');
  }

}
