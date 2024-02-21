const express = require('express');
const router = express.Router();
const { client, authenticate } = require('../lib/stytch-client');

router.use(authenticate);

/* GET home page. */
router.post('/', async function(req, res, next) {
    const { body } = req;

    try {
        await client.magicLinks.email.invite(
            {
                organization_id: req.organization.organization_id,
                email_address: body.email,
                roles: body.roles
            },
            {
              authorization: { session_jwt: req.session_jwt },
            }
        )
        return res.json({ success: true });
    } catch (error) {
        console.error(error);
        return res.json({ success: false }, { status: 400 });
    }
});

module.exports = router;