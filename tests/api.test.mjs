import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect } from 'vitest';
import {
  Api,
  ApiError,
  provideMacheticoApi,
} from '../dist/machetico-ui/fesm2022/machetico-ui-api.mjs';
function setup() {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideMacheticoApi({ baseUrl: '/gateway' }),
    ],
  });
  return { api: TestBed.inject(Api), http: TestBed.inject(HttpTestingController) };
}
const parse = (value) => {
  if (!value || typeof value !== 'object' || !('name' in value) || typeof value.name !== 'string')
    throw new TypeError('Invalid projection');
  return value.name;
};
describe('optional generic API', () => {
  it('uses validated Angular read resources without private SSR transfer', async () => {
    const { api, http } = setup();
    const resource = TestBed.runInInjectionContext(() => api.read(() => '/items', parse));
    TestBed.tick();
    const req = http.expectOne('/gateway/items');
    expect(req.request.transferCache).toBe(false);
    req.flush({ name: 'synthetic' });
    await TestBed.inject((await import('@angular/core')).ApplicationRef).whenStable();
    TestBed.tick();
    expect(resource.value()).toBe('synthetic');
    http.verify();
  });
  it('runs a command once through Angular HTTP without retrying a server failure', async () => {
    const { api, http } = setup();
    const result = api.request('/items', 'POST', { name: 'synthetic' }, parse);
    const rejected = expect(result).rejects.toBeInstanceOf(ApiError);
    TestBed.tick();
    const req = http.expectOne('/gateway/items');
    expect(req.request.method).toBe('POST');
    req.flush({ error: 'failure' }, { status: 503, statusText: 'Unavailable' });
    TestBed.tick();
    await rejected;
    http.expectNone('/gateway/items');
    http.verify();
  });
  it('rejects invalid response data and releases its command resource', async () => {
    const { api, http } = setup();
    const result = api.request('/items', 'POST', {}, parse);
    const rejected = expect(result).rejects.toThrow('Invalid projection');
    TestBed.tick();
    http.expectOne('/gateway/items').flush({ wrong: true });
    TestBed.tick();
    await rejected;
    http.verify();
  });
  it('cancels caller-aborted commands', async () => {
    const { api, http } = setup();
    const controller = new AbortController();
    const result = api.request('/items', 'POST', {}, parse, { signal: controller.signal });
    const rejected = expect(result).rejects.toMatchObject({ name: 'AbortError' });
    TestBed.tick();
    const req = http.expectOne('/gateway/items');
    controller.abort();
    await rejected;
    expect(req.cancelled).toBe(true);
    http.verify();
  });
  it('resolves HTTP 204 through the caller parser', async () => {
    const { api, http } = setup();
    const result = api.request('/items', 'DELETE', undefined, (value) =>
      value === null ? 'removed' : 'unexpected',
    );
    TestBed.tick();
    http.expectOne('/gateway/items').flush(null, { status: 204, statusText: 'No Content' });
    TestBed.tick();
    await expect(result).resolves.toBe('removed');
    http.verify();
  });
  it('cancels pending commands when the owning environment is destroyed', async () => {
    const { api, http } = setup();
    const result = api.request('/items', 'POST', {}, parse);
    const rejected = expect(result).rejects.toMatchObject({ name: 'AbortError' });
    TestBed.tick();
    const req = http.expectOne('/gateway/items');
    TestBed.resetTestingModule();
    await rejected;
    expect(req.cancelled).toBe(true);
  });
});
