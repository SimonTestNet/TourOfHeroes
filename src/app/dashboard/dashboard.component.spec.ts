import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HeroService } from '../hero.service';
import { DashboardComponent } from './dashboard.component';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  beforeEach(() => {
    const heroServiceStub = { getHeroes: () => ({ subscribe: () => ({}) }) };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DashboardComponent],
      providers: [{ provide: HeroService, useValue: heroServiceStub }],
    });
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  it('heroes defaults to: []', () => {
    expect(component.heroes).toEqual([]);
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getHeroes').and.callThrough();
      component.ngOnInit();
      expect(component.getHeroes).toHaveBeenCalled();
    });
  });
  describe('getHeroes', () => {
    it('makes expected calls', () => {
      const heroServiceStub: HeroService = TestBed.inject(HeroService);
      spyOn(heroServiceStub, 'getHeroes').and.callThrough();
      component.getHeroes();
      expect(heroServiceStub.getHeroes).toHaveBeenCalled();
    });
  });

  it('renders the links with the right hrefs and names', () => {
    const heroServiceStub = TestBed.inject(HeroService);
    const initialHeroes = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
      { id: 4, name: 'D' },
      { id: 5, name: 'E' },
      { id: 6, name: 'F' },
    ];
    spyOn(heroServiceStub, 'getHeroes').and.returnValue(of(initialHeroes));

    fixture.detectChanges();

    const links = fixture.debugElement
      .queryAll(By.css('a'))
      .map<HTMLAnchorElement>((element) => element.nativeElement);
    expect(links.length).toBe(4);

    const expectedHeroes = [
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
      { id: 4, name: 'D' },
      { id: 5, name: 'E' },
    ];

    const expectedHeroesAreRendered = expectedHeroes.every((hero) =>
      links.some(
        (link) =>
          link.attributes.getNamedItem('href').value === `/detail/${hero.id}` &&
          link.innerHTML.includes(hero.name)
      )
    );
    expect(expectedHeroesAreRendered).toBe(true);
  });
});
