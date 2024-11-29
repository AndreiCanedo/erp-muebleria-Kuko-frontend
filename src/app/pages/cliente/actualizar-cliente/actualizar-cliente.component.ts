import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ClienteService } from '../../../services/cliente.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente } from '../../../models/cliente.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actualizar-cliente',
  templateUrl: './actualizar-cliente.component.html',
  styleUrl: './actualizar-cliente.component.css'
})
export class ActualizarClienteComponent implements OnInit, OnChanges{
  
  private clienteServices = inject(ClienteService)
  private fb = inject(FormBuilder)
  
  public clienteForm!:FormGroup;
  public mostrarRFC!:boolean;
  public actualizar:boolean = true;

  @Input() idActualizar!:string;
  @Output() cancelar = new EventEmitter<void>();
  
  ngOnInit(): void {
    this.resetForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['idActualizar'] && changes['idActualizar'].currentValue){
      console.log('Id a actualizar => ', this.idActualizar)
      this.buscarClienteById(changes['idActualizar'].currentValue)
    }
  }

  buscarClienteById(id:string){
    this.clienteServices.cargarClienteById(id)
      .subscribe( resp => {
        // console.log('cliente => ', resp )
        if(resp){
          this.clienteForm.patchValue(resp);
          this.mostrarRFC = this.clienteForm.get('rfc')?.value && this.clienteForm.get('rfc')?.value !== 'N/A';
          console.log('mostrar RFC => ',this.mostrarRFC)
        }
      })
  }

  actualizarCliente(){
    console.log('cliente datos =>', this.clienteForm.value)
    console.log('id cliente => ', this.idActualizar)
    this.clienteServices.actualizarCliente(this.clienteForm.value,this.idActualizar)
      .subscribe(resp => {
        Swal.fire('Cliente Actualizado correctamente','success');
        this.clienteServices.notificarClienteCreado();
        this.cerrarCaja();
      },error => console.error("error al actualizar Cliente", error))
  }

  cerrarCaja(){
    this.cancelar.emit();
  }

  resetForm(){
    this.clienteForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      correo: ['',[Validators.required,Validators.email]],
      telefono: ['',Validators.required],
      rfc: ''
    })
  }

}
