import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  imports: [RouterLink, FontAwesomeModule, FormsModule, NgbInputDatepicker, Alert, AlertError, FormatMediumDatePipe],
})
export class AlbumUpcoming implements OnInit {
  readonly myAlbums = signal<IAlbum[]>([]);
  readonly isLoading = signal(false);
  readonly editingAlbumId = signal<number | null>(null);
  readonly selectedDate = signal<NgbDateStruct | null>(null);
  readonly searchTerm = signal('');

  selectedDateModel: NgbDateStruct | null = null;
  readonly today = dayjs().startOf('day');

  readonly upcomingAlbums = computed(() => {
    return this.myAlbums().filter(a => a.releaseDate && dayjs(a.releaseDate).isAfter(this.today));
  });

  readonly availableAlbums = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const upcomingIds = new Set(this.upcomingAlbums().map(a => a.id));
    return this.myAlbums().filter(a => !upcomingIds.has(a.id) && (!term || a.title?.toLowerCase().includes(term)));
  });

  private readonly albumService = inject(AlbumService);

  ngOnInit(): void {
    this.loadMyAlbums();
  }

  previousState(): void {
    globalThis.history.back();
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
    const updated: IAlbum = { ...album, releaseDate };

    this.albumService.update(updated).subscribe({
      next: updatedAlbum => {
        this.myAlbums.update(albums => albums.map(a => (a.id === updatedAlbum.id ? updatedAlbum : a)));
        this.editingAlbumId.set(null);
        this.selectedDate.set(null);
      },
      error: err => console.error('Error actualizando fecha', err),
    });
  }

  removeFromUpcoming(album: IAlbum): void {
    const updated: IAlbum = { ...album, releaseDate: null };
    this.albumService.update(updated).subscribe({
      next: updatedAlbum => {
        this.myAlbums.update(albums => albums.map(a => (a.id === updatedAlbum.id ? updatedAlbum : a)));
      },
      error: err => console.error('Error quitando fecha', err),
    });
  }

  addToUpcoming(album: IAlbum): void {
    this.startEditing(album);
  }

  onSearch(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  daysUntil(date: dayjs.Dayjs): number {
    return dayjs(date).diff(this.today, 'day');
  }

  private loadMyAlbums(): void {
    this.isLoading.set(true);
    this.albumService.query({ size: 200 }).subscribe({
      next: res => {
        this.myAlbums.set(res.body ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
