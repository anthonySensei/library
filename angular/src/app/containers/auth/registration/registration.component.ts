import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import { AuthService } from '../../../services/auth.service';
import { ValidationService } from '../../../services/validation.service';
import { ResponseService } from '../../../services/response.service';

import { AngularLinks } from '../../../constants/angularLinks';

import { Student } from '../../../models/student.model';
import { Response } from '../../../models/response.model';
import { PasswordVisibility } from '../../../constants/passwordVisibility';
import { ErrorMessages } from '../../../constants/errorMessages';
import { KeyWords } from '../../../constants/keyWords';
import { PageTitles } from '../../../constants/pageTitles';
import { MaterialService } from '../../../services/material.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Store } from '@ngxs/store';
import { CreateUser } from '../../../store/user.state';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html'
})
export class RegistrationComponent implements OnInit, OnDestroy {

    hidePassword = true;
    hideRetypePassword = true;

    error: string;
    emailError: string;

    done: boolean;
    discard: boolean;
    isPasswordError: boolean;

    response: Response;
    links = AngularLinks;
    mainInfoForm: FormGroup;
    passwordForm: FormGroup;

    emailValidation: RegExp;
    passwordValidation: RegExp;

    discardChanged = new Subject<boolean>();


    constructor(
        private validationService: ValidationService,
        private authService: AuthService,
        private responseService: ResponseService,
        private materialService: MaterialService,
        private router: Router,
        private store: Store
    ) {}

    ngOnInit() {
        document.title = PageTitles.REGISTRATION;
        this.emailValidation = this.validationService.getEmailValidation();
        this.passwordValidation = this.validationService.getPasswordValidation();
        this.formControlInitialization();
    }

    formControlInitialization() {
        this.mainInfoForm = new FormGroup({
            email: new FormControl(null, [
                Validators.required,
                Validators.email,
                Validators.pattern(this.emailValidation)
            ]),
            name: new FormControl(null, [Validators.required])
        });
        this.passwordForm = new FormGroup({
            password: new FormControl(null, [Validators.required, Validators.pattern(this.passwordValidation)]),
            password2: new FormControl(null, [Validators.required, Validators.pattern(this.passwordValidation)])
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.mainInfoForm.controls[controlName] ?
            this.mainInfoForm.controls[controlName].hasError(errorName) :
            this.passwordForm.controls[controlName].hasError(errorName);
    }

    checkIcon(hide: boolean, password: string): string {
        if (!password) {
            return '';
        } else if (hide) {
            return PasswordVisibility.VISIBLE;
        } else {
            return PasswordVisibility.INVISIBLE;
        }
    }

    onRegisterUser(stepper: MatHorizontalStepper): void {
        const email = this.mainInfoForm.value.email;
        const name = this.mainInfoForm.value.name;
        const password = this.passwordForm.value.password;
        const password2 = this.passwordForm.value.password2;

        if (this.passwordForm.invalid || this.mainInfoForm.invalid) {
            stepper.selectedIndex = 0;
            return;
        }

        if (!this.validationService.comparePasswords(password, password2)) {
            this.isPasswordError = true;
            this.error = ErrorMessages.DIFFERENT_PASSWORDS;
            stepper.selectedIndex = 1;
            this.passwordForm.patchValue({ password: '', password2: '' });
            return;
        }

        this.store.dispatch(new CreateUser(name, email, password)).subscribe(() => stepper.selectedIndex = 0);
    }

    canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
        // TODO fix canDeactivate
        // if (this.mainInfoForm.touched && !this.done) {
        //     this.materialService.openDiscardChangesDialog(this.discard, this.discardChanged);
        //     return this.discardChanged;
        // } else {
        //     return true;
        // }
        return true;
    }

    ngOnDestroy(): void {}
}
