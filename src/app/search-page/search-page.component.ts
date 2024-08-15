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
  // On page load it calls getAllArt();
  ngOnInit(): void {
    this.getAllArt();
  }
  key: string = '';

  constructor(private smkService: SmkService) {}

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
  // Gets all the art and waits for the response and then takes all the image url's into a string array
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
        this.makeImages(artPictures, response.items, response);
      } else {
        console.error('Unexpected response format or items not found');
      }
    } catch (error) {
      console.log('Failed to get all art: ', error);
    }
  }
  // Takes an string array of images, The different objects for each image, The Api response
  makeImages(images: string[], apiItems: any, apiresponse: any) {
    let has_3d_file: Boolean;

    if (!apiItems || !Array.isArray(apiItems)) {
      console.error('API response is null, undefined, or not an array.');
      return;
    }

    const arts = apiItems
      .map((item: any) => {
        if (!item.titles || !Array.isArray(item.titles)) {
          console.error('Titles are missing or not an array for item:', item);
          return null;
        }
        if (!item.production || !Array.isArray(item.production)) {
          console.error(
            'Production data is missing or not an array for item:',
            item
          );
          return null;
        }

        const creator = item.production
          .map((c: any) => {
            if (!c) {
              console.error('Creator not found: ', c);
              return null;
            }
            return new Production(
              c.creator,
              c.creator_forename,
              c.creator_surname
            );
          })
          .filter((creator: any) => creator !== null);

        // Check if production_date exists if not, skip mapping or set to null
        const production_date = item.production_date
          ? item.production_date
              .map((p: any) => {
                if (!p) {
                  console.error('Incomplete date period data: ', p);
                  return null;
                }
                return new Production_date(p.start, p.end, p.period);
              })
              .filter((period: any) => period !== null)
          : null;

        const titles = item.titles
          .map((t: any) => {
            if (!t) {
              console.error('Incomplete title data:', t);
              return null;
            }
            return new Title(t.title, t.type, t.language);
          })
          .filter((title: any) => title !== null);

        return new Art(titles, production_date, creator);
      })
      .filter((art: any) => art !== null);

    let div = document.getElementById('picturecontainer');
    let amount = document.getElementById('amount') as HTMLParagraphElement;
    if (apiresponse.found != null) {
      amount.innerHTML = apiresponse.found;
    }
    // Removes all the columns
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

    // Creates the box for each image and append into the appropriate column
    images.forEach((picture: string, index: number) => {
      let box = document.createElement('div');
      let textdiv = document.createElement('div');
      let img = document.createElement('img');
      let title = document.createElement('p');
      let creatortext = document.createElement('p');

      box.style.padding = '30px';
      img.style.width = '260px';
      img.style.height = 'auto';

      if (picture == null) {
        box.style.backgroundColor = 'rgba(255, 255, 255, 0.067)';
        box.style.marginLeft = '20px';
        box.style.marginTop = '10%';
        box.style.width = '240px';
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

      const art = arts[index];

      if (art && art.titles.length > 0 && art.titles[0] != null) {
        title.style.color = 'rgb(245, 245, 245)';
        title.style.fontFamily = 'Hill';
        title.style.fontSize = '18px';
        title.style.maxWidth = '260px';
        title.style.marginLeft = '25px';
        title.style.textAlign = 'center';

        if (
          art.production_date &&
          art.production_date.length > 0 &&
          art.production_date[0] != null
        ) {
          title.innerText =
            (art.titles[0].title || '***') +
            ', ' +
            (art.production_date[0].period || 'dato');
        } else {
          title.innerText = art.titles[0].title || '***';
        }

        creatortext.style.color = 'rgb(245, 245, 245)';
        creatortext.style.fontFamily = 'Hill';
        creatortext.style.fontSize = '18px';
        creatortext.style.textAlign = 'center';
        creatortext.style.marginRight = '25px';
        creatortext.innerText = art.creator[0].creator;
      }

      textdiv.appendChild(box);
      textdiv.appendChild(title);
      textdiv.appendChild(creatortext);

      columns[index % columnCount].appendChild(textdiv);
    });
  }

  // Search for the specific key from the input field, gets called each time a change is made in the input field
  async searchArt() {
    let artPictures: string[] = [];
    if (!this.key.trim()) this.getAllArt();
    try {
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
        this.makeImages(artPictures, response.items, response);
      }
    } catch (error) {
      console.error('Failed to search for art: ', error);
    }
  }

  // Clears the search input field
  clearsearch() {
    this.key = '';
    this.getAllArt();
  }

  // Makes a makes the filter for the api request
  async Filter() {
    let filter = '';
    let artPictures: string[] = [];

    let free = document.getElementById('free-use') as HTMLInputElement;
    let foto = document.getElementById('foto') as HTMLInputElement;
    let bigfoto = document.getElementById('big-foto') as HTMLInputElement;
    let dimension = document.getElementById('3d-foto') as HTMLInputElement;
    let smk = document.getElementById('SMK') as HTMLInputElement;

    if (
      !free.checked &&
      !foto.checked &&
      !bigfoto.checked &&
      !dimension.checked &&
      !smk.checked
    ) {
      filter.replace('filters=', '');
    }
    if (!filter.includes('filters=')) {
      filter += 'filters=';
    }
    if (free.checked) {
      filter += ',%5Bpublic_domain:true%5D';
    }
    if (foto.checked) {
      filter += ',%5Bhas_image:true%5D';
    }
    if (bigfoto.checked) {
      filter += ',%5Bimage_hq:true%5D';
    }
    if (dimension.checked) {
      filter += ',%5Bhas_3d_file:true%5D';
    }
    if (smk.checked) {
      filter += ',%5Bon_display:true%5D';
    }
    if (filter.includes('=,')) {
      filter = filter.replace('=,', '=');
    }
    console.log(filter);
    try {
      let response = await this.smkService.getFilterArt(filter);
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
        this.makeImages(artPictures, response.items, response);
      }
    } catch (error) {
      console.error('Failed to search for art: ', error);
    }
  }
}

/**
 * All below here is class's used for mapping
 */

// Mapping for Titles
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

// Mapping for Creators
class Production {
  creator: string;
  creator_forename: string;
  creator_surname: string;

  constructor(
    creator: string,
    creator_forename: string,
    creator_surname: string
  ) {
    this.creator = creator;
    this.creator_forename = creator_forename;
    this.creator_surname = creator_surname;
  }
}

// Mapping for creation dates / periods
class Production_date {
  start: Date;
  end: Date;
  period: Date;

  constructor(start: Date, end: Date, period: Date) {
    this.start = start;
    this.end = end;
    this.period = period;
  }
}

// Used for the final mapping of the api response
class Art {
  titles: Title[];
  production_date: Production_date[];
  creator: Production[];

  constructor(
    titles: Title[],
    production_date: Production_date[],
    creator: Production[]
  ) {
    this.titles = titles;
    this.production_date = production_date;
    this.creator = creator;
  }
}
