const express = require('express');
const router = express.Router();
const { client, authenticate } = require('../lib/stytch-client');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.use(authenticate);

router.get('/', async function(req, res, next) {
    const { organization, member } = req;
    return res.json({ success: true, organization, member });
});

module.exports = router;