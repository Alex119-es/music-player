import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { SongService } from 'app/entities/song/service/song.service';
import { ISong } from 'app/entities/song/song.model';
import { UserService } from 'app/entities/user/service/user.service';
import { IUser } from 'app/entities/user/user.model';
import { ILike } from '../like.model';
import { LikeService } from '../service/like.service';

import { LikeFormService } from './like-form.service';
import { LikeUpdate } from './like-update';

describe('Like Management Update Component', () => {
  let comp: LikeUpdate;
  let fixture: ComponentFixture<LikeUpdate>;
  let activatedRoute: ActivatedRoute;
  let likeFormService: LikeFormService;
  let likeService: LikeService;
  let userService: UserService;
  let songService: SongService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(LikeUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    likeFormService = TestBed.inject(LikeFormService);
    likeService = TestBed.inject(LikeService);
    userService = TestBed.inject(UserService);
    songService = TestBed.inject(SongService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call User query and add missing value', () => {
      const like: ILike = { id: 17612 };
      const user: IUser = { id: 3944 };
      like.user = user;

      const userCollection: IUser[] = [{ id: 3944 }];
      vitest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      vitest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ like });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.usersSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Song query and add missing value', () => {
      const like: ILike = { id: 17612 };
      const song: ISong = { id: 123 };
      like.song = song;

      const songCollection: ISong[] = [{ id: 123 }];
      vitest.spyOn(songService, 'query').mockReturnValue(of(new HttpResponse({ body: songCollection })));
      const additionalSongs = [song];
      const expectedCollection: ISong[] = [...additionalSongs, ...songCollection];
      vitest.spyOn(songService, 'addSongToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ like });
      comp.ngOnInit();

      expect(songService.query).toHaveBeenCalled();
      expect(songService.addSongToCollectionIfMissing).toHaveBeenCalledWith(
        songCollection,
        ...additionalSongs.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.songsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const like: ILike = { id: 17612 };
      const user: IUser = { id: 3944 };
      like.user = user;
      const song: ISong = { id: 123 };
      like.song = song;

      activatedRoute.data = of({ like });
      comp.ngOnInit();

      expect(comp.usersSharedCollection()).toContainEqual(user);
      expect(comp.songsSharedCollection()).toContainEqual(song);
      expect(comp.like).toEqual(like);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<ILike>();
      const like = { id: 24446 };
      vitest.spyOn(likeFormService, 'getLike').mockReturnValue(like);
      vitest.spyOn(likeService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ like });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(like);
      saveSubject.complete();

      // THEN
      expect(likeFormService.getLike).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(likeService.update).toHaveBeenCalledWith(expect.objectContaining(like));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<ILike>();
      const like = { id: 24446 };
      vitest.spyOn(likeFormService, 'getLike').mockReturnValue({ id: null });
      vitest.spyOn(likeService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ like: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(like);
      saveSubject.complete();

      // THEN
      expect(likeFormService.getLike).toHaveBeenCalled();
      expect(likeService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<ILike>();
      const like = { id: 24446 };
      vitest.spyOn(likeService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ like });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(likeService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('should forward to userService', () => {
        const entity = { id: 3944 };
        const entity2 = { id: 6275 };
        vitest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareSong', () => {
      it('should forward to songService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 16182 };
        vitest.spyOn(songService, 'compareSong');
        comp.compareSong(entity, entity2);
        expect(songService.compareSong).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
