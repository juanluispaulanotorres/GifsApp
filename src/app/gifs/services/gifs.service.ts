import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})

export class GifsService {

  private apiKey: string = "fl3X8fDQTGngcgHTsz55ttOatUDqHwjS";
  private servicioUrl: string = "https://api.giphy.com/v1/gifs";
  private _historial: string[] = [];
  public resultados: Gif[] = [];

  get historial() {
    return [...this._historial];
  }

  constructor (private httpService: HttpClient) {
    // Ontención del historial y de los últimos resultados al cargar la página

    console.log(this._historial);

    this._historial = JSON.parse(localStorage.getItem("historial")!) || [];
    this.resultados = JSON.parse(localStorage.getItem("resultados")!) || [];
  }

  buscarGifs(query: string) {

    query = query.trim().toLowerCase();                     // Me aseguro de que el valor se almacene en el array en minúscula para evitar que se duplique

    if (!this.historial.includes(query)) {
      this._historial.unshift(query);                       // Si no se encuentra el valor en el array, se almacena en él
      this._historial = this._historial.splice(0,10);

      // Establecer en "localstorage" el historial
      localStorage.setItem("historial", JSON.stringify(this._historial));
    }

    // Construir los parámetros de la url a la que se hace la petición más adelante
    const params = new HttpParams().set("api_key", this.apiKey)
                                    .set("limit", "10")
                                    .set("q", query);

    // SearchGifsResponse: interfaz creada "gifs.interface.ts"

    this.httpService.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe((respuesta)=> {console.log(respuesta.data);                            // suscribe: Se ejecutará cuando se obtenga la resolución de la petición anterior
        this.resultados = respuesta.data;

        // Establecer en "localstorage" el la última búsqueda (imágenes)
        localStorage.setItem("resultados", JSON.stringify(this.resultados));
      });
  }

}
