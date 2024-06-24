import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-marker-creator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="markers-container">
      <div *ngFor="let marker of markers" class="marker"
           [style.left.px]="marker.left" [style.top.px]="marker.top"
           [style.width.px]="marker.width" [style.height.px]="marker.height"
           [style.backgroundColor]="marker.selectionColor">

        <div *ngIf="editedMarker && editedMarker.number === marker.number" class="resize-handles">
          <!-- Top resize handle -->
          <div class="resize-handle top-handle" (mousedown)="onResizeStart('top', $event)"></div>

          <!-- Bottom resize handle -->
          <div class="resize-handle bottom-handle" (mousedown)="onResizeStart('bottom', $event)"></div>

          <!-- Left resize handle -->
          <div class="resize-handle left-handle" (mousedown)="onResizeStart('left', $event)"></div>

          <!-- Right resize handle -->
          <div class="resize-handle right-handle" (mousedown)="onResizeStart('right', $event)"></div>
        </div>

        <p class="marker-number">{{ marker.number }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./marker_creator.component.css'],
})
export class MarkerCreatorComponent {
  @Input() markers: any[] = [];
  @Input() editedMarker: any | null = null;
  @Output() OnResizeMarker = new EventEmitter<any>();

  resizeHandle: 'left' | 'right' | 'top' | 'bottom' | null = null;
  resizeStartX: number = 0;
  resizeStartY: number = 0;
  resizing: boolean = false;

  onResizeStart(handle: 'left' | 'right' | 'top' | 'bottom', event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.editedMarker && !this.resizing) {
      this.resizeHandle = handle;
      this.resizeStartX = event.clientX;
      this.resizeStartY = event.clientY;

      this.resizing = true;

      window.addEventListener('mousemove', this.onResizeMove);
      window.addEventListener('mouseup', this.onResizeEnd);
    }
  }

  onResizeMove = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    if (this.editedMarker && this.resizing && this.resizeHandle) {
      const deltaX = event.clientX - this.resizeStartX;
      const deltaY = event.clientY - this.resizeStartY;

      if (this.resizeHandle === 'left') {
        this.editedMarker.width -= deltaX;
        this.editedMarker.left += deltaX;
      } else if (this.resizeHandle === 'right') {
        this.editedMarker.width += deltaX;
      } else if (this.resizeHandle === 'top') {
        this.editedMarker.height -= deltaY;
        this.editedMarker.top += deltaY;
      } else if (this.resizeHandle === 'bottom') {
        this.editedMarker.height += deltaY;
      }

      this.resizeStartX = event.clientX;
      this.resizeStartY = event.clientY;

      // Emit the current state
      //this.OnResizeMarker.emit(this.editedMarker);
    }
  };

  onResizeEnd = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    if (this.editedMarker && this.resizeHandle) {
      this.resizing = false;
      this.resizeHandle = null;

      window.removeEventListener('mousemove', this.onResizeMove);
      window.removeEventListener('mouseup', this.onResizeEnd);

      // Emit the final resized marker state
      this.OnResizeMarker.emit(this.editedMarker);
    }
  };
}
