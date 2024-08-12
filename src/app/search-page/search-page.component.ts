import {
  Component,
  OnInit,
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
export class SearchPageComponent implements OnInit {
  ngOnInit(): void {
    this.getAllArt();
  }
  key: string = '';

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

  makeImages(images: string[], apiresponse: any) {
    const arts = apiresponse.map(
      (item: any) =>
        new Art(
          item.titles.map((t: any) => new Title(t.title, t.type, t.language))
        )
    );

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
      columndiv.style.width = `${100 / columnCount}%`;
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

      if (picture == null) {
        box.style.backgroundColor = 'rgba(255, 255, 255, 0.067)';
        box.style.marginLeft = '30px';
        box.style.padding = '0px';
        box.style.width = '260px';
        box.style.height = '165px';

        box.style.display = 'flex';
        box.style.justifyContent = 'center';
        box.style.alignItems = 'center';
        box.style.textAlign = 'center';

        let nopicture = document.createElement('p');
        nopicture.innerText = 'Billede på vej';
        nopicture.style.fontSize = '19px';
        nopicture.style.fontFamily = 'Hill';
        nopicture.style.color = 'rgb(245, 245, 245)';
        nopicture.style.textAlign = 'center';

        box.appendChild(nopicture);
      } else {
        img.src = picture;
        box.appendChild(img);
      }

      if (arts.length > 0) {
        const art = arts[index];
        if (art && art.titles.length > 0 && art.titles[0] != null) {
          title.className = 'card-info';
          title.innerText = art.titles[0].title || '***';
        }
        box.appendChild(title);
      }

      // Append the box to the correct column
      columns[index % columnCount].appendChild(box);
    });
  }

  async searchArt() {
    let artPictures: string[] = [];
    if (!this.key.trim()) this.getAllArt();
    try {
      console.log('got in this bitch');
      let response = await this.smkService.getArtSearch(this.key);
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
      }
    } catch (error) {
      console.error('Failed to search for art: ', error);
    }
  }

  clearsearch() {
    this.key = '';
  }
}

class Title {
  title: string;
  type: string;
  language: string;

  constructor(title: string, type: string, language: string) {
    this.title = title;
    this.type = type;
    this.language = language;
  }
}

class Art {
  titles: Title[];

  constructor(titles: Title[]) {
    this.titles = titles;
  }
}
