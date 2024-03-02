import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './components/start/start.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { CryptoComponent } from './components/dashboard/crypto/crypto.component';
import { TabsComponent } from './components/dashboard/tabs/tabs.component';
import { SidebarComponent } from './components/dashboard/sidebar/sidebar.component';
import { AddCryptoComponent } from './components/dashboard/add-crypto/add-crypto.component';
import { WelcomeComponent } from './components/dashboard/welcome/welcome.component';
import { WebsocketComponent } from './components/dashboard/websocket/websocket.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
  {
    path: 'start',
    component: StartComponent,
  },
  {
    path: 'logout',
    component: StartComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'crypto', component: CryptoComponent },
      { path: 'tabs', component: TabsComponent },
      { path: 'add-crypto', component: AddCryptoComponent },
      { path: 'welcome', component: WelcomeComponent },
      { path: 'websocket', component: WebsocketComponent },
      { path: '', redirectTo: 'tabs', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
