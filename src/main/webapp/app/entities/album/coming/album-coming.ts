import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbInputDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap/datepicker';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs/esm';

import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';
import { FormatMediumDatePipe } from 'app/shared/date';
import { IAlbum } from '../album.model';
import { AlbumService } from '../service/album.service';

@Component({
  selector: 'jhi-album-coming',
  templateUrl: './album-coming.html',
  styleUrls: ['./album-coming.scss'],
  imports: [FontAwesomeModule, FormsModule, NgbInputDatepicker, Alert, AlertError, FormatMediumDatePipe],
})
export class AlbumUpcoming implements OnInit {
  private readonly router = inject(Router);
  private readonly albumService = inject(AlbumService);

  // 🔥 TU LISTA REAL
  readonly myAlbums = signal<IAlbum[]>([]);
  readonly isLoading = signal(false);

  readonly editingAlbumId = signal<number | null>(null);
  readonly selectedDate = signal<NgbDateStruct | null>(null);
  readonly searchTerm = signal('');

  selectedDateModel: NgbDateStruct | null = null;

  ngOnInit(): void {
    this.loadUpcomingAlbums();
  }

  // =========================
  // 🔥 ESTO ES LO QUE FALTABA EN TU HTML
  // =========================

  readonly upcomingAlbums = computed(() => this.myAlbums().filter(a => a.releaseDate !== null && a.releaseDate !== undefined));

  readonly availableAlbums = computed(() => this.myAlbums().filter(a => !a.releaseDate));

  // =========================

  previousState(): void {
    this.router.navigate(['/album']); // o history.back() si prefieres
  }

  startEditing(album: IAlbum): void {
    this.editingAlbumId.set(album.id);

    if (album.releaseDate) {
      const d = dayjs(album.releaseDate);
      const struct = { year: d.year(), month: d.month() + 1, day: d.date() };

      this.selectedDate.set(struct);
      this.selectedDateModel = struct;
    } else {
      this.selectedDate.set(null);
      this.selectedDateModel = null;
    }
  }

  cancelEditing(): void {
    this.editingAlbumId.set(null);
    this.selectedDate.set(null);
    this.selectedDateModel = null;
  }

  saveReleaseDate(album: IAlbum): void {
    const date = this.selectedDate();
    if (!date) return;

    const releaseDate = dayjs(`${date.year}-${date.month}-${date.day}`, 'YYYY-M-D');

    const updated: IAlbum = {
      ...album,
      releaseDate,
    };

    this.albumService.update(updated).subscribe({
      next: updatedAlbum => {
        this.myAlbums.update(list => list.map(a => (a.id === updatedAlbum.id ? updatedAlbum : a)));
        this.editingAlbumId.set(null);
        this.selectedDate.set(null);
      },
    });
  }

  removeFromUpcoming(album: IAlbum): void {
    const updated: IAlbum = {
      ...album,
      releaseDate: null,
    };

    this.albumService.update(updated).subscribe({
      next: updatedAlbum => {
        this.myAlbums.update(list => list.map(a => (a.id === updatedAlbum.id ? updatedAlbum : a)));
      },
    });
  }

  addToUpcoming(album: IAlbum): void {
    this.startEditing(album);
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  private loadUpcomingAlbums(): void {
    this.isLoading.set(true);

    this.albumService.getUpcoming().subscribe({
      next: res => {
        console.log('UPCOMING:', res);
        this.myAlbums.set(res);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
