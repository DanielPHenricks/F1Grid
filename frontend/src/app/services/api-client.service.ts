import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class ApiClientService {

    constructor(readonly http: HttpClient) {

    }
    // TODO: type this
    getPlayers(): any {
        return this.http.get(`http://localhost:8000/api/players`)
    }
}