import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';
import { HeroDetailComponent } from './hero-detail.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  beforeEach(() => {
    const activatedRouteStub = () => ({
      snapshot: { paramMap: { get: () => ({}) } },
    });
    const locationStub = () => ({ back: () => ({}) });
    const heroServiceStub = () => ({
      getHero: (id) => ({
        subscribe: (f) => f({}),
      }),
      updateHero: (hero) => ({ subscribe: (f) => f({}) }),
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [FormsModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Location, useFactory: locationStub },
        { provide: HeroService, useFactory: heroServiceStub },
      ],
    });
    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
  });
  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getHero').and.callThrough();
      component.ngOnInit();
      expect(component.getHero).toHaveBeenCalled();
    });
  });
  describe('getHero', () => {
    it('makes expected calls', () => {
      const heroServiceStub: HeroService = TestBed.inject(HeroService);
      spyOn(heroServiceStub, 'getHero').and.callThrough();
      component.getHero();
      expect(heroServiceStub.getHero).toHaveBeenCalled();
    });
  });
  describe('goBack', () => {
    it('makes expected calls', () => {
      const locationStub: Location = TestBed.inject(Location);
      spyOn(locationStub, 'back').and.callThrough();
      component.goBack();
      expect(locationStub.back).toHaveBeenCalled();
    });
  });
  describe('save', () => {
    it('makes expected calls', () => {
      const heroServiceStub: HeroService = TestBed.inject(HeroService);
      spyOn(component, 'goBack').and.callThrough();
      spyOn(heroServiceStub, 'updateHero').and.callThrough();
      component.save();
      expect(component.goBack).toHaveBeenCalled();
      expect(heroServiceStub.updateHero).toHaveBeenCalled();
    });
  });

  describe('Without a hero', () => {
    it("Doesn't display anything", () => {
      const heroServiceStub = TestBed.inject(HeroService);
      spyOn(heroServiceStub, 'getHero').and.returnValue(of(undefined));
      fixture.detectChanges();
      const anyDiv = fixture.debugElement.query(By.css('div'));
      expect(anyDiv).toBeFalsy();
    });
  });

  describe('With hero', () => {
    beforeEach(() => {
      const heroServiceStub = TestBed.inject(HeroService);
      spyOn(heroServiceStub, 'getHero').and.returnValue(
        of({
          id: 123,
          name: 'Alan',
        })
      );
      fixture.detectChanges();
    });
    it('Displays content when initialized with a hero', () => {
      const anyDiv = fixture.debugElement.query(By.css('div'));
      expect(anyDiv).toBeTruthy();
    });
    it('Has header with hero name in uppercase', () => {
      const header: HTMLHeadingElement = fixture.debugElement.query(
        By.css('h2')
      ).nativeElement;
      expect(header.textContent).toContain('ALAN Details');
    });
    it('Shows hero id', () => {
      const div: HTMLDivElement = fixture.debugElement.query(
        By.css('div div') // first inner div
      ).nativeElement;
      expect(div.textContent).toContain('id: 123');
    });
    it('Has input box with the name', async () => {
      await fixture.whenStable();
      const input: HTMLInputElement = fixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      expect(input.value).toBe('Alan');
    });
    it('Calls location.back() when go back button is clicked', () => {
      const locationStub = TestBed.inject(Location);
      spyOn(locationStub, 'back');
      const button: HTMLButtonElement = fixture.debugElement.query(
        By.css('button') // first button
      ).nativeElement;
      button.click();
      expect(locationStub.back).toHaveBeenCalled();
    });
    it('Updates hero property when user types on the input', () => {
      const input: HTMLInputElement = fixture.debugElement.query(
        By.css('input')
      ).nativeElement;
      input.value = 'ABC';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(component.hero.name).toBe('ABC');
    });
    it('Updates hero then goes back when save button is clicked', () => {
      const heroServiceStub = TestBed.inject(HeroService);
      spyOn(heroServiceStub, 'updateHero').and.returnValue(of(undefined));
      const locationStub = TestBed.inject(Location);
      spyOn(locationStub, 'back');
      const button: HTMLButtonElement = fixture.debugElement.queryAll(
        By.css('button')
      )[1].nativeElement; // second button
      button.click();
      expect(heroServiceStub.updateHero).toHaveBeenCalledWith(component.hero);
      expect(locationStub.back).toHaveBeenCalled();
    });
  });
});
