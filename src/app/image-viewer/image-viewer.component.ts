import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css'],
  standalone: true,
  imports: [CommonModule, RouterOutlet],
}) export class ImageViewerComponent {
  @ViewChild('image') image!: ElementRef<HTMLImageElement>;

  isSelecting = false;
  selectionBox = { x: 0, y: 0, width: 0, height: 0 };
  startPoint = { x: 0, y: 0 };
  selectionColor: string = this.getRandomColor();
  markers: { x: number, y: number, width: number, height: number, selectionColor: string, number: number }[] = [];

  constructor() { }

  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const imageElement = this.image.nativeElement;
    const rect = imageElement.getBoundingClientRect();

    if (!this.isSelecting) {
      this.isSelecting = true;
      this.startPoint = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      this.selectionBox = { x: this.startPoint.x, y: this.startPoint.y, width: 0, height: 0 };
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
      this.selectionBox.x = Math.min(currentX, this.startPoint.x);
      this.selectionBox.y = Math.min(currentY, this.startPoint.y);
    }
  }

  onMouseUp(event: MouseEvent): void {
    event.preventDefault();

    if (this.isSelecting) {
      this.isSelecting = false;
      if (this.selectionBox.width !== 0 && this.selectionBox.height !== 0) {
        // Add marker based on the center of the selection box
        const centerX = this.selectionBox.x + this.selectionBox.width / 2;
        const centerY = this.selectionBox.y + this.selectionBox.height / 2;
        this.markers.push({
          x: centerX,
          y: centerY,
          width: this.selectionBox.width,
          height: this.selectionBox.height,
          selectionColor: this.selectionColor,
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