import { inject, Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { map, Observable } from 'rxjs';
import { DashboardView } from '../models/interface-dashboard/dashboard-view.interface';
import { DashboardDTO } from '../models/interface-dashboard/dashboard-dto.interface';
import { DashboardMapper } from '../mappers/dashboard.mapper';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private readonly sharedService = inject(SharedService);

  private readonly endpoint = '/dashboard';

  public obtenerDashboard(inicio: Date, fin: Date): Observable<DashboardView>{

    const params = new URLSearchParams({
      inicio: this.formatearFecha(inicio),
      fin: this.formatearFecha(fin)
    });

    return this.sharedService.getObject<DashboardDTO>(`${this.endpoint}?${params.toString()}`)
      .pipe(map(dto => DashboardMapper.fromDTO(dto)));

  }

  private formatearFecha(fecha: Date): string {

    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2,'0');
    const day = String(fecha.getDate()).padStart(2,'0');


    return `${year}-${month}-${day}`;
  }
}
