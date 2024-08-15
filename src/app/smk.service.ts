import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class SmkService {
  constructor() {}

  // Calls the APi and awaits the response
  async getAllArt(): Promise<any> {
    const url =
      'https://api.smk.dk/api/v1/art/search/?keys=*&facetNum=-1&facets=creator,artist,colors,role_attributed_to,role_earlier_ascribed_to,role_workshop_of,role_follower,role_after,role_school,role_imitator_of,role_copy_after,role_after_model_by,role_publisher,role_printer,role_artist,creator_nationality,creator_gender,content_person,content_subject,object_names,techniques,materials,medium&randomHighlights=72041&lang=da&offset=0&rows=2000';
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log('Error fetching all art: ', error);
      throw error;
    }
  }

  // Call the API with a search key and awaits the response
  async getArtSearch(key: string): Promise<any> {
    const url = `https://api.smk.dk/api/v1/art/search?keys=${key}&facetNum=-1&facets=creator,artist,colors,role_attributed_to,role_earlier_ascribed_to,role_workshop_of,role_follower,role_after,role_school,role_imitator_of,role_copy_after,role_after_model_by,role_publisher,role_printer,role_artist,creator_nationality,creator_gender,content_person,content_subject,object_names,techniques,materials,medium&randomHighlights=72041&lang=da&offset=0&rows=2000`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching art details: ', error);
      throw error;
    }
  }

  // Calls the API with a filter(s) and awaits the response
  async getFilterArt(filter: string): Promise<any> {
    let url = '';
    if (filter == 'filters=') {
      url =
        'https://api.smk.dk/api/v1/art/search/?keys=*&facetNum=-1&facets=creator,artist,colors,role_attributed_to,role_earlier_ascribed_to,role_workshop_of,role_follower,role_after,role_school,role_imitator_of,role_copy_after,role_after_model_by,role_publisher,role_printer,role_artist,creator_nationality,creator_gender,content_person,content_subject,object_names,techniques,materials,medium&randomHighlights=72041&lang=da&offset=0&rows=2000';
    } else {
      url = `https://api.smk.dk/api/v1/art/search/?keys=*&${filter}facetNum=-1&facets=creator,artist,colors,role_attributed_to,role_earlier_ascribed_to,role_workshop_of,role_follower,role_after,role_school,role_imitator_of,role_copy_after,role_after_model_by,role_publisher,role_printer,role_artist,creator_nationality,creator_gender,content_person,content_subject,object_names,techniques,materials,medium&randomHighlights=72041&lang=da&offset=0&rows=2000`;
    }
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log('Error fetching all art: ', error);
      throw error;
    }
  }
}
