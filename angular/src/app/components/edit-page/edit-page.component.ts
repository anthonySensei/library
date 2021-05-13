import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Department } from '../../models/department.model';
import { Period } from '../../models/period.model';

import { MaterialService } from '../../services/material.service';

import { PeriodService } from '../../services/period.service';
import { HelperService } from '../../services/helper.service';
import { AuthService } from '../../services/auth.service';
import { LibrarianService } from '../../services/librarian.service';

import { SnackBarClasses } from '../../constants/snackBarClasses';
import { PageTitles } from '../../constants/pageTitles';
import { WarnMessages } from '../../constants/warnMessages';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Select, Store } from '@ngxs/store';
import { UserState } from '../../store/state/user.state';
import { User } from '../../models/user.model';
import { LoadAuthors } from '../../store/state/author.state';
import { LoadGenres } from '../../store/state/genre.state';

@Component({
    selector: 'app-edit-page',
    templateUrl: './edit-page.component.html',
    styleUrls: ['./edit-page.component.sass']
})
export class EditPageComponent implements OnInit, OnDestroy {
    departments: Department[];
    periods: Period[];

    departmentSelect: number;

    nothingToChange = WarnMessages.NOTHING_TO_CHANGE;
    isManager: boolean;

    @Select(UserState.User)
    user$: Observable<User>;

    constructor(
        private authService: AuthService,
        private materialService: MaterialService,
        private periodService: PeriodService,
        public helperService: HelperService,
        public librarianService: LibrarianService,
        private store: Store
    ) {}

    ngOnInit(): void {
        document.title = PageTitles.MANAGING;
        this.selectsValuesSubscriptionHandle();
        this.getUser$();
    }

    getUser$(): void {
        this.user$.pipe(untilDestroyed(this)).subscribe(user => this.isManager = user && user.admin);
    }

    selectsValuesSubscriptionHandle(): void {
        this.periodService.fetchAllPeriodsHttp().pipe(untilDestroyed(this)).subscribe();
        this.periodService.getPeriods().pipe(untilDestroyed(this)).subscribe((periods: Period[]) => {
            this.periods = periods;
        });
    }

    nothingChangeHandle(): void {
        this.materialService.openSnackbar(this.nothingToChange, SnackBarClasses.Warn);
    }

    onLoadAuthors() {
        this.store.dispatch(new LoadAuthors());
    }

    onLoadGenres() {
        this.store.dispatch(new LoadGenres());
    }

    ngOnDestroy(): void {}
}
