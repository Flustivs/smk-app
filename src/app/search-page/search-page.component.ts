import { Component, viewChild } from '@angular/core';
import { SmkService } from '../smk.service';
import { toArray } from 'rxjs';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css',
})
export class SearchPageComponent {
  key: string = '';
  artDetails: any;

  constructor(private smkService: SmkService) {}

  async getAllArt() {
    let artPictures: string[] = [];
    try {
      let response = await this.smkService.getAllArt();

      if (response && response.items && Array.isArray(response.items)) {
        response.items.forEach((artItem: any) => {
          if (
            artItem.image_thumbnail != null ||
            artItem.image_thumbnail != ''
          ) {
            artPictures.push(artItem.image_thumbnail);
          } else {
            artPictures.push('');
          }
        });
        this.makeImagaes(artPictures);
      } else {
        console.error('Unexpected response format or items not found');
      }
    } catch (error) {
      console.log('Failed to get all art: ', error);
    }
  }

  makeImagaes(images: string[]) {
    let div = document.getElementById('pictureContainer');
    images.forEach((picture: any) => {
      let img = document.createElement('img');
      img.src = picture;
      img.style.width = '10%';
      img.style.height = '10%';

      div?.appendChild(img);
    });
  }

  async searchArt() {
    if (!this.key.trim()) return;
    try {
      this.artDetails = await this.smkService.getArtSearch(this.key);
    } catch (error) {
      console.error('Failed to search for art: ', error);
    }
  }

  clearsearch() {
    this.key = '';
  }
}
