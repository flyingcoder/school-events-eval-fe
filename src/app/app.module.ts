import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { HashLocationStrategy, LocationStrategy  } from '@angular/common';

//Angular Material Components
import {MatCheckboxModule} from '@angular/material';
import {MatButtonModule} from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatNativeDateModule} from '@angular/material';
import { MatMomentDateModule } from "@angular/material-moment-adapter";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './Components/registration/registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './Components/layouts/header/header.component';
import { LayoutComponent } from './Components/layouts/layout/layout.component';
import { CollegeComponent } from './Components/panels/academics/college/college.component';
import { AcademicsComponent } from './Components/panels/academics/academics.component';
import { DepartmentComponent } from './Components/panels/academics/department/department.component';
import { CourseComponent } from './Components/panels/academics/course/course.component';
import { UsersComponent } from './Components/panels/users/users.component';
import { ListComponent } from './Components/panels/users/list/list.component';
import { FacultyComponent } from './Components/panels/users/faculty/faculty.component';
import { StudentsComponent } from './Components/panels/users/students/students.component';
import { FormComponent } from './Components/panels/users/form/form.component';
import { ImportComponent } from './Components/panels/users/import/import.component';
import { EvaluationComponent } from './Components/panels/evaluation/evaluation.component';
import { PreviewComponent } from './Components/panels/evaluation/preview/preview.component';
import { EventsComponent } from './Components/panels/events/events.component';
import { ReportsComponent } from './Components/panels/events/reports/reports.component';
import { LoginComponent } from './Components/login/login.component';
import { ChartComponent } from './Components/panels/events/reports/chart/chart.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    HeaderComponent,
    LayoutComponent,
    CollegeComponent,
    AcademicsComponent,
    DepartmentComponent,
    CourseComponent,
    UsersComponent,
    ListComponent,
    FacultyComponent,
    StudentsComponent,
    FormComponent,
    ImportComponent,
    EvaluationComponent,
    PreviewComponent,
    EventsComponent,
    ReportsComponent,
    LoginComponent,
    ChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatNativeDateModule, MatMomentDateModule,
    ChartsModule,
  ],
  providers: [{provide : LocationStrategy , useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
