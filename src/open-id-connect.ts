import { autoinject } from "aurelia-framework";
import { RouterConfiguration } from "aurelia-router";
import { User, UserManager, UserManagerEvents } from "oidc-client";
import { UserManagerEventHandler, UserManagerEventsAction } from "./internal-types";
import OpenIdConnectLogger from "./open-id-connect-logger";
import OpenIdConnectRouting from "./open-id-connect-routing";

@autoinject
export default class OpenIdConnect {

    constructor(
        private openIdConnectRouting: OpenIdConnectRouting,
        public logger: OpenIdConnectLogger,
        public userManager: UserManager) { }

    public configure(routerConfiguration: RouterConfiguration) {

        if (typeof routerConfiguration === "undefined" || routerConfiguration === null) {
            throw new Error("routerConfiguration parameter must not be undefined or null");
        }

        this.openIdConnectRouting.configureRouter(routerConfiguration);
    }

    public async login(): Promise<void> {
        const args: any = {};
        await this.userManager.signinRedirect(args);
    }

    public async logout(): Promise<void> {
        const args: any = {};
        try {
            await this.userManager.signoutRedirect(args);
        } catch (err) {
            if (err.message === "no end session endpoint") {
                this.logger.debug(err);
                this.logger.debug("The user remains logged in at the authorization server.");
            } else {
                throw err;
            }
        }
    }

    public loginSilent(): Promise<User> {
        const args: any = {};
        return this.userManager.signinSilent(args);
    }

    public getUser(): Promise<User> {
        return this.userManager.getUser();
    }

    public addOrRemoveHandler(
        key: keyof UserManagerEvents,
        handler: UserManagerEventHandler) {

        if (!key.startsWith("add") && !key.startsWith("remove")) {
            let message = "The 'addOrRemoveHandlers' method expects a 'key' argument ";
            message += "that starts with either 'add' or 'remove'. Instead we ";
            message += "recevied " + key;
            throw new TypeError(message);
        }

        const addOrRemove: UserManagerEventsAction =
            this.userManager.events[key]
                .bind(this.userManager.events);

        addOrRemove(handler);
    }
}
