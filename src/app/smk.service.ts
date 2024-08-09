import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class SmkService {
  constructor() {}

  async getArtDetails(objectNumber: string): Promise<any> {
    const url = `https://api.smk.dk/api/v1/art?object_number=${objectNumber}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching art details: ', error);
      throw error;
    }
  }

  async getAllArt(): Promise<any> {
    const url =
      'https://api.smk.dk/api/v1/art/search/?keys=*&facetNum=-1&facets=creator,artist,colors,role_attributed_to,role_earlier_ascribed_to,role_workshop_of,role_follower,role_after,role_school,role_imitator_of,role_copy_after,role_after_model_by,role_publisher,role_printer,role_artist,creator_nationality,creator_gender,content_person,content_subject,object_names,techniques,materials,medium&randomHighlights=72041&lang=da&offset=0&rows=24';
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.log('Error fetching all art: ', error);
      throw error;
    }
  }

  async getArtSearch(key: string): Promise<any> {
    const url = `https://api.smk.dk/api/v1/art/search?keys=${key}&offset=10&rows=10`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching art details: ', error);
      throw error;
    }
  }
  async getIiifSearch(iiifKey: string): Promise<any> {
    const url = `https://api.smk.dk/api/v1/iiif/autocomplete?key=${iiifKey}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error iiif information: ', error);
      throw error;
    }
  }
}
