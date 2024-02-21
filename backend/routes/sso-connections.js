const express = require('express');
const router = express.Router();
const { client, authenticate } = require('../lib/stytch-client');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.use(authenticate);

router.get('/', async function(req, res, next) {
    const { organization } = req;

    const { saml_connections } = await client.sso.getConnections(
        {
          organization_id: organization.organization_id,
        },
      );
    
      if (saml_connections) {
        return res.json({ connections: saml_connections });
      }
    
      return res.status(500).json({ error: "An error occurred" });
});


router.post('/', async function(req, res, next) {
    const { organization, body } = req;

    const { connection } = await client.sso.saml.createConnection(
        {
          organization_id: organization.organization_id,
          display_name: body.display_name,
        },
      );
    
      if (connection) {
        await client.organizations.update(
          {
            organization_id: organization.organization_id,
            sso_jit_provisioning: "RESTRICTED",
            sso_default_connection_id: connection.connection_id,
            sso_jit_provisioning_allowed_connections: [
              ...organization.sso_jit_provisioning_allowed_connections,
              connection.connection_id,
            ],
          },
        );
    
        return res.json({ connection });
      }
    
      return res.status(500).json({ error: "An error occurred" });
});

router.put('/', async function(req, res, next) {
    const {organization, body} = req;
    const { connection } = await client.sso.saml.updateConnection(
        {
            organization_id: organization.organization_id,
            ...body,
        },
    );

    return res.json({ connection });
});

module.exports = router;