import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './components/start/start.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { CryptoComponent } from './components/dashboard/crypto/crypto.component';
import { TabsComponent } from './components/dashboard/tabs/tabs.component';
import { SidebarComponent } from './components/dashboard/sidebar/sidebar.component';

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
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    // children: [
    //   { path: '', component: CryptoComponent },
    //   { path: '', component: TabsComponent },
    //   { path: '', component: SidebarComponent },
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
