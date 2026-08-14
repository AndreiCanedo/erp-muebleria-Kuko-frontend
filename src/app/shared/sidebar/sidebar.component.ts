import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { StorageServiceService } from '../../services/storage-service.service';
import { Role } from '../../models/role.enum';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    standalone: false
})
export class SidebarComponent {
    
    private readonly authService = inject(AuthService);
    private readonly storageService = inject(StorageServiceService);
    private readonly router = inject(Router);

    @Output() public navegar = new EventEmitter<void>();

    /******************************************************/
    /********************** LOGOUT ************************/
    /******************************************************/

    public logout(): void {
        this.navegar.emit()
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }

    /******************************************************/
    /********************** ROLES *************************/
    /******************************************************/

    public get role(): Role | null {

        return this.storageService.obtener<Role>('role');
    }


    public get esAdmin(): boolean {

        return this.role === Role.ADMIN;
    }


    public get esVendedor(): boolean {

        return this.role === Role.VENDEDOR;
    }


    public get esUser(): boolean {

        return this.role === Role.USER;
    }

    /******************************************************/
    /*********************** UI ***************************/
    /******************************************************/

    public cerrarMenu(): void {

        this.navegar.emit();
    }

}
