# This is a raw interop sample for WhatsApp (further WA) custom API
  Current status is concept proof.

## Architectural approach
  Separate script (walauncher.js) to start WA web client, maintain user state in order to save auth info,
  keep it running for convenient development and production.

  REST API service to facilitate interop with WA client from outside.

## How to check
  - issue 'node walauncher.js' command from terminal, wait for WA to start, activate it with mobile client by QRC (as usual)
  - open another teminal session and issue node waservice.js
  - locate localhost:3000/api/scheenshot to make sure service is connected to the client propery.
  - watch consoles if something....

## API summary

GET /api/screenshot
  - returns actual screenshot from WA client - to bypass remote activation by QRC and for troubleshooting.

GET /api/contacts
  - retrives list of contacts

GET /api/messages/:contact
  - retrieves messages from the contact title bypassed (dont forget to url encode it)