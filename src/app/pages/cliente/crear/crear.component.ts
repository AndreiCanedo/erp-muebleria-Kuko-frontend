import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../../services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrl: './crear.component.css'
})
export class CrearComponent implements OnInit{

  private clienteServices = inject(ClienteService)
  private fb = inject(FormBuilder)
  
  public clienteForm!:FormGroup;
  public actualizar:boolean = false;

  @Output() cancelar = new EventEmitter<void>();
  
  ngOnInit(): void {
    this.resetForm();
  }

  guardarCliente(){
    if(this.clienteForm.valid){
      if(!this.clienteForm.get("rfc")?.value){
        this.clienteForm.get("rfc")?.setValue("N/A");        
      }
      let clienteN = this.clienteForm.value;
      this.clienteServices.crearCliente(clienteN)
        .subscribe(resp => {
          Swal.fire('Cliente Creado correctamente','success');
          this.clienteServices.notificarClienteCreado();
          this.cerrarCaja();
        },error => console.error("error al crear el cliente", error))
    }
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
