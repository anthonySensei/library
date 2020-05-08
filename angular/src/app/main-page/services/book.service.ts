import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Book } from '../models/book.model';
import { Department } from '../models/department.model';
import { Author } from '../models/author.model';
import { Genre } from '../models/genre.model';

@Injectable({
    providedIn: 'root'
})
export class BookService {
    GET_BOOK_URL = 'http://localhost:3000/book-details';

    GET_ALL_BOOKS_URL = 'http://localhost:3000/books';
    ADD_BOOK_URL = 'http://localhost:3000/add-book';
    LOAN_BOOK_URL = 'http://localhost:3000/loan-book';

    GET_DEPARTMENT_URL = 'http://localhost:3000/departments';
    GET_AUTHORS_URL = 'http://localhost:3000/authors';
    GET_GENRES_URL = 'http://localhost:3000/genres';

    responseChanged = new Subject();
    response;

    booksChanged = new Subject<Book[]>();
    books: Book[] = [];

    departmentsChanged = new Subject<Department[]>();
    departments: Department[] = [];

    authorsChanged = new Subject<Author[]>();
    authors: Author[] = [];

    genresChanged = new Subject<Genre[]>();
    genres: Genre[] = [];

    bookChanged = new Subject<Book>();
    book: Book;

    constructor(private http: HttpClient) {}

    setBooks(books: Book[]) {
        this.books = books;
        this.booksChanged.next(books);
    }

    getBooks() {
        return this.books;
    }

    setDepartments(departments: Department[]) {
        this.departments = departments;
        this.departmentsChanged.next(this.departments);
    }

    getDepartments() {
        return this.departments;
    }

    setAuthors(authors: Author[]) {
        this.authors = authors;
        this.authorsChanged.next(this.authors);
    }

    getAuthors() {
        return this.authors;
    }

    setGenres(genres: Genre[]) {
        this.genres = genres;
        this.genresChanged.next(this.genres);
    }

    getGenres() {
        return this.genres;
    }

    setBook(book: Book) {
        this.book = book;
        this.bookChanged.next(book);
    }

    getBook() {
        return this.book;
    }

    setResponse(response) {
        this.response = response;
        this.responseChanged.next(this.response);
    }

    fetchAllBooksHttp(
        page: number,
        author: number,
        genre: number,
        department: number,
        yearFrom: number,
        yearTo: number,
        filterName: string,
        filterValue: number
    ) {
        const headers = new HttpHeaders();
        headers.append('Content-type', 'application/json');
        return this.http
            .get(
                `${this.GET_ALL_BOOKS_URL}?page=${page}` +
                    `&yFrom=${yearFrom}` +
                    `&yTo=${yearTo}` +
                    `&author=${author}` +
                    `&genre=${genre}` +
                    `&department=${department}` +
                    `&filterName=${filterName}` +
                    `&filterValue=${filterValue}`,
                {
                    headers
                }
            )
            .pipe(
                map((response: any) => {
                    this.setBooks(response.data.books);
                })
            );
    }

    fetchAllDepartmentsHttp() {
        const headers = new HttpHeaders();
        headers.append('Content-type', 'application/json');
        return this.http
            .get(`${this.GET_DEPARTMENT_URL}`, {
                headers
            })
            .pipe(
                map((response: any) => {
                    this.setDepartments(response.data.departments);
                })
            );
    }

    fetchAllAuthorsHttp() {
        const headers = new HttpHeaders();
        headers.append('Content-type', 'application/json');
        return this.http
            .get(`${this.GET_AUTHORS_URL}`, {
                headers
            })
            .pipe(
                map((response: any) => {
                    this.setAuthors(response.data.authors);
                })
            );
    }

    fetchAllGenresHttp() {
        const headers = new HttpHeaders();
        headers.append('Content-type', 'application/json');
        return this.http
            .get(`${this.GET_GENRES_URL}`, {
                headers
            })
            .pipe(
                map((response: any) => {
                    this.setGenres(response.data.genres);
                })
            );
    }

    getBookHttp(bookId: number) {
        const headers = new HttpHeaders();
        headers.append('Content-type', 'application/json');
        return this.http
            .get(`${this.GET_BOOK_URL}?bookId=${bookId}`, { headers })
            .pipe(
                map((response: any) => {
                    this.setBook(response.data.book);
                })
            );
    }

    addBooHttp(book: Book, imageToUploadBase64: string) {
        const headers = new HttpHeaders();
        const formData: FormData = new FormData();
        headers.append('Content-Type', 'multipart/form-data');
        formData.append('base64', imageToUploadBase64);
        formData.append('book_data', JSON.stringify(book));
        return this.http.post(this.ADD_BOOK_URL, formData, { headers }).pipe(
            map((response: any) => {
                this.setResponse(response);
            })
        );
    }

    loanBookHttp(info) {
        return this.http
            .post(this.LOAN_BOOK_URL, info)
            .pipe(map(response => {}));
    }
}
