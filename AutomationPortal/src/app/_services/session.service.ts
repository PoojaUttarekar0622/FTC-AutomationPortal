import { Injectable } from "@angular/core";
import { Aduser } from "../_models/aduser";

const loggedInUserKey: string = "loggedinUserDetails";

@Injectable({ providedIn: "root" })
export class SessionService {

    jsonUser: any;

    setLoggedInUserDetails(userDetails: any) {
        sessionStorage.setItem(loggedInUserKey, JSON.stringify(userDetails));
    }

    isLoggedInUserSessionDataPresent(): boolean {
        let userDetails = sessionStorage.getItem(loggedInUserKey);
        return userDetails ? true : false;
    }

    getCurrentUserName() {
        this.jsonUser = JSON.parse(sessionStorage.getItem(loggedInUserKey));
        return this.jsonUser["userName"];
    }

    getLoginName() {
        this.jsonUser = JSON.parse(sessionStorage.getItem(loggedInUserKey));
        return this.jsonUser["loginName"];
    }

    getToken() {
        this.jsonUser = JSON.parse(sessionStorage.getItem(loggedInUserKey));
        return this.jsonUser["tokenId"];
    }
    getUserId() {
        this.jsonUser = JSON.parse(sessionStorage.getItem(loggedInUserKey));
        return this.jsonUser["userId"];
    }
    getRole() {
        this.jsonUser = JSON.parse(sessionStorage.getItem(loggedInUserKey));
        return this.jsonUser["roleId"];
    }

    getRoleName() {
        this.jsonUser = JSON.parse(sessionStorage.getItem(loggedInUserKey));
        return this.jsonUser["roleName"];
    }
    getFirstName() {
        this.jsonUser = JSON.parse(sessionStorage.getItem(loggedInUserKey));
        return this.jsonUser["firstName"];
    }
    getLoggedInUserDetails(): Aduser {
        return JSON.parse(sessionStorage.getItem(loggedInUserKey));
    }

    public async clearsession() {
        await sessionStorage.removeItem('loggedinUserDetails');
        await sessionStorage.removeItem('logedinUser');
        await sessionStorage.clear();
        return true;
    }

}
