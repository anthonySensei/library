import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '@shared/shared.module';
import { MainPageRoutingModule } from './main-page-routing.module';

import { MainPageComponent } from './main-page/main-page.component';
import { BookDetailsComponent } from './book-details/book-details.component';

import { LoanBookPopupComponent } from './book-details/loan-book-modal/loan-book-popup.component';
import { MoveBookModalComponent } from './book-details/move-book-modal/move-book-modal.component';
import { BooksListComponent } from './main-page/books-list/books-list.component';

@NgModule({
    declarations: [
        MainPageComponent,
        BookDetailsComponent,
        LoanBookPopupComponent,
        MoveBookModalComponent,
        BooksListComponent,
    ],
    imports: [RouterModule, MainPageRoutingModule, SharedModule, FormsModule],
    entryComponents: [
        LoanBookPopupComponent,
        MoveBookModalComponent,
    ]
})
export class MainPageModule {}
