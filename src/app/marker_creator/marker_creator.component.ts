import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-marker-creator',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `<div class="markers-container">
  <div *ngFor="let marker of markers" class="marker" [style.left.px]="marker.x" [style.top.px]="marker.y"
       [style.width.px]="marker.width" [style.height.px]="marker.height"
       [style.backgroundColor]="marker.selectionColor">
       @if (editedMarker && editedMarker.number === marker.number) {
       <div class="resize-handle left-handle" (mousedown)="onResizeStart('left', $event)"
            (mousemove)="onResize($event)" (mouseup)="onResizeEnd($event)">
            <i class="bi bi-arrow-left-circle-fill btn p-0"></i>
       </div>
       <div class="resize-handle right-handle" (mousedown)="onResizeStart('right', $event)"
            (mousemove)="onResize($event)" (mouseup)="onResizeEnd($event)">
            <i class="bi bi-arrow-right-circle-fill btn p-0"></i>
       </div>
       }

       <p class="marker-number">{{ marker.number }}</p>
  </div>
</div>`,
  styleUrl: './marker_creator.component.css',
})
export class MarkerCreatorComponent {
  @Input({ 'required': true }) markers: any[] = [];
  @Input({ 'required': true }) editedMarker: { x: number; y: number; width: number; height: number; selectionColor: string; number: number; } | null = null;
  resizeHandle: 'left' | 'right' | null = null;
  resizeStartX: number = 0;

  onResizeStart(handle: 'left' | 'right', event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.editedMarker) {
      this.resizeHandle = handle;
      this.resizeStartX = event.clientX;
    }
  }

  onResize(event: MouseEvent): void {
    event.preventDefault();

    if (this.editedMarker && this.resizeHandle) {
      const deltaX = event.clientX - this.resizeStartX;
      if (this.resizeHandle === 'left') {
        this.editedMarker.width -= deltaX;
        //this.editedMarker.x += deltaX;
      } else if (this.resizeHandle === 'right') {
        this.editedMarker.width += deltaX;
      }
      this.resizeStartX = event.clientX;
    }
  }

  onResizeEnd(event: MouseEvent): void {
    event.preventDefault();

    if (this.editedMarker && this.resizeHandle) {
      this.resizeHandle = null;
    }
  }
 }
