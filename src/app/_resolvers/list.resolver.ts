import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/User';
import { Injectable } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

@Injectable()
export class ListResolver implements Resolve<User[]> {
    pageSize = 5;
    pageNumber = 1;
    likeParam = 'likers';

    constructor(
        private userService: UserService,
        private router: Router,
        private alertify: AlertifyService
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUsers(this.pageNumber, this.pageSize, null, this.likeParam).catch(error => {
            this.alertify.error('Problem retriving data');
            this.router.navigate(['/home']);
            return Observable.of(null);
        });
    }
}
