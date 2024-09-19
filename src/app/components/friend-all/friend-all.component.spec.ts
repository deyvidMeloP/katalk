import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendAllComponent } from './friend-all.component';

describe('FriendAllComponent', () => {
  let component: FriendAllComponent;
  let fixture: ComponentFixture<FriendAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FriendAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
