import { inject, Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { map, Observable } from 'rxjs';
import { DisenoMuebleDTO } from '../models/interface-models/diseno-muebleDTO.interface';
import { DisenoMuebleMapper } from '../mappers/diseno-mueble.mapper';
import { DisenoMueble } from '../models/diseno-mueble.model';
import { CategoriaMueble } from '../models/categoria-mueble.enum';
import { CrearDisenoMuebleRequest } from '../models/request/crear-diseno-mueble.request';
import { ActualizarDisenoMuebleRequest } from '../models/request/actualizar-diseno-mueble.request';

@Injectable({
  providedIn: 'root',
})
export class DisenoMuebleService {
  
  private readonly sharedService = inject(SharedService);
  private readonly endpoint = '/disenos-muebles';

  public obtenerTodos(): Observable<DisenoMueble[]> {


    return this.sharedService.get<DisenoMuebleDTO>(this.endpoint)
      .pipe(map(dtos =>DisenoMuebleMapper.fromDTOList(dtos)));
  }

  public obtenerActivos(): Observable<DisenoMueble[]> {

    return this.sharedService.get<DisenoMuebleDTO>(`${this.endpoint}/activos`)
      .pipe(map(dtos => DisenoMuebleMapper.fromDTOList(dtos)));
  }

  public obtenerPorId(id: number): Observable<DisenoMueble> {

    return this.sharedService.getById<DisenoMuebleDTO>(`${this.endpoint}/${id}`)
      .pipe(map(dto => DisenoMuebleMapper.fromDTO(dto)));
  }

  public obtenerPorCategoria(categoria: CategoriaMueble): Observable<DisenoMueble[]> {

    return this.sharedService.get<DisenoMuebleDTO>(`${this.endpoint}/categoria/${categoria}`)
      .pipe(map(dtos => DisenoMuebleMapper.fromDTOList(dtos)));
  }

  public buscar(texto: string): Observable<DisenoMueble[]> {

    return this.sharedService.get<DisenoMuebleDTO>(`${this.endpoint}/buscar`,{texto})
      .pipe(map(dtos => DisenoMuebleMapper.fromDTOList(dtos)));
  }

  public crear(request: CrearDisenoMuebleRequest): Observable<DisenoMueble> {

    return this.sharedService.post<DisenoMuebleDTO>(this.endpoint, request)
      .pipe(map(dto => DisenoMuebleMapper.fromDTO(dto)));
  }

  public actualizar(id: number, request: ActualizarDisenoMuebleRequest): Observable<DisenoMueble> {

    return this.sharedService.put<DisenoMuebleDTO>(`${this.endpoint}/${id}`, request)
      .pipe(map(dto => DisenoMuebleMapper.fromDTO(dto)));
  }

  public cambiarEstado(id: number, activo: boolean): Observable<DisenoMueble> {

    return this.sharedService.patch<DisenoMuebleDTO>(`${this.endpoint}/${id}/estado?activo=${activo}`,{})
      .pipe(map(dto => DisenoMuebleMapper.fromDTO(dto)));
  }

}
