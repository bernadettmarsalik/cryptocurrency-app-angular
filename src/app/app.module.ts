import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StartComponent } from './components/start/start.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthService } from './services/auth.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SidebarComponent } from './components/dashboard/sidebar/sidebar.component';
import { TabsComponent } from './components/dashboard/tabs/tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CryptoComponent } from './components/dashboard/crypto/crypto.component';
import { HttpClientModule } from '@angular/common/http';
import { AddCryptoComponent } from './components/dashboard/add-crypto/add-crypto.component';
import { MatListModule } from '@angular/material/list';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { WelcomeComponent } from './components/dashboard/welcome/welcome.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    DashboardComponent,
    SidebarComponent,
    TabsComponent,
    CryptoComponent,
    AddCryptoComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatTabsModule,
    HttpClientModule,
    MatListModule,
    NgbModule,
    NgxChartsModule,
    MatTooltipModule,
  ],
  providers: [provideAnimationsAsync(), AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
