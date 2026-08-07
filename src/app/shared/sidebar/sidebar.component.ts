import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    standalone: false
})
export class SidebarComponent {
    
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    public logout(): void {
        this.authService.logout();
        this.router.navigateByUrl('/login');
    }

}
