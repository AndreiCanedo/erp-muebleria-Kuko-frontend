import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { StorageServiceService } from './storage-service.service';
import { ImagenCatalogoResponse } from '../models/interface-models/imagen-catalogo-response.interface';

@Injectable({
  providedIn: 'root',
})
export class CatalogoImageService {
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(StorageServiceService);

  private readonly baseUrl = environment.base_url;

  public subirImagen(archivo: File): Observable<ImagenCatalogoResponse> {

    const formData = new FormData();

    formData.append('archivo', archivo);

    const token = this.storageService.obtener<string>('token');

    const headers = token ? new HttpHeaders({Authorization: `Bearer ${token}`}) : new HttpHeaders();

    return this.http.post<ImagenCatalogoResponse>(`${this.baseUrl}/imagenes/catalogo`,formData,{headers});
  }

  public obtenerOriginal(nombreArchivo: string): string {

    return `${this.baseUrl}/imagenes/catalogo/original/${nombreArchivo}`;
  }

  public obtenerMiniatura(nombreArchivo: string): string {

    return `${this.baseUrl}/imagenes/catalogo/original/${nombreArchivo}`;
  }
}
