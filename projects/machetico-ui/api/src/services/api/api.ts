import { isPlatformServer } from '@angular/common';
import { httpResource, HttpErrorResponse, type HttpResourceRef } from '@angular/common/http';
import { DestroyRef, effect, inject, Injector, PLATFORM_ID, Service, signal } from '@angular/core';
import { API_CONFIG } from '../../api-config';
import { ApiError } from '../../api-error';
import type { ApiCommandMethod, ApiCommandOptions, ApiPendingOperation } from '../../interfaces';
/**
 * Reusable signal-read and explicit-command transport, with no endpoint or session knowledge.
 * Reads are Angular-owned, cancellable and excluded from SSR transfer by default.
 * Commands create one immutable HTTP resource per call and are never retried automatically.
 * @class Api
 */
@Service()
export class Api {
  /**
   * Prevents server rendering from executing mutations.
   * @property server
   */
  private readonly server = isPlatformServer(inject(PLATFORM_ID));

  /**
   * Gateway configuration supplied by the application injector.
   * @property config
   */
  private readonly config = inject(API_CONFIG);
  /**
   * Owning injector for command resources created outside component construction.
   * @property injector
   */
  private readonly injector = inject(Injector);
  /**
   * Pending immutable command completions; completed private responses are never cached.
   * @property pending
   */
  private readonly pending = signal<readonly ApiPendingOperation[]>([]);
  /**
   * Owns cancellation of all pending commands when the environment is destroyed.
   * @property lifetime
   */
  private readonly lifetime = new AbortController();
  /**
   * Registers the completion effect and environment-owned command cancellation.
   * @function constructor
   */
  public constructor() {
    effect(() => {
      for (const operation of this.pending()) operation.complete();
    });
    inject(DestroyRef).onDestroy(() => {
      this.lifetime.abort();
      for (const operation of this.pending()) operation.cancel();
    });
  }
  /**
   * Resolves a path beneath the configured gateway without accepting an arbitrary destination.
   * @function url
   * @param path - Leading-slash API-relative path.
   * @returns URL beneath the application-owned gateway.
   * @throws TypeError for external, malformed or traversing paths.
   */
  private url(path: string): string {
    const decoded = decodeURIComponent(path.split('?')[0]);
    if (
      !path.startsWith('/') ||
      path.startsWith('//') ||
      decoded.includes('\\') ||
      decoded.includes('#') ||
      /(?:^|\/)\.\.(?:\/|$)/.test(decoded)
    )
      throw new TypeError('Expected an API-relative path');
    return (this.config.baseUrl ?? '/api').replace(/\/$/, '') + path;
  }
  /**
   * Creates a reactive GET read. A changed or undefined path cancels the obsolete request.
   * @function read
   * @typeParam T - Response validated by the application's parser.
   * @param path - Reactive API path, or undefined while inactive.
   * @param parse - Runtime validator receiving unknown response data.
   * @returns Page-owned Angular resource with loading, error and reload state.
   */
  public read<T>(
    path: () => string | undefined,
    parse: (value: unknown) => T,
  ): HttpResourceRef<T | undefined> {
    return httpResource<T>(
      () => {
        const current = path();
        return current === undefined
          ? undefined
          : {
              url: this.url(current),
              credentials: this.config.credentials ?? 'same-origin',
              headers: this.config.headers?.(),
              transferCache: false,
              cache: 'no-store',
            };
      },
      { parse },
    );
  }
  /**
   * Creates an explicitly read-only POST lookup without placing its private values in a URL.
   * @function readForm
   * @typeParam T - Validated read-only response.
   * @param path - Application-owned lookup endpoint, never a mutation endpoint.
   * @param body - Reactive lookup snapshot; undefined cancels the read.
   * @param parse - Runtime response validator.
   * @returns Cancellable resource excluded from SSR transfer.
   */
  public readForm<T>(
    path: string,
    body: () => unknown | undefined,
    parse: (value: unknown) => T,
  ): HttpResourceRef<T | undefined> {
    return httpResource<T>(
      () => {
        const current = body();
        return current === undefined
          ? undefined
          : {
              url: this.url(path),
              method: 'POST',
              body: current,
              credentials: this.config.credentials ?? 'same-origin',
              headers: this.config.headers?.(),
              transferCache: false,
              cache: 'no-store',
            };
      },
      { parse },
    );
  }
  /**
   * Reads binary content without persisting or transferring private downloads into SSR HTML.
   * @function readFile
   * @param path - Reactive download path; undefined cancels the read.
   * @returns Page-owned binary HTTP resource.
   */
  public readFile(path: () => string | undefined): HttpResourceRef<Blob | undefined> {
    return httpResource.blob(() => {
      const current = path();
      return current === undefined
        ? undefined
        : {
            url: this.url(current),
            credentials: this.config.credentials ?? 'same-origin',
            headers: this.config.headers?.(),
            transferCache: false,
            cache: 'no-store',
          };
    });
  }
  /**
   * Executes one immutable command through Angular HttpClient and its application interceptors.
   * The command cannot be reloaded and never retries or stores credentials.
   * @function request
   * @typeParam T - Result validated by the application's parser.
   * @param path - Application-owned API-relative endpoint.
   * @param method - Explicit command method.
   * @param body - JSON payload, or FormData for a browser-owned multipart boundary.
   * @param parse - Runtime response validator; Angular supplies null for an empty HTTP 204 body.
   * @param options - Optional caller cancellation.
   * @returns Validated response after exactly one transport attempt.
   * @throws ApiError on non-success status; network, abort and parser failures propagate.
   */
  public async request<T>(
    path: string,
    method: ApiCommandMethod,
    body: unknown,
    parse: (value: unknown) => T,
    options: ApiCommandOptions = {},
  ): Promise<T> {
    if (this.server) throw new Error('Commands cannot execute during server rendering');
    const configuration = {
      url: this.url(path),
      method,
      body,
      credentials: this.config.credentials ?? 'same-origin',
      headers: this.config.headers?.(),
      transferCache: false as const,
      cache: 'no-store' as const,
      redirect: 'error' as const,
    };
    const signal = options.signal
      ? AbortSignal.any([options.signal, this.lifetime.signal])
      : this.lifetime.signal;
    if (signal.aborted) throw signal.reason;
    const request = httpResource<unknown>(() => configuration, { injector: this.injector });
    const payload = await new Promise<unknown>((resolve, reject) => {
      let finished = false;
      let operation: ApiPendingOperation;
      /**
       * Releases the command resource and removes its pending completion.
       * @function cleanup
       */
      const cleanup = (): void => {
        if (finished) return;
        finished = true;
        signal.removeEventListener('abort', cancel);
        this.pending.update((items) => items.filter((item) => item !== operation));
        request.destroy();
      };
      /**
       * Rejects one abandoned command and releases its Angular resource.
       * @function cancel
       */
      const cancel = (): void => {
        cleanup();
        reject(signal.reason ?? new DOMException('Command cancelled', 'AbortError'));
      };
      operation = {
        cancel,
        complete: () => {
          if (finished || request.isLoading()) return;
          const error = request.error();
          if (error) {
            cleanup();
            if (error instanceof HttpErrorResponse) reject(new ApiError(error.status, error.error));
            else reject(error);
          } else if (request.hasValue()) {
            const value: unknown = request.value();
            cleanup();
            resolve(value);
          }
        },
      };
      this.pending.update((items) => [...items, operation]);
      signal.addEventListener('abort', cancel, { once: true });
      if (signal.aborted) cancel();
    });
    return parse(payload);
  }
}
