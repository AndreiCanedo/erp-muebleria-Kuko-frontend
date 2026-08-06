import { Component, Input, OnChanges} from '@angular/core';

@Component({
    selector: 'app-tabla',
    templateUrl: './tabla.component.html',
    styleUrl: './tabla.component.css',
    standalone: false
})
export class TablaComponent<T extends Record<string, any>> implements OnChanges{
  
  @Input() columnas: (keyof T)[] = [];
  @Input() datos: T[] = [];
  
  public currentPage = 1;
  public itemsPerPages = 5;
  public totalPages = 0;
  public paginatedData: T[] = [];
  

  ngOnChanges(): void {
    this.currentPage = 1;
    this.calcularPaginacion();
  }
  
  private calcularPaginacion(): void{
    this.totalPages = Math.ceil(this.datos.length / this.itemsPerPages);
    this.updatePage();
  }

  private updatePage(): void{
    const start = (this.currentPage - 1) * this.itemsPerPages;
    const end = start + this.itemsPerPages;
    this.paginatedData = this.datos.slice(start,  end);
  }
  
  nextPage(): void{
    if(this.currentPage < this.totalPages){
      this.currentPage++;
      this.updatePage();
    }
  }
  
  prevPage(): void{
    if(this.currentPage > 1){
      this.currentPage--;
      this.updatePage();
    }
  }

  tracketByIndex(index: number): number {
    return index
  }

  tracketByColumn(_: number, col: keyof T): string{
    return String(col)
  }  

}
