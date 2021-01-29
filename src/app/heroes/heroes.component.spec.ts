import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeroesComponent } from './heroes.component';
import { By } from '@angular/platform-browser';
import { HeroService } from '../hero.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Hero } from '../hero';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;

  beforeEach(() => {
    const heroStub = () => ({});
    const heroServiceStub = () => ({
      getHeroes: () => ({ subscribe: (f) => f({}) }),
      addHero: (hero) => ({ subscribe: (f) => f({}) }),
      deleteHero: (hero) => ({}),
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HeroesComponent],
      providers: [
        { provide: Hero, useFactory: heroStub },
        { provide: HeroService, useFactory: heroServiceStub },
      ],
    });
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Use Cases', () => {
    beforeEach(() => {
      const heroServiceStub = TestBed.inject(HeroService);
      spyOn(heroServiceStub, 'getHeroes').and.returnValue(
        of([
          {
            id: 1,
            name: 'Alan',
          },
          {
            id: 2,
            name: 'Brito',
          },
        ])
      );
      fixture.detectChanges();
    });

    it('Starts with the list of heroes returned by getHeroes, with link ref, id, and name', () => {
      const links: Array<HTMLAnchorElement> = fixture.debugElement
        .queryAll(By.css('a'))
        .map((a) => a.nativeElement);

      expect(links.length).toBe(2);

      expect(links[0].textContent).toContain('1 Alan');
      expect(links[0].getAttribute('href')).toBe('/detail/1');

      expect(links[1].textContent).toContain('2 Brito');
      expect(links[1].getAttribute('href')).toBe('/detail/2');
    });

    it('Clicking the delete button removes the hero from the list and calls deleteHero', () => {
      const heroServiceStub = TestBed.inject(HeroService);
      spyOn(heroServiceStub, 'deleteHero').and.returnValue(of());

      const delButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('button.delete')
      ).nativeElement;
      delButton.click();
      fixture.detectChanges();

      const links: Array<HTMLAnchorElement> = fixture.debugElement
        .queryAll(By.css('a'))
        .map((a) => a.nativeElement);

      expect(links.length).toBe(1);
      expect(links[0].textContent).toContain('2 Brito');
      expect(links[0].getAttribute('href')).toBe('/detail/2');

      expect(heroServiceStub.deleteHero).toHaveBeenCalled();
    });

    it("Clicking the add button on a an empty textbox doesn't add to the list", () => {
      const heroServiceStub = TestBed.inject(HeroService);
      spyOn(heroServiceStub, 'addHero');

      const addButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('div > button')
      ).nativeElement;
      addButton.click();
      fixture.detectChanges();

      expect(heroServiceStub.addHero).not.toHaveBeenCalled();
    });

    it("Clicking the add button on textbox with blank spaces doesn't add to the list", () => {
      const heroServiceStub = TestBed.inject(HeroService);
      spyOn(heroServiceStub, 'addHero');

      const input: HTMLInputElement = fixture.debugElement.query(
        By.css('input')
      ).nativeElement;

      input.value = '   ';
      input.dispatchEvent(new Event('input'));

      const addButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('div > button')
      ).nativeElement;
      addButton.click();
      fixture.detectChanges();

      expect(heroServiceStub.addHero).not.toHaveBeenCalled();
    });

    it('Clicking the add button adds the hero to the list and clears the textbox', () => {
      const heroServiceStub = TestBed.inject(HeroService);
      spyOn(heroServiceStub, 'addHero').and.returnValue(
        of({
          id: 3,
          name: 'Cesar',
        })
      );

      const input: HTMLInputElement = fixture.debugElement.query(
        By.css('input')
      ).nativeElement;

      input.value = 'Cesar';
      input.dispatchEvent(new Event('input'));

      const addButton: HTMLButtonElement = fixture.debugElement.query(
        By.css('div > button')
      ).nativeElement;
      addButton.click();
      fixture.detectChanges();

      const links: Array<HTMLAnchorElement> = fixture.debugElement
        .queryAll(By.css('a'))
        .map((a) => a.nativeElement);

      expect(links.length).toBe(3);
      expect(links[2].textContent).toContain('3 Cesar');
      expect(links[2].getAttribute('href')).toBe('/detail/3');
    });
  });
});
