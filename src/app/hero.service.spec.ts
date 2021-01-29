import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { Hero } from './hero';
import { MessageService } from './message.service';
import { HeroService } from './hero.service';
describe('HeroService', () => {
  let service: HeroService;
  beforeEach(() => {
    const heroStub = { id: {} };
    const messageServiceStub = {
      messages: <Array<string>>[],
      add(message: string) {
        this.messages.push(message);
      },
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        { provide: Hero, useValue: heroStub },
        { provide: MessageService, useValue: messageServiceStub },
      ],
    });
    service = TestBed.inject(HeroService);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('addHero', () => {
    it('makes expected calls', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
      const heroStub: Hero = TestBed.inject(Hero);
      service.addHero(heroStub).subscribe((res) => {
        expect(res).toEqual(heroStub);
      });
      const req = httpTestingController.expectOne('api/heroes');
      expect(req.request.method).toEqual('POST');
      req.flush(heroStub);
      httpTestingController.verify();

      const messageService = TestBed.inject(MessageService);
      expect(messageService.messages[0]).toContain('added hero');
    });
    it('handles an error', () => {
      const heroStub: Hero = TestBed.inject(Hero);
      service.addHero(heroStub).subscribe((res) => {
        expect(res).toEqual(undefined);
      });
      const httpTestingController = TestBed.inject(HttpTestingController);
      const req = httpTestingController.expectOne('api/heroes');

      spyOn(console, 'error');

      req.flush('Error', { status: 404, statusText: 'Not Found' });

      expect(console.error).toHaveBeenCalled();
      const messageService = TestBed.inject(MessageService);
      expect(messageService.messages[0]).toContain('Not Found');
    });
  });
  describe('updateHero', () => {
    it('makes expected calls', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
      const heroStub: Hero = TestBed.inject(Hero);
      service.updateHero(heroStub).subscribe((res) => {
        expect(res).toEqual(heroStub);
      });
      const req = httpTestingController.expectOne('api/heroes');
      expect(req.request.method).toEqual('PUT');
      req.flush(heroStub);
      httpTestingController.verify();

      const messageService = TestBed.inject(MessageService);
      expect(messageService.messages[0]).toContain('updated hero');
    });
    it('handles 404 error', () => {
      const heroStub: Hero = TestBed.inject(Hero);
      service.updateHero(heroStub).subscribe((res) => {
        expect(res).toEqual(undefined);
      });

      const httpTestingController = TestBed.inject(HttpTestingController);
      const req = httpTestingController.expectOne('api/heroes');

      spyOn(console, 'error');

      req.flush('Error', { status: 404, statusText: 'Not Found' });

      expect(console.error).toHaveBeenCalled();
      const messageService = TestBed.inject(MessageService);
      expect(messageService.messages[0]).toContain('Not Found');
    });
  });
  describe('getHeroes', () => {
    it('makes expected calls', () => {
      const httpTestingController = TestBed.inject(HttpTestingController);
      const hero = TestBed.inject(Hero);
      service.getHeroes().subscribe((res) => {
        expect(res).toEqual([hero]);
      });
      const req = httpTestingController.expectOne('api/heroes');
      expect(req.request.method).toEqual('GET');
      req.flush([hero]);
      httpTestingController.verify();

      const messageService = TestBed.inject(MessageService);
      expect(messageService.messages[0]).toContain('fetched heroes');
    });

    it('handles an error', () => {
      service.getHeroes().subscribe((res) => {
        expect(res).toEqual([]);
      });
      const httpTestingController = TestBed.inject(HttpTestingController);
      const req = httpTestingController.expectOne('api/heroes');

      spyOn(console, 'error');

      req.flush('Error', { status: 404, statusText: 'Not Found' });

      expect(console.error).toHaveBeenCalled();
      const messageService = TestBed.inject(MessageService);
      expect(messageService.messages[0]).toContain('Not Found');
    });
  });

  describe('getHero', () => {
    it('gets hero with http get', () => {
      const heroStub: Hero = TestBed.inject(Hero);
      const id = 123;
      service.getHero(id).subscribe((res) => {
        expect(res).toEqual(heroStub);
      });

      const httpTestingController = TestBed.inject(HttpTestingController);
      const req = httpTestingController.expectOne('api/heroes/123');
      expect(req.request.method).toEqual('GET');
      req.flush(heroStub);

      httpTestingController.verify();
      const messageService = TestBed.inject(MessageService);
      expect(messageService.messages[0]).toContain('fetched hero');
    });

    it('handles 404 error', () => {
      service.getHero(123).subscribe((res) => {
        expect(res).toEqual(undefined);
      });

      const httpTestingController = TestBed.inject(HttpTestingController);
      const req = httpTestingController.expectOne('api/heroes/123');

      spyOn(console, 'error');

      req.flush('Error', { status: 404, statusText: 'Not Found' });

      expect(console.error).toHaveBeenCalled();
      const messageService = TestBed.inject(MessageService);
      expect(messageService.messages[0]).toContain('Not Found');
    });
  });

  describe('deleteHero', () => {
    it('deletes hero with http del', () => {
      const heroStub: Hero = TestBed.inject(Hero);
      heroStub.id = 123;
      service.deleteHero(heroStub).subscribe((res) => {
        expect(res).toEqual(heroStub);
      });

      const httpTestingController = TestBed.inject(HttpTestingController);
      const req = httpTestingController.expectOne('api/heroes/' + heroStub.id);
      expect(req.request.method).toEqual('DELETE');
      req.flush(heroStub);

      httpTestingController.verify();
      const messageService = TestBed.inject(MessageService);
      expect(messageService.messages[0]).toContain('deleted hero');
    });

    it('deletes hero by id with http del', () => {
      const heroStub: Hero = TestBed.inject(Hero);
      const id = 123;
      service.deleteHero(id).subscribe((res) => {
        expect(res).toEqual(heroStub);
      });

      const httpTestingController = TestBed.inject(HttpTestingController);
      const req = httpTestingController.expectOne('api/heroes/' + id);
      expect(req.request.method).toEqual('DELETE');
      req.flush(heroStub);

      httpTestingController.verify();

      const messageService = TestBed.inject(MessageService);
      expect(messageService.messages[0]).toContain('deleted hero');
    });

    it('handles 404 error', () => {
      const heroStub: Hero = TestBed.inject(Hero);
      service.addHero(heroStub).subscribe((res) => {
        expect(res).toEqual(undefined);
      });

      const httpTestingController = TestBed.inject(HttpTestingController);
      const req = httpTestingController.expectOne('api/heroes');

      spyOn(console, 'error');

      req.flush('Error', { status: 404, statusText: 'Not Found' });

      expect(console.error).toHaveBeenCalled();
      const messageService = TestBed.inject(MessageService);
      expect(messageService.messages[0]).toContain('Not Found');
    });
  });

  describe('searchHeroes', () => {
    it("returns empty array if term is blank and doesn't make http call", () => {
      service.searchHeroes('').subscribe((res) => {
        expect(res).toEqual([]);
      });

      const httpTestingController = TestBed.inject(HttpTestingController);
      httpTestingController.expectNone('api/heroes/?name=');
      httpTestingController.verify();
      const messageService = TestBed.inject(MessageService);
      expect(messageService.messages.length).toBe(0);
    });

    it('returns heroes using http GET', () => {
      const heroStub: Hero = TestBed.inject(Hero);
      const heroes: Array<Hero> = [heroStub];

      service.searchHeroes('abc').subscribe((res) => {
        expect(res).toEqual(heroes);
      });

      const httpTestingController = TestBed.inject(HttpTestingController);
      const req = httpTestingController.expectOne('api/heroes/?name=abc');
      expect(req.request.method).toEqual('GET');
      req.flush(heroes);

      httpTestingController.verify();
      const messageService = TestBed.inject(MessageService);
      expect(messageService.messages[0]).toContain('found heroes');
    });

    it('handles 404 error', () => {
      service.searchHeroes('abc').subscribe((res) => {
        expect(res).toEqual([]);
      });

      const httpTestingController = TestBed.inject(HttpTestingController);
      const req = httpTestingController.expectOne('api/heroes/?name=abc');

      spyOn(console, 'error');

      req.flush('Error', { status: 404, statusText: 'Not Found' });

      expect(console.error).toHaveBeenCalled();
      const messageService = TestBed.inject(MessageService);
      expect(messageService.messages[0]).toContain('Not Found');
    });
  });
});
