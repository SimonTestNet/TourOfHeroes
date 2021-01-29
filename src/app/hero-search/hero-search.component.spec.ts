import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks,
} from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HeroService } from '../hero.service';
import { HeroSearchComponent } from './hero-search.component';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
describe('HeroSearchComponent', () => {
  let component: HeroSearchComponent;
  let fixture: ComponentFixture<HeroSearchComponent>;
  beforeEach(() => {
    const heroServiceStub = () => ({ searchHeroes: (term) => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [RouterTestingModule], // To make the router work
      declarations: [HeroSearchComponent],
      providers: [{ provide: HeroService, useFactory: heroServiceStub }],
    });
    fixture = TestBed.createComponent(HeroSearchComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it('Starts with an empty list', () => {
    fixture.detectChanges();
    const links: Array<HTMLAnchorElement> = fixture.debugElement
      .queryAll(By.css('a'))
      .map((a) => a.nativeElement);
    expect(links.length).toBe(0);
  });

  it('Typing on the input box doesn’t change the list for 299ms', fakeAsync(() => {
    fixture.detectChanges(); // Trigger the lifecycle

    // Setup our dependencies
    const heroServiceStub: HeroService = TestBed.inject(HeroService);
    spyOn(heroServiceStub, 'searchHeroes').and.returnValue(
      of([{ id: 1, name: 'Alan' }])
    );

    // Action
    const input: HTMLInputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;
    input.value = 'A';
    input.dispatchEvent(new Event('input'));
    tick(299);
    fixture.detectChanges(); // Update HTML

    const links: Array<HTMLAnchorElement> = fixture.debugElement
      .queryAll(By.css('a'))
      .map((a) => a.nativeElement);

    expect(links.length).toBe(0);

    // Prevent Error: 1 periodic timer(s) still in the queue.
    discardPeriodicTasks();
  }));

  it('The list of matching heroes appears after 300ms', fakeAsync(() => {
    fixture.detectChanges(); // Trigger the lifecycle
    const heroServiceStub: HeroService = TestBed.inject(HeroService);

    spyOn(heroServiceStub, 'searchHeroes').and.returnValue(
      of([
        { id: 2, name: 'Brito' },
        { id: 3, name: 'Britton' },
      ])
    );

    const input: HTMLInputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;
    input.value = 'Brit';
    input.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();
    const links: Array<HTMLAnchorElement> = fixture.debugElement
      .queryAll(By.css('a'))
      .map((a) => a.nativeElement);
    expect(links.length).toBe(2);
    expect(links[0].textContent).toContain('Brito');
    expect(links[1].textContent).toContain('Britton');
  }));

  it('Can perform multiple searches in a row - 300ms apart', fakeAsync(() => {
    fixture.detectChanges(); // Trigger the lifecycle
    const heroServiceStub: HeroService = TestBed.inject(HeroService);

    spyOn(heroServiceStub, 'searchHeroes').and.callFake((term) => {
      return of(
        [
          { id: 1, name: 'Alan' },
          { id: 2, name: 'Brito' },
          { id: 3, name: 'Britton' },
        ].filter((hero) => hero.name.includes(term))
      );
    });

    const input: HTMLInputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;

    // Search for the first time
    input.value = 'Brit';
    input.dispatchEvent(new Event('input'));
    tick(300);

    // Narrow the search
    input.value = 'Brito';
    input.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();

    const links: Array<HTMLAnchorElement> = fixture.debugElement
      .queryAll(By.css('a'))
      .map((a) => a.nativeElement);
    expect(links.length).toBe(1);
    expect(links[0].textContent).toContain('Brito');
    expect(links[0].getAttribute('href')).toBe('/detail/2');
  }));

  it("Doesn't perform a search if the search term doesn't change", fakeAsync(() => {
    fixture.detectChanges(); // Trigger the lifecycle
    const heroServiceStub: HeroService = TestBed.inject(HeroService);

    spyOn(heroServiceStub, 'searchHeroes').and.callFake((term) => {
      return of(
        [
          { id: 1, name: 'Alan' },
          { id: 2, name: 'Brito' },
          { id: 3, name: 'Britton' },
        ].filter((hero) => hero.name.includes(term))
      );
    });

    const input: HTMLInputElement = fixture.debugElement.query(By.css('input'))
      .nativeElement;

    // Search for the first time
    input.value = 'Brit';
    input.dispatchEvent(new Event('input'));
    tick(300);

    // Trigger the input's change event again
    input.dispatchEvent(new Event('input'));
    tick(300);
    fixture.detectChanges();

    expect(heroServiceStub.searchHeroes).toHaveBeenCalledTimes(1);
  }));
});
