import { TestBed } from '@angular/core/testing';

import { ChangeChatService } from './change-chat.service';

describe('ChangeChatService', () => {
  let service: ChangeChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChangeChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
