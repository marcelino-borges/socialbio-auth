export const keycloakConfig = {
  user: {
    realm: process.env.KEYCLOAK_REALM || "",
    authServerUrl: process.env.KEYCLOAK_AUTH_SERVER_URL || "",
    clientId: process.env.KEYCLOAK_AUTH_CLIENT_ID || "",
    secret: process.env.KEYCLOAK_AUTH_CLIENT_SECRET || "",
  },
  masterAdmin: {
    realm: process.env.KEYCLOAK_MASTER_REALM || "",
    authServerUrl: process.env.KEYCLOAK_AUTH_SERVER_URL || "",
    clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID || "",
    secret: process.env.KEYCLOAK_ADMIN_SECRET || "",
    username: process.env.KEYCLOAK_ADMIN_REGISTER_USER || "",
    password: process.env.KEYCLOAK_ADMIN_REGISTER_PASSWORD || "",
  },
};
