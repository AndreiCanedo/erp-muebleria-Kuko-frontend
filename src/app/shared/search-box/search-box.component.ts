import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-box',
  standalone: false,
  templateUrl: './search-box.component.html',
  styleUrl: './search-box.component.css',
})
export class SearchBoxComponent implements OnChanges{

  private  readonly destroyRef = inject(DestroyRef);

  @Input() placeholder = 'Buscar...';
  @Input() disabled = false;
  @Input() debounce = 300;
  @Input() value = '';

  @Output() search = new EventEmitter<string>();

  public searchControl = new FormControl('', {
    nonNullable: true
  });

  ngOnInit(): void {

    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.debounce),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        this.search.emit(value.trim());
      });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if(changes['disabled']){

      if(this.disabled) {
        this.searchControl.disable({
          emitEvent: false
        });
      } else {
        this.searchControl.enable({
          emitEvent: false
        });
      }
    }

    if(changes['value']){
      const nuevoValor = this.value ?? '';

      if(this.searchControl.value !== nuevoValor){
        this.searchControl.setValue(nuevoValor,{
          emitEvent: false
        });
      }
    }


  }

  limpiar(): void {

    if(!this.searchControl.value){
      return;
    }

    this.searchControl.setValue('');

  }

}
