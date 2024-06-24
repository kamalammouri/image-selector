import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-marker-creator',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
    <div class="markers-container">
      <div *ngFor="let marker of markers" class="marker" [style.left.px]="marker.left" [style.top.px]="marker.top"
           [style.width.px]="marker.width" [style.height.px]="marker.height"
           [style.backgroundColor]="marker.selectionColor">
           @if (editedMarker && editedMarker.number === marker.number) {
           <!-- Top resize handle -->
           <div class="resize-handle top-handle" >
                <i (mousedown)="onResizeStart('top', $event)"
                (mousemove)="onResize($event)" (mouseup)="onResizeEnd($event)" class="bi bi-arrow-up-circle-fill btn p-0"></i>
           </div>

           <!-- Bottom resize handle -->
           <div class="resize-handle bottom-handle">
                <i (mousedown)="onResizeStart('bottom', $event)"
                (mousemove)="onResize($event)" (mouseup)="onResizeEnd($event)" class="bi bi-arrow-down-circle-fill btn p-0"></i>
           </div>

           <!-- Left resize handle -->
           <div class="resize-handle left-handle" >
                <i (mousedown)="onResizeStart('left', $event)"
                (mousemove)="onResize($event)" (mouseup)="onResizeEnd($event)" class="bi bi-arrow-left-circle-fill btn p-0"></i>
           </div>

           <!-- Right resize handle -->
           <div class="resize-handle right-handle" >
                <i (mousedown)="onResizeStart('right', $event)"
                (mousemove)="onResize($event)" (mouseup)="onResizeEnd($event)" class="bi bi-arrow-right-circle-fill btn p-0"></i>
           </div>
           }

           <p class="marker-number">{{ marker.number }}</p>
      </div>
    </div>
  `,
  styleUrl: './marker_creator.component.css',
})

export class MarkerCreatorComponent {
  @Input() markers: any[] = [];
  @Input() editedMarker: any | null = null;
  @Output() OnResizeMarker = new EventEmitter<any>();
  @Output() OnMoveMarker = new EventEmitter<any>();

  resizeHandle: 'left' | 'right' | 'top' | 'bottom' | null = null;
  resizeStartX: number = 0;
  resizeStartY: number = 0;
  resizing: boolean = false;
  dragging: boolean = false;
  dragStartX: number = 0;
  dragStartY: number = 0;

  onResizeStart(handle: 'left' | 'right' | 'top' | 'bottom', event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.editedMarker && !this.resizing) {
      this.resizeHandle = handle;
      this.resizeStartX = event.clientX;
      this.resizeStartY = event.clientY;
      this.resizing = true;
      this.resizeLoop();
    }
  }

  onResize(event: MouseEvent): void {
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
      this.updateStartPoint();
      this.OnResizeMarker.emit(this.editedMarker);
    }
  }

  onResizeEnd(event: MouseEvent): void {
    event.preventDefault();
    if (this.editedMarker && this.resizeHandle) {
      this.resizing = false;
      this.resizeHandle = null;
      this.OnResizeMarker.emit(this.editedMarker);
    }
  }

  private resizeLoop(): void {
    requestAnimationFrame(() => {
      if (this.resizing) {
        this.resizeLoop();
        this.OnResizeMarker.emit(this.editedMarker);
      }
    });
  }

  onDragStart(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.editedMarker && !this.resizing) {
      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      this.dragging = true;
      this.dragLoop();
    }
  }

  onDrag(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.editedMarker && this.dragging) {
      const deltaX = event.clientX - this.dragStartX;
      const deltaY = event.clientY - this.dragStartY;

      this.editedMarker.left += deltaX;
      this.editedMarker.top += deltaY;

      this.dragStartX = event.clientX;
      this.dragStartY = event.clientY;
      this.updateStartPoint();
      this.OnMoveMarker.emit(this.editedMarker);
    }
  }

  onDragEnd(event: MouseEvent): void {
    event.preventDefault();

    if (this.editedMarker && this.dragging) {
      this.dragging = false;
      this.OnMoveMarker.emit(this.editedMarker);
    }
  }

  private dragLoop(): void {
    requestAnimationFrame(() => {
      if (this.dragging) {
        this.dragLoop();
        this.OnMoveMarker.emit(this.editedMarker);
      }
    });
  }

  private updateStartPoint(): void {
    if (this.editedMarker) {
      if (this.editedMarker.position === 'top-left') {
        this.editedMarker.startPoint.x = this.editedMarker.left;
        this.editedMarker.startPoint.y = this.editedMarker.top;
      } else if (this.editedMarker.position === 'bottom-left') {
        this.editedMarker.startPoint.x = this.editedMarker.left;
        this.editedMarker.startPoint.y = this.editedMarker.top + this.editedMarker.height;
      } else if (this.editedMarker.position === 'top-right') {
        this.editedMarker.startPoint.x = this.editedMarker.left + this.editedMarker.width;
        this.editedMarker.startPoint.y = this.editedMarker.top;
      } else if (this.editedMarker.position === 'bottom-right') {
        this.editedMarker.startPoint.x = this.editedMarker.left + this.editedMarker.width;
        this.editedMarker.startPoint.y = this.editedMarker.top + this.editedMarker.height;
      }
    }
  }
}
