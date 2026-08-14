import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { LoginForm } from '../interface/login-form.interface';
import { SharedService } from './shared.service';
import { UsuarioDTO } from '../models/interface-models/usuarioDTO.interface';
import { UsuarioMapper } from '../mappers/usuario.,mapper';
import { CrearUsuarioRequest } from '../models/request/crear-usuario.request';
import { ActualizarUsuarioRequest } from '../models/request/actualizar-usuario.request';

const base_url = environment.base_url



@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private readonly sharedService = inject(SharedService);

    private readonly endpoint = '/usuarios';


    /************************************************************/
    /************************ LISTAR ****************************/
    /************************************************************/

    public cargarUsuarios(): Observable<Usuario[]> {

        return this.sharedService.get<UsuarioDTO>(this.endpoint)
            .pipe(
              map (dtos => UsuarioMapper.fromDTOList(dtos))
            );
    }


    /************************************************************/
    /*********************** BUSCAR ID ***************************/
    /************************************************************/

    public buscarUsuarioPorId(id: number): Observable<Usuario> {

        return this.sharedService.getById<UsuarioDTO>(`${this.endpoint}/${id}`)
            .pipe(
              map(dto => UsuarioMapper .fromDTO(dto))
            );
    }


    /************************************************************/
    /************************ CREAR *******************************/
    /************************************************************/

    public crearUsuario(request: CrearUsuarioRequest): Observable<Usuario> {

        return this.sharedService.post<UsuarioDTO>(this.endpoint, request)
            .pipe(
              map(dto => UsuarioMapper.fromDTO(dto))
            );
    }


    /************************************************************/
    /*********************** ACTUALIZAR **************************/
    /************************************************************/

    public actualizarUsuario(id: number, request: ActualizarUsuarioRequest): Observable<Usuario> {

        return this.sharedService.put<UsuarioDTO>(`${this.endpoint}/${id}`, request)
            .pipe(
                map(dto => UsuarioMapper.fromDTO(dto))
            );
    }


    /************************************************************/
    /********************** CAMBIAR ESTADO ***********************/
    /************************************************************/

    public cambiarEstado(id: number, activo: boolean): Observable<Usuario> {

        return this.sharedService.patch<UsuarioDTO>(`${this.endpoint}/${id}/estado?activo=${activo}`, {})
            .pipe(
                map(dto => UsuarioMapper.fromDTO(dto))
            );
    }
  
}
