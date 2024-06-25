import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-marker-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<div class="container" *ngIf="markers">
  <div class="row">
       <table class="table">
            <thead>
                 <tr>
                      <th scope="col">#</th>
                      <th scope="col">Parametres</th>
                      <th scope="col">Modifier</th>
                      <th scope="col">Suprimer</th>
                 </tr>
            </thead>
            <tbody>
                 <tr *ngFor="let marker of markers">
                      <th scope="row">{{marker.number}}</th>
                      <td>start point : {{ marker.startPoint.origin | json}} <br> start diriction : {{marker.startPoint.position}}  <br> zone : {{marker.origin | json}}</td>
                      <td><button type="button" class="btn btn-primary"
                                (click)="editMarker(marker.number)">
                                <i class="bi bi-arrows-move"></i>
                              </button></td>
                      <td><button type="button" class="btn btn-danger"
                                (click)="deleteMarker(marker.number)">
                                <i class="bi bi-trash"></i></button></td>
                 </tr>
            </tbody>
       </table>
  </div>
</div>`,
  styleUrl: './marker_list.component.css'
})
export class MarkerListComponent {

  @Input({ required: true }) markers: any[] = [];
  @Output() OnEditMarker = new EventEmitter<any>();
  @Output() OnDeleteMarker = new EventEmitter<any[]>();

  deleteMarker(number: number): void {
    this.markers = this.markers.filter(m => m.number !== number);
    this.OnDeleteMarker.emit(this.markers);
    this.OnEditMarker.emit(null);
  }
  editMarker(number: number): void {
    const marker = this.markers.find(marker => marker.number === number);
    if (marker) {
      this.OnEditMarker.emit(marker);
    }
  }

}
