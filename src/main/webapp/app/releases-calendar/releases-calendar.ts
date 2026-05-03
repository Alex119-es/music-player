import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import dayjs from 'dayjs/esm';

import { IAlbum } from 'app/entities/album/album.model';
import { AlbumService } from 'app/entities/album/service/album.service';

interface CalendarCell {
  date: dayjs.Dayjs;
  inMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  albums: IAlbum[];
}

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTH_LABELS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

@Component({
  standalone: true,
  selector: 'jhi-releases-calendar',
  imports: [RouterLink, FaIconComponent],
  templateUrl: './releases-calendar.html',
  styleUrl: './releases-calendar.scss',
})
export default class ReleasesCalendar implements OnInit {
  readonly weekdayLabels = WEEKDAY_LABELS;

  readonly isLoading = signal(true);
  readonly albums = signal<IAlbum[]>([]);
  readonly cursor = signal<dayjs.Dayjs>(dayjs().startOf('month'));

  readonly monthLabel = computed(() => `${MONTH_LABELS[this.cursor().month()]} ${this.cursor().year()}`);

  readonly cells = computed<CalendarCell[]>(() => {
    const firstOfMonth = this.cursor().startOf('month');
    const lastOfMonth = this.cursor().endOf('month');
    const today = dayjs().startOf('day');

    const dayOfWeek = firstOfMonth.day();
    const leadingOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const gridStart = firstOfMonth.subtract(leadingOffset, 'day');

    const albumsByDay = new Map<string, IAlbum[]>();
    for (const album of this.albums()) {
      if (!album.releaseDate) continue;
      const key = album.releaseDate.format('YYYY-MM-DD');
      const list = albumsByDay.get(key);
      if (list) {
        list.push(album);
      } else {
        albumsByDay.set(key, [album]);
      }
    }

    const cells: CalendarCell[] = [];
    for (let i = 0; i < 42; i++) {
      const date = gridStart.add(i, 'day');
      const key = date.format('YYYY-MM-DD');
      cells.push({
        date,
        inMonth: !date.isBefore(firstOfMonth, 'day') && !date.isAfter(lastOfMonth, 'day'),
        isToday: date.isSame(today, 'day'),
        isPast: date.isBefore(today, 'day'),
        albums: albumsByDay.get(key) ?? [],
      });
    }
    return cells;
  });

  readonly upcomingCount = computed(() => {
    const today = dayjs().startOf('day');
    return this.albums().filter(a => a.releaseDate && !a.releaseDate.isBefore(today)).length;
  });

  private readonly albumService = inject(AlbumService);

  ngOnInit(): void {
    this.loadAlbums();
  }

  goToToday(): void {
    this.cursor.set(dayjs().startOf('month'));
  }

  prevMonth(): void {
    this.cursor.update(c => c.subtract(1, 'month'));
  }

  nextMonth(): void {
    this.cursor.update(c => c.add(1, 'month'));
  }

  trackCell = (_: number, cell: CalendarCell): string => cell.date.format('YYYY-MM-DD');
  trackAlbum = (_: number, album: IAlbum): number => album.id;

  private loadAlbums(): void {
    this.isLoading.set(true);
    this.albumService.query({ sort: 'releaseDate,asc', size: 500 }).subscribe({
      next: res => {
        this.albums.set(res.body ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.albums.set([]);
        this.isLoading.set(false);
      },
    });
  }
}
