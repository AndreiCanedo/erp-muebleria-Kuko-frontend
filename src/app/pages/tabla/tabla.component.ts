import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrl: './tabla.component.css'
})
export class TablaComponent implements OnInit, OnChanges {
  
  @Input() columnas: string[] = [];
  @Input() datos: any[] = [];
  
  public currentPage = 1;
  public itemsPerPages = 5;
  public totalPages!:number;
  
  ngOnInit():void{
    this.calcularTotalDePaginas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['datos']){
      this.calcularTotalDePaginas();
    }
  }
  
  calcularTotalDePaginas(){
    console.log('cantidad de datos => ', this.datos.length)
    this.totalPages = Math.ceil(this.datos.length / this.itemsPerPages)
    console.log('paginas totales => ', this.totalPages)
  }

  getDataForCurrentPage(): any[]{
    console.log('datos => ',this.datos)
    const startIndex = (this.currentPage -1) * this.itemsPerPages;
    const endIndex = this.currentPage * this.itemsPerPages;
    return this.datos.slice(startIndex, endIndex);
  }

  prevPage(): void{
    if(this.currentPage > 1){
      this.currentPage--;
    }
  }
  
  nextPage(): void{
    if(this.currentPage < this.totalPages){
      this.currentPage++;
    }
  }

}
