import { Component, inject, OnInit } from '@angular/core';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit{
  private clienteService = inject(ClienteService)
  
  public clientes: any[] = [];

  public cajaTresPuntos:{[key: string]:boolean} = {};
  
  
  ngOnInit(): void {
    this.cargarClientes();
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
        });
      })
  }

  getTresPuntosClass(index: number):string{
    if((index + 1) % 4 == 0){
      return 'posicion-cambiada';
    }
    return '';
  }


  abrirCajaTresPuntos(key: string | number):void{
    this.cajaTresPuntos[key] = !this.cajaTresPuntos[key];
    for(const k in this.cajaTresPuntos){
      if(k != key.toString()){
        this.cajaTresPuntos[k] = false;
      }
    }
  }

  cerrarCaja(k :number){
    this.cajaTresPuntos[k] = false;
  }
}
