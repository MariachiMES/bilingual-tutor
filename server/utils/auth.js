const jwt = require('jsonwebtoken')
require('dotenv').config()
const secret = process.env.JWT_SECRET
const expiration = '6h'

module.exports = {
    authMiddleware: function({req}) {
        let token = req.body.token || req.query.token || req.headers.authorization
        if(req.headers.authorization) {
            token = token.split(" ").pop().trim()
            console.log(token)
        }

        if (!token) {
            return req
        }

        try {
            const {data} = jwt.verify(token, secret, {maxAge: expiration})
            req.user = data;
            console.log('good token')
        }

        catch {
            console.log('not a good token')
        }
        return req
    },

    signToken: function({username, email, _id}) {
        const payload = {username, email, _id}
        return jwt.sign({data: payload}, secret, {expiresIn: expiration})
    }
}