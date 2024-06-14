import { Routes } from '@angular/router';
import { ImageViewerComponent } from './image-viewer/image-viewer.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => ImageViewerComponent
  }
];
