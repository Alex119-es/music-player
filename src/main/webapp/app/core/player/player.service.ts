import { Injectable, computed, signal } from '@angular/core';

import { ISong } from 'app/entities/song/song.model';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  readonly currentSong = signal<ISong | null>(null);
  readonly queue = signal<ISong[]>([]);
  readonly currentIndex = signal<number>(-1);

  readonly isPlaying = signal<boolean>(false);
  readonly progress = signal<number>(0);
  readonly duration = signal<number>(0);
  readonly volume = signal<number>(70);
  readonly isMuted = signal<boolean>(false);
  readonly isShuffle = signal<boolean>(false);
  readonly isRepeat = signal<boolean>(false);

  readonly volumeIcon = computed(() => {
    if (this.isMuted() || this.volume() === 0) return 'volume-mute';
    if (this.volume() < 40) return 'volume-down';
    return 'volume-up';
  });

  private audio: HTMLAudioElement | null = null;

  attachAudio(audio: HTMLAudioElement): void {
    this.audio = audio;
    audio.volume = this.volume() / 100;
    audio.muted = this.isMuted();
  }

  playSong(song: ISong, queue: ISong[] = [song]): void {
    if (!song.fileUrl || !this.audio) {
      return;
    }
    this.queue.set(queue);
    const idx = queue.findIndex(s => s.id === song.id);
    this.currentIndex.set(idx >= 0 ? idx : 0);
    this.currentSong.set(song);
    this.audio.src = song.fileUrl;
    void this.audio.play();
  }

  togglePlay(): void {
    if (!this.audio || !this.currentSong()) return;
    if (this.audio.paused) {
      void this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  next(): void {
    const q = this.queue();
    if (q.length === 0) return;
    let idx = this.currentIndex();
    if (this.isShuffle()) {
      idx = Math.floor(Math.random() * q.length);
    } else {
      idx = (idx + 1) % q.length;
    }
    this.playSong(q[idx], q);
  }

  previous(): void {
    if (!this.audio) return;
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }
    const q = this.queue();
    if (q.length === 0) return;
    const idx = (this.currentIndex() - 1 + q.length) % q.length;
    this.playSong(q[idx], q);
  }

  seek(seconds: number): void {
    if (!this.audio) return;
    this.audio.currentTime = seconds;
    this.progress.set(seconds);
  }

  seekPercent(percent: number): void {
    if (!this.audio) return;
    const target = (percent / 100) * (this.duration() || this.audio.duration || 0);
    if (Number.isFinite(target)) {
      this.seek(target);
    }
  }

  setVolume(value: number): void {
    this.volume.set(value);
    if (this.audio) {
      this.audio.volume = value / 100;
    }
    if (value > 0 && this.isMuted()) {
      this.toggleMute(false);
    }
  }

  toggleMute(force?: boolean): void {
    const next = force ?? !this.isMuted();
    this.isMuted.set(next);
    if (this.audio) {
      this.audio.muted = next;
    }
  }

  toggleShuffle(): void {
    this.isShuffle.update(v => !v);
  }

  toggleRepeat(): void {
    const next = !this.isRepeat();
    this.isRepeat.set(next);
    if (this.audio) {
      this.audio.loop = next;
    }
  }

  onAudioPlay(): void {
    this.isPlaying.set(true);
  }

  onAudioPause(): void {
    this.isPlaying.set(false);
  }

  onTimeUpdate(): void {
    if (!this.audio) return;
    this.progress.set(this.audio.currentTime);
  }

  onLoadedMetadata(): void {
    if (!this.audio) return;
    this.duration.set(this.audio.duration);
  }

  onEnded(): void {
    if (this.isRepeat()) {
      return; // <audio loop> ya reinicia
    }
    this.next();
  }
}
