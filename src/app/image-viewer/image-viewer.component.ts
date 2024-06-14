import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  standalone: true,
  imports: [
    CommonModule,
  ],
  styleUrl: './image-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageViewerComponent {
  @ViewChild('image') image!: ElementRef<HTMLImageElement>;
  isSelecting = false;
  selectionBox = { x: 0, y: 0, width: 0, height: 0 };
  startPoint = { x: 0, y: 0 };
  selectionColor: string = this.getRandomColor();

  onMouseDown(event: MouseEvent): void {
    const imageElement = this.image.nativeElement;
    const rect = imageElement.getBoundingClientRect();

    // Calculate the starting point of the selection relative to the image
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      this.isSelecting = true;
      this.startPoint = { x, y };
      this.selectionBox = { x, y, width: 0, height: 0 };
      this.selectionColor = this.getRandomColor(); // Generate new color
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isSelecting) {
      return;
    }

    const imageElement = this.image.nativeElement;
    const rect = imageElement.getBoundingClientRect();

    // Calculate the current point of the selection relative to the image
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Ensure the selection is within the image boundaries
    const xWithinBounds = Math.max(0, Math.min(rect.width, x));
    const yWithinBounds = Math.max(0, Math.min(rect.height, y));

    // Calculate the dimensions of the selection box
    this.selectionBox.width = Math.abs(xWithinBounds - this.startPoint.x);
    this.selectionBox.height = Math.abs(yWithinBounds - this.startPoint.y);

    // Calculate the top-left corner of the selection box
    this.selectionBox.x = Math.min(xWithinBounds, this.startPoint.x);
    this.selectionBox.y = Math.min(yWithinBounds, this.startPoint.y);
  }

  onMouseUp(event: MouseEvent): void {
    if (this.isSelecting) {
      this.isSelecting = false;
      console.log('Selection box:', this.selectionBox);
      // Ensure the selection box has valid dimensions
      if (this.selectionBox.width === 0 || this.selectionBox.height === 0) {
        this.selectionBox = { x: 0, y: 0, width: 0, height: 0 };
      }
    }
  }

  // Function to generate a random color
  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color + '80'; // Adding 80 for 50% transparency
  }
}
