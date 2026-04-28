import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'jhi-dashboard-editor',
  imports: [RouterLink],
  templateUrl: './dashboard-editor.html',
  styleUrls: ['./dashboard-editor.scss'],
})
export default class DashboardEditorComponent {}
