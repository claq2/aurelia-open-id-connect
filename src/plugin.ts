import { FrameworkConfiguration, PLATFORM } from "aurelia-framework";
import { UserManager } from "oidc-client";
import OpenIdConnectConfiguration from "./open-id-connect-configuration";
import OpenIdConnectConfigurationManager from "./open-id-connect-configuration-manager";
import OpenIdConnectFactory from "./open-id-connect-factory";
import OpenIdConnectLogger from "./open-id-connect-logger";

export default function (
    frameworkConfig: FrameworkConfiguration,
    callback?: () => OpenIdConnectConfiguration,
    factory?: OpenIdConnectFactory) {

    // register global resources
    frameworkConfig.globalResources([
        PLATFORM.moduleName("./open-id-connect-user-block"),
        PLATFORM.moduleName("./open-id-connect-user-debug"),
    ]);

    // allow userland to change the OIDC configuration
    const userConfig = callback();

    // register logger
    const openIdConnectLogger = factory.createOpenIdConnectLogger(userConfig.logLevel);
    frameworkConfig.container
        .registerInstance(OpenIdConnectLogger, openIdConnectLogger);

    // register userManager
    const userManager = factory.createUserManager(userConfig.userManagerSettings);
    frameworkConfig.container
        .registerInstance(UserManager, userManager);

    // register configuration
    const openIdConnectConfig = factory.createOpenIdConnectConfiguration(userConfig);
    frameworkConfig.container
        .registerInstance(OpenIdConnectConfigurationManager, openIdConnectConfig);

    // register window
    frameworkConfig.container.registerInstance(Window, window);
}
