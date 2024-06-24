import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MarkerListComponent } from '../marker_list/marker_list.component';
import { MarkerCreatorComponent } from '../marker_creator/marker_creator.component';
@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css'],
  standalone: true,
  imports: [CommonModule, MarkerListComponent, MarkerCreatorComponent],
})
export class ImageViewerComponent implements AfterViewInit {

  @ViewChild('image') image!: ElementRef<HTMLImageElement>;

  isSelecting = false;
  selectionBox = { left: 0, top: 0, width: 0, height: 0 };
  startPoint = { x: 0, y: 0, position: '' };
  selectionColor: string = this.getRandomColor();
  markers: any[] = [];
  editedMarker: any = null;
  imageDimensions = { width: 0, height: 0 };

  ngAfterViewInit() {
    this.image.nativeElement.onload = () => {
      this.imageDimensions.width = this.image.nativeElement.naturalWidth;
      this.imageDimensions.height = this.image.nativeElement.naturalHeight;
      console.log("Image dimensions:", this.imageDimensions);
    };
  }

  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const imageElement = this.image.nativeElement;
    const rect = imageElement.getBoundingClientRect();

    if (!this.isSelecting) {
      this.isSelecting = true;

      this.startPoint = { x: event.clientX - rect.left, y: event.clientY - rect.top, position: '' };
      this.selectionBox = { left: this.startPoint.x, top: this.startPoint.y, width: 0, height: 0 };
      this.selectionColor = this.getRandomColor(); // Generate new color
    }
  }

  onMouseMove(event: MouseEvent): void {
    event.preventDefault();

    if (this.isSelecting) {
      const imageElement = this.image.nativeElement;
      const rect = imageElement.getBoundingClientRect();

      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;

      // Calculate width and height respecting direction
      this.selectionBox.width = Math.abs(currentX - this.startPoint.x);
      this.selectionBox.height = Math.abs(currentY - this.startPoint.y);

      // Calculate x and y for top-left corner of the selection box
      this.selectionBox.left = Math.min(currentX, this.startPoint.x);
      this.selectionBox.top = Math.min(currentY, this.startPoint.y);

      // Determine the position based on mouse move
      if (currentX > this.startPoint.x && currentY > this.startPoint.y) {
        this.startPoint.position = 'top-left';
      } else if (currentX > this.startPoint.x && currentY < this.startPoint.y) {
        this.startPoint.position = 'bottom-left';
      } else if (currentX < this.startPoint.x && currentY > this.startPoint.y) {
        this.startPoint.position = 'top-right';
      } else {
        this.startPoint.position = 'bottom-right';
      }
    }
  }

  onMouseUp(event: MouseEvent): void {
    event.preventDefault();

    if (this.isSelecting) {
      this.isSelecting = false;
      if (this.selectionBox.width !== 0 && this.selectionBox.height !== 0) {
        // Add marker based on the center of the selection box
        const centerX = this.selectionBox.left + this.selectionBox.width / 2;
        const centerY = this.selectionBox.top + this.selectionBox.height / 2;
        this.markers.push({
          startPoint: this.startPoint,
          left: centerX,
          top: centerY,
          width: this.selectionBox.width,
          height: this.selectionBox.height,
          selectionColor: this.selectionColor,
          imageDimensions: this.imageDimensions,
          number: this.markers.length + 1
        });
      }
    }
  }

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color + '80'; // Adding 80 for 50% transparency
  }
}
