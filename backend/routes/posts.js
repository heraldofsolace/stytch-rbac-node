const express = require('express');
const router = express.Router();
const { client, authenticate } = require('../lib/stytch-client');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.use(authenticate);

router.get('/', async function(req, res, next) {
    const { organization } = req;
    const posts = await prisma.post.findMany({
        where: {
            organization: organization.organization_id
        }
    })
    return res.json({ success: true, posts });
});

router.post('/', async function(req, res, next) {
    const { member, organization } = req;

    const data = req.body;
    const post = await prisma.post.create({
        data: {
            title: data.title,
            content: data.content,
            authorEmail: member.email_address,
            organization: organization.organization_id
        }
    });

    return res.json({ success: true, post });
});

router.get('/:id', async function(req, res, next) {
    const { id } = req.params;
    const { organization } = req;

    const post = await prisma.post.findUnique({
        where: {
            id: parseInt(id),
            organization: organization.organization_id
        }
    });

    return res.json({ success: true, post });
});

router.put('/:id', async function(req, res, next) {
    const { id } = req.params;
    const { organization } = req;
    const data = req.body;

    const post = await prisma.post.update({
        where: {
            id: parseInt(id),
            organization: organization.organization_id
        },
        data
    });

    return res.json({ success: true, post });
});

router.delete('/:id', async function(req, res, next) {
    const { id } = req.params;
    const { organization } = req;

    await prisma.post.delete({
        where: {
            id: parseInt(id),
            organization: organization.organization_id
        }
    });

    return res.json({ success: true });
});

module.exports = router;