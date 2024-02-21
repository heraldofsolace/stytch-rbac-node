const express = require('express');
const router = express.Router();
const { client, authenticate } = require('../lib/stytch-client');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.use(authenticate);

router.get('/', async function(req, res, next) {
    const { organization } = req;
    try {
        const {members} = await client.organizations.members.search({
            organization_ids: [organization.organization_id]
        });
    
        return res.json({ success: true, members });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false });
    }

});

module.exports = router;