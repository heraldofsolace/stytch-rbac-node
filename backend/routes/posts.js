const express = require('express');
const router = express.Router();
const { client, authenticate, authorize } = require('../lib/stytch-client');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.use(authenticate);

router.get('/', async function(req, res, next) {
    const { organization, session_jwt } = req;
    const { authorized } = await authorize(session_jwt, {
        organization_id: organization.organization_id,
        resource_id: 'post',
        action: 'read',
    });

    if(!authorized) return res.status(403).json({ success: false, message: 'Unauthorized' });

    const posts = await prisma.post.findMany({
        where: {
            organization: organization.organization_id
        }
    })
    return res.json({ success: true, posts });
});

router.post('/', async function(req, res, next) {
    const { member, organization, session_jwt } = req;
    
    const { authorized } = await authorize(session_jwt, {
        organization_id: organization.organization_id,
        resource_id: 'post',
        action: 'create',
    });

    if(!authorized) return res.status(403).json({ success: false, message: 'Unauthorized' });

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
    const { organization, session_jwt } = req;
    
    const { authorized } = await authorize(session_jwt, {
        organization_id: organization.organization_id,
        resource_id: 'post',
        action: 'read',
    });

    if(!authorized) return res.status(403).json({ success: false, message: 'Unauthorized' });

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
    const { organization, session_jwt } = req;

    const { authorized } = await authorize(session_jwt, {
        organization_id: organization.organization_id,
        resource_id: 'post',
        action: 'update',
    });

    if(!authorized) return res.status(403).json({ success: false, message: 'Unauthorized' });

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
    const { organization, session_jwt } = req;

    const { authorized } = await authorize(session_jwt, {
        organization_id: organization.organization_id,
        resource_id: 'post',
        action: 'delete',
    });

    if(!authorized) return res.status(403).json({ success: false, message: 'Unauthorized' });


    await prisma.post.delete({
        where: {
            id: parseInt(id),
            organization: organization.organization_id
        }
    });

    return res.json({ success: true });
});

module.exports = router;