import { autoinject } from 'aurelia-framework';
import {
  NavigationInstruction,
  Next,
  PipelineStep,
  Redirect,
} from 'aurelia-router';
import { UserManager } from 'oidc-client';
import OpenIdConnectConfigurationManager from './open-id-connect-configuration-manager';
import OpenIdConnectLogger from './open-id-connect-logger';
import OpenIdConnectRoles from './open-id-connect-roles';

@autoinject
export default class OpenIdConnectAuthorizeStep implements PipelineStep {

  constructor(
    private userManager: UserManager,
    private configuration: OpenIdConnectConfigurationManager,
    private logger: OpenIdConnectLogger) { }

  public async run(
    navigationInstruction: NavigationInstruction,
    next: Next): Promise<any> {

    const user = await this.userManager.getUser();

    // TODO: Make this open for extension,
    // so that user-land can configure multiple, arbitrary roles.
    if (this.requiresRole(navigationInstruction, OpenIdConnectRoles.Authenticated)) {
      if (user === null) {
        this.logger.debug('Requires authenticated role.');
        const redirect = new Redirect(this.configuration.unauthorizedRedirectRoute);
        return next.cancel(redirect);
      }
    }

    return next();
  }

  private requiresRole(
    navigationInstruction: NavigationInstruction,
    role: OpenIdConnectRoles): boolean {

    const instructions = navigationInstruction.getAllInstructions();
    return instructions.some((instruction) =>
      instruction !== undefined &&
      instruction.config !== undefined &&
      instruction.config.settings !== undefined &&
      instruction.config.settings.roles !== undefined &&
      instruction.config.settings.roles.includes(role));
  }
}
