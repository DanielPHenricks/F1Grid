import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Driver } from "../types/driver";

@Injectable({
    providedIn: 'root',
})
export class ApiClientService {

    constructor(readonly http: HttpClient) {

    }
    // TODO: type this
    getPlayers(): any {
        return this.http.get(`http://localhost:8000/api/drivers`)
    }

    // Same todo here
    getResults(driver: Driver): any {
        return this.http.get(`http://localhost:8000/api/results?driver_id=${driver.driver_id}`)
    }
}