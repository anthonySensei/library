import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './containers/auth/auth.module';

import { AppComponent } from './app.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { HeaderComponent } from './components/header/header.component';
import { EditPageComponent } from './components/edit-page/edit-page.component';
import { AuthorSectionComponent } from './components/edit-page/author-section/author-section.component';
import { BookSectionComponent } from './components/edit-page/book-section/book-section.component';
import { DepartmentSectionComponent } from './components/edit-page/department-section/department-section.component';
import { GenreSectionComponent } from './components/edit-page/genre-section/genre-section.component';
import { StudentSectionComponent } from './components/edit-page/student-section/student-section.component';

import { AuthInterceptor } from './services/auth.interceptor.service';

import { MainPageModule } from './containers/main-page/main-page.module';
import { UsersModule } from './containers/user/users.module';
import { LoansModule } from './containers/loans/loans.module';
import { LibrariansModule } from './containers/librarians/librarians.module';
import { StudentsModule } from './containers/students/students.module';
import { ScheduleSectionComponent } from './components/edit-page/schedule-section/schedule-section.component';
import { PeriodSectionComponent } from './components/edit-page/period-section/period-section.component';

@NgModule({
    declarations: [
        AppComponent,
        ErrorPageComponent,
        HeaderComponent,
        EditPageComponent,
        AuthorSectionComponent,
        BookSectionComponent,
        DepartmentSectionComponent,
        GenreSectionComponent,
        StudentSectionComponent,
        ScheduleSectionComponent,
        PeriodSectionComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        SharedModule,
        AuthModule,
        UsersModule,
        MainPageModule,
        LoansModule,
        LibrariansModule,
        StudentsModule,
        AppRoutingModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
