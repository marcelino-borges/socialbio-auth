Keycloak:
1. `docker-compose up`
2. Create realm called `socialbio-dev` or `socialbio-qa` or `socialbio-prod`
3. Open Keycloak admin panel
4. Go to Realm Settings and set:
   1. General:
      - Name: `socialbio-dev`
	  
   2. Email:
      - Host: `mail.devbox.eng.br`
	  - Port: `465`
	  - From Display Name: `SocialBio`
	  - From: `socialbio.webmaster@devbox.eng.br`
5. Go to Clients and create a new client for the auth MS
6. Go to Roles and create `user` and `admin` roles
7. Go to realm Master and create a new user called `admin-register` with a new password (preferrably a 256 bits encrypted key) - Save both to the socialbio-auth MS .env.
8. Make sure that the user `admin-register` has `admin` and `default-roles-master` in his assigned roles.
9. Make sure the realm Master has a client called `admin-cli` and save its client_secret to socialbio-auth .env.
10. In realm Master, go to clients and make sure that `Direct Access Grants Enabled` and `Service Accounts Enabled` are ON and `Access Type` is `confidential`.
11. Go to `Authentication` and then `Password Policies` and set the policies
