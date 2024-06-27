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
  selectionBox = { width: 0, height: 0, left: 0, top: 0, origin: {} };
  startPoint = { x: 0, y: 0, position: '', origin: { x: 0, y: 0 } };
  selectionColor: string = this.getRandomColor();
  markers: any[] = [];
  editedMarker: any = null;
  imageDimensions = { width: 0, height: 0 };
  imageContainerDimensions = { width: 0, height: 0 };
  imageElement = this.image?.nativeElement
  scaleX = 1;
  scaleY = 1;

  ngAfterViewInit() {
    this.image.nativeElement.onload = () => {

      this.imageDimensions.width = this.image.nativeElement.naturalWidth;
      this.imageDimensions.height = this.image.nativeElement.naturalHeight;

      this.imageContainerDimensions.width = this.image.nativeElement.offsetWidth;
      this.imageContainerDimensions.height = this.image.nativeElement.offsetHeight;
      this.imageElement = this.image.nativeElement
      this.scaleX = this.imageElement.naturalWidth / this.imageElement.offsetWidth;
      this.scaleY = this.imageElement.naturalHeight / this.imageElement.offsetHeight;
      console.log("Image dimensions:", this.imageDimensions);
    };
  }

  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const rect = this.imageElement.getBoundingClientRect();

    if (!this.isSelecting) {
      this.isSelecting = true;

      this.startPoint = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        position: '',
        origin: {
          x: (event.clientX - rect.left) * this.scaleX,
          y: (event.clientY - rect.top) * this.scaleY
        }
      };

      this.selectionBox = {
        width: 0,
        height: 0,
        left: this.startPoint.x,
        top: this.startPoint.y,
        origin: {
          left: this.startPoint.x * this.scaleX,
          top: this.startPoint.y * this.scaleY,
          width: 0,
          height: 0
        }
      };
      this.selectionColor = this.getRandomColor(); // Generate new color
    }
  }

  onMouseMove(event: MouseEvent): void {
    event.preventDefault();

    if (this.isSelecting) {
      const rect = this.imageElement.getBoundingClientRect();

      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;

      // Calculate width and height respecting direction
      this.selectionBox.width = Math.abs(currentX - this.startPoint.x);
      this.selectionBox.height = Math.abs(currentY - this.startPoint.y);

      // Calculate x and y for top-left corner of the selection box
      this.selectionBox.left = Math.min(currentX, this.startPoint.x);
      this.selectionBox.top = Math.min(currentY, this.startPoint.y);



      this.selectionBox.origin = {
        width: this.selectionBox.width * this.scaleX,
        height: this.selectionBox.height * this.scaleY,
        left: this.selectionBox.left * this.scaleX,
        top: this.selectionBox.top * this.scaleY
      };


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

/*         const right = this.imageDimensions.width - (this.selectionBox.left + this.selectionBox.width) * this.scaleX;
        const bottom = this.imageDimensions.height - (this.selectionBox.top + this.selectionBox.height) * this.scaleY; */

        this.markers.push({
          startPoint: this.startPoint,
          width: this.selectionBox.width,
          height: this.selectionBox.height,
          left: centerX,
          top: centerY,
          selectionColor: this.selectionColor,
          imageDimensions: this.imageDimensions,
          origin: { width: this.selectionBox.width * this.scaleX, height: this.selectionBox.height * this.scaleY, left: this.selectionBox.left * this.scaleX, top: this.selectionBox.top * this.scaleY },
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


  onEndEditing(newMarker: any): void {
    // Find the index of the edited marker in the markers array
    const index = this.markers.findIndex(marker => marker.number === newMarker.number);
    if (index !== -1) {
      // Replace the existing marker with the updated one
      this.markers[index] = newMarker;
      console.log('Updated markers:', this.markers);
    }
  }
}
