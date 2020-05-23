import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';

import { Subscription } from 'rxjs';

import { LibrarianService } from '../../../services/librarian.service';

import { Loan } from '../../../models/loan.model';
import { Librarian } from '../../../models/librarian.model';
import { Schedule } from '../../../models/schedule.model';

@Component({
    selector: 'app-librarian-details',
    templateUrl: './librarian-details.component.html',
    styleUrls: ['./librarian-details.component.sass']
})
export class LibrarianDetailsComponent implements OnInit, OnDestroy {
    loans: Loan[];
    schedule: Schedule[];

    librarian: Librarian;
    librarianId: number;

    librarianSubscription: Subscription;
    librarianChangedSubscription: Subscription;

    paramsSubscription: Subscription;

    isLoading: boolean;

    displayedLoansColumns: string[] = [
        'loanTime',
        'returnedTime',
        'bookISBN',
        'studentTicketReader'
    ];

    displayedScheduleColumns: string[] = ['day', 'start', 'end'];

    loansDataSource: MatTableDataSource<Loan>;
    @ViewChild(MatPaginator, { static: true }) loansPaginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) loansSort: MatSort;

    scheduleDataSource: MatTableDataSource<{}>;
    @ViewChild(MatSort, { static: true }) scheduleSort: MatSort;

    showLabels = true;
    animations = true;
    xAxis = true;
    yAxis = true;
    showYAxisLabel = true;
    showXAxisLabel = true;
    xAxisLabel = 'Date';
    yAxisLabel = 'Quantity of books';
    timeline = true;

    model: string;
    modelValue: string;

    colorScheme = {
        domain: ['#ffaa00']
    };

    view: any[] = [700, 300];

    multi: any;

    constructor(
        private librarianService: LibrarianService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        document.title = 'Librarian';
        this.isLoading = true;
        this.paramsSubscription = this.route.params.subscribe(
            (params: Params) => {
                this.librarianId = +params.id;
                this.librarianSubscriptionHandle();
            }
        );
    }

    librarianSubscriptionHandle(): void {
        this.librarianSubscription = this.librarianService
            .getLibrarianHttp(this.librarianId)
            .subscribe();
        this.librarianChangedSubscription = this.librarianService.getLibrarian().subscribe(
            librarian => {
                this.librarian = librarian;
                this.loans = this.librarian.loans || [];
                this.loansDataSource = new MatTableDataSource(this.loans);
                this.loansDataSource.paginator = this.loansPaginator;
                this.loansDataSource.sort = this.loansSort;
                this.schedule = this.librarian.schedule || [];
                this.scheduleDataSource = new MatTableDataSource(this.schedule);
                this.scheduleDataSource.sort = this.scheduleSort;
                this.setStatisticToChart(this.librarian.statistic);
                this.isLoading = false;
            }
        );
    }

    setStatisticToChart(statistic): void {
        const seriesArr = [];
        statistic.forEach(stat => {
            const item = {
                name: stat.loanTime,
                value: stat.books
            };
            seriesArr.push(item);
        });
        if (seriesArr.length > 0) {
            this.multi = [
                {
                    name: this.librarian.name,
                    series: seriesArr
                }
            ];
        } else {
            this.xAxisLabel = '';
            this.multi = [
                {
                    name: this.librarian.name,
                    series: [
                        {
                            name: 'Empty',
                            value: 0
                        }
                    ]
                }
            ];
        }
    }

    applyLoansFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.loansDataSource.filter = filterValue.trim().toLowerCase();

        if (this.loansDataSource.paginator) {
            this.loansDataSource.paginator.firstPage();
        }
    }

    onSelect(data): void {}

    onActivate(data): void {}

    onDeactivate(data): void {}

    ngOnDestroy(): void {
        this.paramsSubscription.add(this.librarianChangedSubscription);
        this.paramsSubscription.add(this.librarianSubscription);
        this.paramsSubscription.unsubscribe();
    }
}
