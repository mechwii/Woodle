import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerUeComponent } from './banner-ue.component';

describe('BannerUeComponent', () => {
  let component: BannerUeComponent;
  let fixture: ComponentFixture<BannerUeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerUeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerUeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
