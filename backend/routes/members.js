const express = require('express');
const router = express.Router();
const { client, authenticate } = require('../lib/stytch-client');
const { PrismaClient } = require('@prisma/client');
const { revokeSession } = require('../lib/session-utils');

const prisma = new PrismaClient();

router.use(authenticate);

router.get('/', async function(req, res, next) {
    const { organization } = req;
    try {
        const {members} = await client.organizations.members.search({
            organization_ids: [organization.organization_id]
        },
        {
          authorization: { session_jwt: req.session_jwt },
        });
    
        return res.json({ success: true, members });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }

});

router.delete('/logout', async function(req, res, next) {
    await revokeSession(req, res, client);
    return res.json({ success: true });
});

module.exports = router;