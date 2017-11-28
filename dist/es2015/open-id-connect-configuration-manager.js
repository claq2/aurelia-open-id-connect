const defaultClientUri = 'https://localhost:9000';
export default class {
    constructor(dto) {
        this._loginRedirectModuleId = '/';
        this._logoutRedirectModuleId = '/';
        this._userManagerSettings = {
            authority: 'https://localhost:5000',
            client_id: 'Aurelia.OpenIdConnect',
            loadUserInfo: true,
            post_logout_redirect_uri: `${defaultClientUri}/signout-oidc`,
            redirect_uri: `${defaultClientUri}/signin-oidc`,
            response_type: 'id_token token',
            scope: 'openid email roles profile',
            silent_redirect_uri: `${defaultClientUri}/signin-oidc`,
        };
        if (!dto) {
            return;
        }
        Object.keys(dto).forEach((k) => {
            this['_' + k] = dto[k];
        });
        if (!dto.userManagerSettings) {
            return;
        }
        Object.keys(dto.userManagerSettings).forEach((k) => {
            this.userManagerSettings[k] = dto.userManagerSettings[k];
        });
    }
    get loginRedirectModuleId() {
        return this._loginRedirectModuleId;
    }
    get logoutRedirectModuleId() {
        return this._logoutRedirectModuleId;
    }
    get unauthorizedRedirectModuleId() {
        return this._unauthorizedRedirectModuleId;
    }
    get logLevel() {
        return this._logLevel;
    }
    get userManagerSettings() {
        return this._userManagerSettings;
    }
    get redirectUri() {
        return this._userManagerSettings.redirect_uri;
    }
    get postLogoutRedirectUri() {
        return this._userManagerSettings.post_logout_redirect_uri;
    }
}
//# sourceMappingURL=open-id-connect-configuration-manager.js.map