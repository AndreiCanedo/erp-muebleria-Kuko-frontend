import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

export const authGuard: CanActivateFn = () => {

    const platformId = inject(PLATFORM_ID);
    const authService = inject(AuthService);
    const router = inject(Router);

    if(!isPlatformBrowser(platformId)){
        return router.createUrlTree(['/login']);
    } 



    if (authService.estaAutenticado()) return true;

    return router.createUrlTree(['/login']);
};