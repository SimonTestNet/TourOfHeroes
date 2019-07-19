import { TestBed } from "@angular/core/testing";
import { HttpClient } from "@angular/common/http";
import { Hero } from "./hero";
import { MessageService } from "./message.service";
import { HeroService } from "./hero.service";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";

describe("HeroService", () => {
  let service: HeroService;
  let httpTestingController: HttpTestingController;
  let messageService: MessageService;
  beforeEach(() => {
    const heroStub = { id: {} };
    const messageServiceStub = {
      add(message: string) {
        this.messages.push(message);
      },
      messages: <Array<string>>[]
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        { provide: Hero, useValue: heroStub },
        { provide: MessageService, useValue: messageServiceStub }
      ]
    });
    httpTestingController = TestBed.get(HttpTestingController);
    messageService = TestBed.get(MessageService);
    service = TestBed.get(HeroService);
  });
  it("can load instance", () => {
    expect(service).toBeTruthy();
  });
  describe("addHero", () => {
    it("makes expected calls", () => {
      const httpClientStub: HttpClient = TestBed.get(HttpClient);
      const heroStub: Hero = TestBed.get(Hero);
      spyOn(httpClientStub, "post").and.callThrough();
      service.addHero(heroStub);
      expect(httpClientStub.post).toHaveBeenCalled();
    });
  });
  describe("updateHero", () => {
    it("makes expected calls", () => {
      const httpClientStub: HttpClient = TestBed.get(HttpClient);
      const heroStub: Hero = TestBed.get(Hero);
      spyOn(httpClientStub, "put").and.callThrough();
      service.updateHero(heroStub);
      expect(httpClientStub.put).toHaveBeenCalled();
    });
  });
  describe("getHeroes", () => {
    it("returns heroes using http GET", () => {
      const heroStub: Hero = TestBed.get(Hero);
      const heroes: Array<Hero> = [heroStub];

      service.getHeroes().subscribe(res => {
        expect(res).toEqual(heroes);
      });

      const req = httpTestingController.expectOne("api/heroes");
      expect(req.request.method).toEqual("GET");
      req.flush(heroes);

      httpTestingController.verify();
    });

    it("handles 404 error", () => {
      service.getHeroes().subscribe(res => {
        expect(res).toEqual([]);
      });

      const req = httpTestingController.expectOne("api/heroes");

      spyOn(console, "error").and.callThrough();

      req.flush("Error", { status: 404, statusText: "Not Found" });

      expect(console.error).toHaveBeenCalled();
      expect(messageService.messages[0]).toContain("Not Found");
    });
  });
  describe("getHero", () => {
    it("gets hero with http get", () => {
      const heroStub: Hero = TestBed.get(Hero);
      const id = 123;
      service.getHero(id).subscribe(res => {
        expect(res).toEqual(heroStub);
      });

      const req = httpTestingController.expectOne("api/heroes/123");
      expect(req.request.method).toEqual("GET");
      req.flush(heroStub);

      httpTestingController.verify();
    });

    it("handles 404 error", () => {
      service.getHero(123).subscribe(res => {
        expect(res).toEqual(undefined);
      });

      const req = httpTestingController.expectOne("api/heroes/123");

      spyOn(console, "error").and.callThrough();

      req.flush("Error", { status: 404, statusText: "Not Found" });

      expect(console.error).toHaveBeenCalled();
      expect(messageService.messages[0]).toContain("Not Found");
    });
  });

  describe("searchHeroes", () => {
    it("returns empty array if term is blank and doesn't make http call", () => {
      service.searchHeroes("").subscribe(res => {
        expect(res).toEqual([]);
      });

      httpTestingController.expectNone("api/heroes/?name=");
      httpTestingController.verify();
    });

    it("returns heroes using http GET", () => {
      const heroStub: Hero = TestBed.get(Hero);
      const heroes: Array<Hero> = [heroStub];

      service.searchHeroes("abc").subscribe(res => {
        expect(res).toEqual(heroes);
      });

      const req = httpTestingController.expectOne("api/heroes/?name=abc");
      expect(req.request.method).toEqual("GET");
      req.flush(heroes);

      httpTestingController.verify();
    });

    it("handles 404 error", () => {
      service.searchHeroes("abc").subscribe(res => {
        expect(res).toEqual([]);
      });

      const req = httpTestingController.expectOne("api/heroes/?name=abc");

      spyOn(console, "error").and.callThrough();

      req.flush("Error", { status: 404, statusText: "Not Found" });

      expect(console.error).toHaveBeenCalled();
      expect(messageService.messages[0]).toContain("Not Found");
    });
  });

  describe("addHero", () => {
    it("adds hero with http post", () => {
      const heroStub: Hero = TestBed.get(Hero);
      service.addHero(heroStub).subscribe(res => {
        expect(res).toEqual(heroStub);
      });

      const req = httpTestingController.expectOne("api/heroes");
      expect(req.request.method).toEqual("POST");
      req.flush(heroStub);

      httpTestingController.verify();
    });

    it("handles 404 error", () => {
      const heroStub: Hero = TestBed.get(Hero);
      service.addHero(heroStub).subscribe(res => {
        expect(res).toEqual(undefined);
      });

      const req = httpTestingController.expectOne("api/heroes");

      spyOn(console, "error").and.callThrough();

      req.flush("Error", { status: 404, statusText: "Not Found" });

      expect(console.error).toHaveBeenCalled();
      expect(messageService.messages[0]).toContain("Not Found");
    });
  });

  describe("updateHero", () => {
    it("updateds hero with http put", () => {
      const heroStub: Hero = TestBed.get(Hero);
      service.updateHero(heroStub).subscribe(res => {
        expect(res).toEqual(heroStub);
      });

      const req = httpTestingController.expectOne("api/heroes");
      expect(req.request.method).toEqual("PUT");
      req.flush(heroStub);

      httpTestingController.verify();
    });

    it("handles 404 error", () => {
      const heroStub: Hero = TestBed.get(Hero);
      service.updateHero(heroStub).subscribe(res => {
        expect(res).toEqual(undefined);
      });

      const req = httpTestingController.expectOne("api/heroes");

      spyOn(console, "error").and.callThrough();

      req.flush("Error", { status: 404, statusText: "Not Found" });

      expect(console.error).toHaveBeenCalled();
      expect(messageService.messages[0]).toContain("Not Found");
    });
  });

  describe("deleteHero", () => {
    it("deletes hero with http del", () => {
      const heroStub: Hero = TestBed.get(Hero);
      heroStub.id = 123;
      service.deleteHero(heroStub).subscribe(res => {
        expect(res).toEqual(heroStub);
      });

      const req = httpTestingController.expectOne("api/heroes/" + heroStub.id);
      expect(req.request.method).toEqual("DELETE");
      req.flush(heroStub);

      httpTestingController.verify();
    });

    it("deletes hero by id with http del", () => {
      const heroStub: Hero = TestBed.get(Hero);
      const id = 123;
      service.deleteHero(id).subscribe(res => {
        expect(res).toEqual(heroStub);
      });

      const req = httpTestingController.expectOne("api/heroes/" + id);
      expect(req.request.method).toEqual("DELETE");
      req.flush(heroStub);

      httpTestingController.verify();
    });

    it("handles 404 error", () => {
      const heroStub: Hero = TestBed.get(Hero);
      service.addHero(heroStub).subscribe(res => {
        expect(res).toEqual(undefined);
      });

      const req = httpTestingController.expectOne("api/heroes");

      spyOn(console, "error").and.callThrough();

      req.flush("Error", { status: 404, statusText: "Not Found" });

      expect(console.error).toHaveBeenCalled();
      expect(messageService.messages[0]).toContain("Not Found");
    });
  });
});
