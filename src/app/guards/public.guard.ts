import { inject, PLATFORM_ID } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { AuthService } from "../services/auth.service";
import { isPlatformBrowser } from "@angular/common";
import { StorageServiceService } from "../services/storage-service.service";
import { Role } from "../models/role.enum";


export const publicGuard: CanActivateFn = () => {

    const platformId = inject(PLATFORM_ID);

    if(!isPlatformBrowser(platformId)) return true;

    const authService = inject(AuthService);
    const storageService = inject(StorageServiceService);
    const router = inject(Router);

    if (!authService.estaAutenticado()) {
        return true;
    }

    const role = storageService.obtener<Role>('role');

    switch (role) {

        case Role.ADMIN:

            return router.createUrlTree(['/dashboard']);


        case Role.VENDEDOR:

        case Role.USER:

            return router.createUrlTree(['/catalogo']);


        default:

        return true;
    }
};