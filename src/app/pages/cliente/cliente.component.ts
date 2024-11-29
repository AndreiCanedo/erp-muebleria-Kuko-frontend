import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { error } from 'console';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit, OnDestroy{
  private clienteService = inject(ClienteService)
  
  private subscription!: Subscription;
  public clientes: any[] = [];
  
  //caja CrearCliente y actualizar
  public idActualizar!:string;
  public cajaActualizarCliente:boolean = false;
  public cajaCrearCliente:boolean = false;
  public animacionCajaIndividual:string = '';
  
  //Variables caja tres puntos
  public cajaTresPuntos:{[key: string]:boolean} = {};
  public animacionTresPuntos:{[key: string]:string} = {};
  public bandera = 0;
  
  ngOnInit(): void {
    this.subscription = this.clienteService.clienteCreado$.subscribe(() => this.cargarClientes() )
    
    this.cargarClientes();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarClientes(){
    this.clienteService.cargarCliente()
      .subscribe(clientes => {
        this.clientes = clientes
        // console.log('Clientes array =>', clientes )
        //el guion bajo indica que el primer parametro del callback
        //no se usara
        this.clientes.forEach((_, index) => { 
          this.cajaTresPuntos[index] = false;
          this.animacionTresPuntos[index] = '';
        });
      })
  }


/*********************************************************************************/
/********************************LOGICA ELIMINAR**********************************/
/*********************************************************************************/  

eliminarCliente(key:number,id:number){
  this.cerrarCaja(key)
  console.log("id a eliminar => ", id)
  let eliminarId = id.toString();
  if(eliminarId != null){
    Swal.fire({
      title: "Estas seguro que deseas eliminar el Cliente?",
      showCancelButton: true,
      confirmButtonText: "Eliminar"
    }).then((result) => {
      if(result.isConfirmed){
        this.clienteService.eliminarCliente(eliminarId)
          .subscribe(() => {
            this.clienteService.notificarClienteCreado();
            Swal.fire("Cliente Eliminado", "", "success");
          }, error => {
            Swal.fire("Error al eliminar Cliente", error.message, "error")
          })
      }
    })
  }
  
  
}

  
/***********************************************************************************/
/************************LOGICA CREAR Y ACTUALIZAR**********************************/
/***********************************************************************************/

  actualizarClienteForm(key:number, id:number){
    this.idActualizar = id.toString();
    this.cerrarCaja(key);
    setTimeout(() => {
      this.cajaCrearCliente = true;
      this.cajaActualizarCliente = true;
      this.animacionCajaIndividual = 'mostrar'
    }, 300)
  }
  
  cerrarCajaForm(){
    this.animacionCajaIndividual = 'ocultar';
    setTimeout(() => {
      this.cajaCrearCliente = false;    
      this.animacionCajaIndividual = ''
    }, 300)
  }
  
  abrirCajaCrear(){
    setTimeout(() => {
      this.cajaCrearCliente = true;
      this.cajaActualizarCliente = false;
      this.animacionCajaIndividual = 'mostrar'
    }, 300)
  }
  
/*********************************************************************************/
/************************LOGICA CAJA TRES PUNTOS**********************************/
/*********************************************************************************/

  //verificar si  mi caja tres puntos es la de la orilla para moverla y no salga cortada
  getTresPuntosClass(index: number):string{
    if(this.bandera == 0){
      if((index + 1) % 4 == 0){
        this.bandera++;
        return 'posicion-cambiada';
      }
      return '';
    }else{
      if(((index + 1) - 4) % 5 == 0){
        this.bandera++;
        return 'posicion-cambiada';
      }
      return '';
    }
  }

  //Logica Abrir cajas y ver cual es cual
  abrirCajaTresPuntos(key: string | number):void{
    if (this.cajaTresPuntos[key]) { 
      this.cerrarCaja(key); 
    } else {  
      this.cerrarTodasLasCajasExcepto(key);
      setTimeout(() => {
        this.cajaTresPuntos[key] = true; 
        this.animacionTresPuntos[key] = 'mostrar'; 
      }, 100);
    }
  }
  
  //logica cerrar una caja espesifica
  cerrarCaja(k :number | string){
    this.animacionTresPuntos[k] = 'ocultar';
    setTimeout(() => {
      this.cajaTresPuntos[k] = false;
      this.animacionTresPuntos[k] = '';
    },300)
  }

  //Funcion que escucha todos los eventos click de mi pagina web para cerrar la caja tres puntos
  //event.target => elemento que fue clickeado
  //busca elementos cercas o el mismo elemento que coincidan con el selector del css asociado
  @HostListener('document:click',['$event'])
  onClick(event:MouseEvent):void{
    const clickInside = (event.target as HTMLElement).closest('.caja__icon--trespuntos') || (event.target as HTMLElement).closest('.trespuntos__caja');
    if(!clickInside){
      this.cerrarTodasLasCajas();
    }
  }

  //logica de cerrar todas las cajas
  cerrarTodasLasCajas(){
    for(const key in this.cajaTresPuntos){
      this.funcionAnimacion(key)
    }
  }
  //logica cerrar todas las cajas menos una
  cerrarTodasLasCajasExcepto(exKey:string | number): void{
    for(const key in this.cajaTresPuntos){
      if(key != exKey.toString()){
        this.funcionAnimacion(key)
      }
    }
  }

  funcionAnimacion(key:string |number): void{
    this.animacionTresPuntos[key] = 'ocultar';
    setTimeout(() => {
      this.cajaTresPuntos[key] = false;
      this.animacionTresPuntos[key] = '';
    },300)
  }
}
