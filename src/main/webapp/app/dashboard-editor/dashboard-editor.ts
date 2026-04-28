import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-dashboard-editor',
  templateUrl: './dashboard-editor.html',
  styleUrl: './dashboard-editor.scss',
  imports: [RouterLink, FaIconComponent],
})
export default class DashboardEditor {
  readonly account = inject(AccountService).account;
}
