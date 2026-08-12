import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { MuebleForm } from '../../../type/form/mueble-form.type';
import { DisenoMueble } from '../../../models/diseno-mueble.model';

@Component({
  selector: 'app-form-mueble',
  standalone: false,
  templateUrl: './form-mueble.component.html',
  styleUrl: './form-mueble.component.css',
})
export class FormMuebleComponent implements OnChanges{

  @Input( {required: true} ) public muebleForm!: MuebleForm;
  @Input() public actualizar = false;
  @Input() public guardando = false;
  @Input() public disenoActual: DisenoMueble | null = null

  @Output() public submitForm = new EventEmitter<void>();
  @Output() public cancelar = new EventEmitter<void>();

  public disenoSeleccionado: DisenoMueble | null = null;

  //Controla si el modal esta abierto o cerrado
  public mostrarSelectorDiseno = false;

  //controla si el componente interior debe seguir existiendo
  public renderSelectorDiseno = false;

  ngOnChanges(changes: SimpleChanges): void {

    if ( changes['disenoActual'] && this.disenoActual) {
      this.disenoSeleccionado = this.disenoActual;
    }
  }


  /************************************************************/
  /*********************** SELECTOR ***************************/
  /************************************************************/

  public abrirSelectorDiseno(): void {

    if (this.guardando) return;
    

    this.renderSelectorDiseno = true;
    this.mostrarSelectorDiseno = true;
  }

  //Solicita cierre  No elimina todavia el contenido mantiene abierto
  //PAra que modal ejecute ell modal close
  public cerrarSelectorDiseno(): void {

    this.mostrarSelectorDiseno = false;
  }

  //Este metodo se ejecuta cuando modal close ya se ejecuto
  //la animacion y emitio su evento de cerrado
  public onSelectorDisenoCerrado(): void {

    this.mostrarSelectorDiseno = false;
    this.renderSelectorDiseno = false;
  }


  public seleccionarDiseno(diseno: DisenoMueble): void {

    this.disenoSeleccionado = diseno;

    this.muebleForm.controls.disenoMuebleId.setValue(diseno.id);

    this.muebleForm.controls.disenoMuebleId.markAsDirty();

    this.cerrarSelectorDiseno();
  }


  public quitarDiseno(): void {

    if (this.guardando) return;
    

    this.disenoSeleccionado = null;

    this.muebleForm.controls.disenoMuebleId.setValue(0);

    this.muebleForm.controls.disenoMuebleId.markAsDirty();
  }


  /************************************************************/
  /*********************** FORMULARIO *************************/
  /************************************************************/

  public cerrarCaja(): void {

    if (this.guardando) return;
    

    this.cancelar.emit();
  }


  public onSubmit(): void {

    if (this.guardando) return;
    

    this.submitForm.emit();
  }


  public get f(): MuebleForm['controls'] {
    return this.muebleForm.controls;
  }


  public isInvalid(field: keyof MuebleForm['controls']): boolean {

    const control = this.muebleForm.controls[field];

    return control.touched && control.invalid;
  }

}
