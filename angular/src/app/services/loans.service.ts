import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Loan } from '../models/loan.model';
import { Statistic } from '../models/statistic.model';

import { serverLink } from '../constants/serverLink';

import { ResponseService } from './response.service';
import { HelperService } from './helper.service';

@Injectable({
    providedIn: 'root'
})
export class LoansService {
    private LOANS_URL = `${serverLink}/loans`;
    private LOANS_STATISTIC_URL = `${this.LOANS_URL}/statistic`;

    private loans = new Subject<Loan[]>();

    private statistic = new Subject<Statistic[]>();

    constructor(
        private http: HttpClient,
        private responseService: ResponseService,
        private helperService: HelperService
    ) {}

    setStatistic(statistic: Statistic[]): void {
        this.statistic.next(statistic);
    }

    getStatistic(): Observable<Statistic[]> {
        return this.statistic;
    }

    fetchLoansHttp(
        filterName: string = '',
        filterValue: string = '',
        sortOrder = 'desc',
        pageNumber = 0,
        pageSize = 5,
        departmentId: number = null,
        loanDate: Date = null,
        isShowDebtors = false,
        librarianId: number = null,
        studentId: number = null
    ): Observable<Loan[]> {
        let nextDay: Date;
        if (loanDate) {
            nextDay = new Date();
            nextDay.setDate(loanDate.getDate() + 1);
        }
        return this.http
            .get(this.LOANS_URL, {
                params: new HttpParams()
                    .set('filterName', filterName ? filterName : '')
                    .set('filterValue', filterValue)
                    .set('sortOrder', sortOrder)
                    .set('pageNumber', (pageNumber + 1).toString())
                    .set('pageSize', pageSize.toString())
                    .set(
                        'departmentId',
                        departmentId ? departmentId.toString() : ''
                    )
                    .set('loanDate', loanDate ? loanDate.toDateString() : '')
                    .set('nextDay', nextDay ? nextDay.toDateString() : '')
                    .set('isShowDebtors', isShowDebtors.toString())
                    .set(
                        'librarianId',
                        librarianId ? librarianId.toString() : ''
                    )
                    .set('studentId', studentId ? studentId.toString() : '')
            })
            .pipe(
                map((response: any) => {
                    this.helperService.setItemsPerPage(response.data.quantity);
                    return response.data.loans;
                })
            );
    }

    fetchLoansStatisticHttp(model: string, value: string) {
        return this.http
            .get(this.LOANS_STATISTIC_URL, {
                params: new HttpParams().set('model', model).set('value', value)
            })
            .pipe(
                map((response: any) => {
                    this.setStatistic(response.data.statistic);
                })
            );
    }

    returnBookHttp(loanId: number, bookId: number, returnedTime: Date) {
        const updatedData = {
            loanId,
            bookId,
            returnedTime
        };
        return this.http.put(this.LOANS_URL, updatedData).pipe(
            map((response: any) => {
                this.responseService.setResponse(response.data);
            })
        );
    }
}
