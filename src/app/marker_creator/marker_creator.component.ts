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
          <div class="move-handle" (mousedown)="onMoveStart($event)">
            <i class="bi bi-arrows-move text-dark"></i>
          </div>
          <!-- Bottom resize handle -->
          <div class="resize-handle bottom-handle">
            <i (mousedown)="onResizeStart('bottom', $event)" class="bi bi-arrows-vertical text-dark"></i>
          </div>
          <!-- Right resize handle -->
          <div class="resize-handle right-handle">
            <i (mousedown)="onResizeStart('right', $event)" class="bi bi-arrows text-dark"></i>
          </div>
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

  resizeHandle: 'right' | 'bottom' | null = null;
  resizeStartX: number = 0;
  resizeStartY: number = 0;
  resizing: boolean = false;

  // Properties to capture initial marker dimensions and position
  resizeInitialWidth: number = 0;
  resizeInitialHeight: number = 0;
  resizeInitialLeft: number = 0;
  resizeInitialTop: number = 0;

  // Properties for marker movement
  isMoving: boolean = false;
  moveStartX: number = 0;
  moveStartY: number = 0;
  moveInitialLeft: number = 0;
  moveInitialTop: number = 0;

  onResizeStart(handle: 'right' | 'bottom', event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.editedMarker && !this.resizing) {
      this.resizeHandle = handle;
      this.resizeStartX = event.clientX;
      this.resizeStartY = event.clientY;

      // Capture initial dimensions and position
      this.resizeInitialWidth = this.editedMarker.width;
      this.resizeInitialHeight = this.editedMarker.height;
      this.resizeInitialLeft = this.editedMarker.left;
      this.resizeInitialTop = this.editedMarker.top;

      this.resizing = true;

      // Bind the move and up events to window for global handling
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

      if (this.resizeHandle === 'right') {
        this.editedMarker.width = this.resizeInitialWidth + deltaX;
      } else if (this.resizeHandle === 'bottom') {
        this.editedMarker.height = this.resizeInitialHeight + deltaY;
      }
    }
  };

  onResizeEnd = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    if (this.editedMarker && this.resizeHandle) {
      this.resizing = false;
      this.resizeHandle = null;

      // Update initial dimensions and position after resizing
      this.resizeInitialWidth = this.editedMarker.width;
      this.resizeInitialHeight = this.editedMarker.height;
      this.resizeInitialLeft = this.editedMarker.left;
      this.resizeInitialTop = this.editedMarker.top;

      // Unbind move and up events from window
      window.removeEventListener('mousemove', this.onResizeMove);
      window.removeEventListener('mouseup', this.onResizeEnd);

      // Emit the final resized marker state
      this.OnResizeMarker.emit(this.editedMarker);
    }
  };

  onMoveStart(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.editedMarker) {
      this.isMoving = true;
      this.moveStartX = event.clientX;
      this.moveStartY = event.clientY;
      this.moveInitialLeft = this.editedMarker.left;
      this.moveInitialTop = this.editedMarker.top;

      // Bind move and up events to window for global handling
      window.addEventListener('mousemove', this.onMove);
      window.addEventListener('mouseup', this.onMoveEnd);
    }
  }

  onMove = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    if (this.isMoving && this.editedMarker) {
      const deltaX = event.clientX - this.moveStartX;
      const deltaY = event.clientY - this.moveStartY;

      this.editedMarker.left = this.moveInitialLeft + deltaX;
      this.editedMarker.top = this.moveInitialTop + deltaY;

      // Emit the current state if needed
      // this.OnResizeMarker.emit(this.editedMarker);
    }
  };

  onMoveEnd = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    if (this.isMoving && this.editedMarker) {
      this.isMoving = false;

      // Update initial position after moving
      this.resizeInitialLeft = this.editedMarker.left;
      this.resizeInitialTop = this.editedMarker.top;

      // Unbind move and up events from window
      window.removeEventListener('mousemove', this.onMove);
      window.removeEventListener('mouseup', this.onMoveEnd);

      // Emit the final marker state after movement
      this.OnResizeMarker.emit(this.editedMarker);
    }
  };
}


