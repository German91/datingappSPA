import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { User } from '../_models/User';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
    baseUrl = 'http://localhost:5000/api/auth/';
    userToken: any;
    decodedToken: any;
    currentUser: User;
    jwtHelper: JwtHelper = new JwtHelper();
    private photoUrl = new BehaviorSubject<string>('../../assets/user.png');
    currentPhotoUrl = this.photoUrl.asObservable();

    constructor(private http: Http) { }

    changeMemberPhoto(photoUrl: string) {
        this.photoUrl.next(photoUrl);
    }

    login(model: any) {
        return this.http.post(this.baseUrl + 'login', model, this.requestOptions()).map((response: Response) => {
            const user = response.json();
            if (user && user.tokenString) {
                localStorage.setItem('token', user.tokenString);
                localStorage.setItem('user', JSON.stringify(user.user));
                this.currentUser = user.user;
                this.userToken = user.tokenString;
                this.decodedToken = this.jwtHelper.decodeToken(this.userToken);
                this.changeMemberPhoto(this.currentUser.photoUrl);
            }
        }).catch(this.handleError);
    }

    register(model: any) {
        return this.http.post(this.baseUrl + 'register', model, this.requestOptions()).catch(this.handleError);
    }

    loggedIn() {
        return tokenNotExpired();
    }

    private requestOptions() {
        const headers = new Headers({ 'Content-type': 'application/json' });
        return new RequestOptions({ headers });
    }

    private handleError(error: any) {
        const applicationError = error.headers.get('Application-Error');
        if (applicationError) {
            return Observable.throw(applicationError);
        }
        const serverError = error.json();
        let modelStateError = '';
        if (serverError) {
            for (const key in serverError) {
                if (serverError[key]) {
                    modelStateError += serverError[key] + '\n';
                }
            }
        }
        return Observable.throw(
            modelStateError || 'Server error'
        );
    }
}
