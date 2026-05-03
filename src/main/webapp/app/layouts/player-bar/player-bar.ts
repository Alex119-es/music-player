import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { PlayerService } from 'app/core/player/player.service';

@Component({
  selector: 'jhi-player-bar',
  templateUrl: './player-bar.html',
  styleUrl: './player-bar.scss',
  imports: [FaIconComponent],
})
export default class PlayerBar implements AfterViewInit {
  @ViewChild('audio', { static: true }) audioRef!: ElementRef<HTMLAudioElement>;

  readonly player = inject(PlayerService);

  ngAfterViewInit(): void {
    this.player.attachAudio(this.audioRef.nativeElement);
  }

  formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const total = Math.floor(seconds);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  onSeekInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.player.seek(Number(input.value));
  }

  onVolumeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.player.setVolume(Number(input.value));
  }

  progressPercent(): number {
    const dur = this.player.duration();
    if (!dur) return 0;
    return (this.player.progress() / dur) * 100;
  }
}
