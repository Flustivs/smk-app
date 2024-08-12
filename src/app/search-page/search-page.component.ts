import {
  Component,
  viewChild,
  ɵgenerateStandaloneInDeclarationsError,
} from '@angular/core';
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
        this.makeImages(artPictures, response.items);
      } else {
        console.error('Unexpected response format or items not found');
      }
    } catch (error) {
      console.log('Failed to get all art: ', error);
    }
  }

  makeImages(images: string[], arts: []) {
    let div = document.getElementById('picturecontainer');

    while (div?.firstChild) {
      div.removeChild(div.firstChild);
    }

    let columnCount = 1;
    console.log(innerWidth);
    if (innerWidth > 400) columnCount = 1;
    if (innerWidth > 700) columnCount = 2;
    if (innerWidth > 1000) columnCount = 3;
    if (innerWidth > 1300) columnCount = 4;
    if (innerWidth > 1600) columnCount = 5;

    let columns: HTMLDivElement[] = [];

    for (let i = 1; i <= columnCount; i++) {
      let columndiv = document.createElement('div');
      columndiv.id = 'column' + i;
      columndiv.style.display = 'inline-block';
      columndiv.style.verticalAlign = 'top';
      div?.appendChild(columndiv);
      columns.push(columndiv);
    }

    images.forEach((picture: string, index: number) => {
      let box = document.createElement('div');
      let img = document.createElement('img');
      let title = document.createElement('p');

      box.style.padding = '30px';

      img.style.width = '260px';
      img.style.height = 'auto';
      img.src = picture;

      title.className = 'card-info';
      /*if (Array.isArray(arts[index].titles))
        title.innerText = arts[index].titles.title;
      else {
        title.innerText = '***';
      }*/

      box.appendChild(img);

      columns[index % columnCount].appendChild(box);
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
