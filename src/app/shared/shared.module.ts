import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './modal/modal.component';
import { StateComponent } from './state/state.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { ContextMenuDirective } from './directives/context-menu.directive';
import { ContextMenuTriggerDirective } from './directives/context-menu-trigger.directive';



@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ModalComponent,
    StateComponent,
    SearchBoxComponent,
    ContextMenuDirective,
    ContextMenuTriggerDirective
  ],
  exports:[
    SidebarComponent,
    HeaderComponent,
    ModalComponent,
    StateComponent,
    SearchBoxComponent,
    ContextMenuDirective,
    ContextMenuTriggerDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
