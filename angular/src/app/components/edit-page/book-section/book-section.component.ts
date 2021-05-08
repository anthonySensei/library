import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Book } from '../../../models/book.model';
import { Department } from '../../../models/department.model';

import { ResponseService } from '../../../services/response.service';
import { BookService } from '../../../services/book.service';
import { HelperService } from '../../../services/helper.service';

import { AngularLinks } from '../../../constants/angularLinks';
import { ModalWidth } from '../../../constants/modalWidth';
import { MatDialog } from '@angular/material/dialog';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
    selector: 'app-book-section',
    templateUrl: './book-section.component.html',
    styleUrls: ['../edit-page.component.sass']
})
export class BookSectionComponent implements OnInit, OnDestroy {
    @Input() responseService: ResponseService;
    @Input() helperService: HelperService;
    @Input() departmentSelect: number;
    @Input() departments: Department[];

    allBooks: Book[];
    booksForSelect: Book[];

    bookSelect: number = null;

    links = AngularLinks;

    constructor(
        private bookService: BookService,
        private router: Router,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.setBooks();
    }

    setBooks(): void {
    }

    editBook(): void {
        if (!this.bookSelect || !this.departmentSelect) {
            return;
        }
        this.router.navigate(['/', this.links.ADD_BOOK], {
            queryParams: { id: this.bookSelect }
        });
    }

    openConfirmDeleteDialog(): void {
        // const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
        //     width: ModalWidth.W30P
        // });
        //
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         this.deleteBook();
        //     }
        // });
    }

    deleteBook(): void {
        if (!this.departmentSelect || !this.bookSelect) {
            return;
        }
        this.bookService.deleteBookHttp(this.bookSelect).pipe(untilDestroyed(this)).subscribe(() => { this.bookResponseHandler(); });
    }

    bookResponseHandler(): void {
        if (this.responseService.responseHandle()) {
            this.bookSelect = null;
            this.departmentSelect = null;
            this.setBooks();
        }
    }

    ngOnDestroy(): void {}
}
