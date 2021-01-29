import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';
describe('MessageService', () => {
  let service: MessageService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [MessageService] });
    service = TestBed.inject(MessageService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });

  it('messages defaults to: []', () => {
    expect(service.messages).toEqual([]);
  });

  it('adds a message', () => {
    service.add('ABC');
    expect(service.messages).toEqual(['ABC']);
  });

  it('clears all messages', () => {
    service.add('ABC');
    service.clear();
    expect(service.messages).toEqual([]);
  });
});
