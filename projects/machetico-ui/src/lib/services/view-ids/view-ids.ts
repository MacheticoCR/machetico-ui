import { Service } from '@angular/core';

/**
 * Allocates accessible view identifiers within one application injector.
 *
 * @remarks
 * Each SSR request starts its own sequence, matching a fresh hydrating browser. No counter or
 * user state is shared between requests.
 * @class ViewIds
 */
@Service()
export class ViewIds {
  /**
   * Next instance number owned by this application.
   * @property sequence
   */
  private sequence = 0;

  /**
   * Allocates the next stable identifier in view creation order.
   * @function next
   * @param prefix - Component-specific prefix for the accessible relationship.
   * @returns A unique identifier within the current application.
   */
  public next(prefix: string): string {
    return `${prefix}-${this.sequence++}`;
  }
}
