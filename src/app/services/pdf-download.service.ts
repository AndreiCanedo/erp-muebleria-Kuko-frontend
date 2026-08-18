import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StorageServiceService } from './storage-service.service';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PdfDownloadService {

  private readonly http = inject(HttpClient);
  private readonly storageService = inject(StorageServiceService);

  private readonly baseUrl = environment.base_url;


  /************************************************************/
  /*********************** PRESUPUESTO ************************/
  /************************************************************/

  public obtenerPresupuestoPdf(ordenId: number): Observable<Blob> {

    return this.http.get(`${this.baseUrl}/presupuestos/${ordenId}/pdf`,
        {headers: this.headers, responseType: 'blob'});
  }


  /************************************************************/
  /******************** ORDEN DE COMPRA ***********************/
  /************************************************************/

  public obtenerOrdenCompraPdf(ordenId: number): Observable<Blob> {

    return this.http.get(`${this.baseUrl}/ordenes/${ordenId}/pdf`,
        {headers: this.headers, responseType: 'blob'});
  }


  /************************************************************/
  /*********************** DESCARGAR **************************/
  /************************************************************/

  public descargar(blob: Blob, nombreArchivo: string): void {

    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');

    enlace.href = url;
    enlace.download = nombreArchivo;

    document.body.appendChild(enlace);

    enlace.click();
    enlace.remove();

    URL.revokeObjectURL(url);
  }


  /************************************************************/
  /************************ TOKEN ******************************/
  /************************************************************/

  private get token(): string {

    return this.storageService.obtener<string>('token') ?? '';
  }


  private get headers(): HttpHeaders {

    const token = this.token;

    if (!token) {
      return new HttpHeaders();
    }

    return new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
  }
  
}
