import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { AccountService } from 'app/core/auth/account.service';

@Component({
  standalone: true,
  selector: 'jhi-dashboard-editor',
  imports: [RouterLink, FaIconComponent],
  templateUrl: './dashboard-editor.html',
  styleUrls: ['./dashboard-editor.scss'],
})
export default class DashboardEditorComponent {
  readonly account = inject(AccountService).account;
}
