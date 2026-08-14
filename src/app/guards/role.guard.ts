import { inject } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router';

import { StorageServiceService } from '../services/storage-service.service';
import { Role } from '../models/role.enum';

export const roleGuard: CanActivateFn = ( route: ActivatedRouteSnapshot) => {

    const storageService = inject(StorageServiceService);
    const router = inject(Router);
    const role = storageService.obtener<Role>('role');
    const rolesPermitidos = route.data['roles'] as Role[] | undefined;

    if (!role) {

        router.createUrlTree(['/login']);

        return false;
    }


    if (rolesPermitidos?.includes(role)) {

        return true;
    }


    //Si esta utenticado eh intenta ingresar a una pagina no permitida
    //lo regresamos a la pagina inicial
    switch (role) {

        case Role.ADMIN:

            return router.createUrlTree(['/dashboard']);

            break;

        case Role.VENDEDOR:

        case Role.USER:

            return router.createUrlTree(['/catalogo']);

            break;

        default:

            return router.createUrlTree(['/login']);
    }

    return false;
};