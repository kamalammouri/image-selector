import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-marker-list',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<div class="container" *ngIf="markersView">
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
                 <tr *ngFor="let marker of markersView">
                      <th scope="row">{{marker.number}}</th>
                      <td>start point : {{marker.startPoint | json}} | position : {{marker.zone | json}}</td>
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
export class MarkerListComponent implements OnInit {

  @Input({ required: true }) markers: any[] = [];
  @Output() OnEditMarker = new EventEmitter<any>();
  @Output() OnDeleteMarker = new EventEmitter<any[]>();

  markersView: any[] = [];

  ngOnInit(): void {
    this.markersView = this.markers.map((marker) => {
      return { number: marker.number, startPoint: { adress: marker.startPoint.position, ...marker.startPoint.origin, }, zone: marker.origin }
    })
  }

  deleteMarker(number: number): void {
    this.markers = this.markers.filter(m => m.number !== number);
    this.OnDeleteMarker.emit(this.markers);
  }
  editMarker(number: number): void {
    const marker = this.markers.find(marker => marker.number === number);
    if (marker) {
      this.OnEditMarker.emit(marker);
    }
  }

}
