import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { SongService } from 'app/entities/song/service/song.service';
import { ISong } from 'app/entities/song/song.model';

@Component({
  selector: 'jhi-search',
  standalone: true,
  imports: [FaIconComponent, RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export default class SearchComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly songService = inject(SongService);

  readonly query = signal('');
  readonly songs = signal<ISong[]>([]);
  readonly isLoading = signal(false);

  constructor() {
    this.route.queryParamMap.subscribe(params => {
      const q = params.get('q') ?? '';
      this.query.set(q);
      if (q.trim()) this.search(q.trim());
      else this.songs.set([]);
    });
  }

  private search(q: string): void {
    this.isLoading.set(true);
    this.songService.query({ 'title.contains': q, size: 50 }).subscribe({
      next: res => {
        this.songs.set(res.body ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.songs.set([]);
        this.isLoading.set(false);
      },
    });
  }
}
