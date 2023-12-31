const express = require('express')
const { ApolloServer } = require('apollo-server-express');
const path = require('path')

const {typeDefs, resolvers} = require('./schemas/')
const db = require('./config/connection')

const {authMiddleware} = require('./utils/auth')

const PORT = process.env.PORT || 3001

const app = express()

const server = new ApolloServer({
    instrospection: true,
    typeDefs,
    resolvers,
    context: authMiddleware,
    formatError: (error) => error,
})
server.applyMiddleware({app, path: 'graphql'})

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/images', express.static(path.join(__dirname, '../client/public/images')))

app.use('public', express.static(path.join(__dirname, '../client/public')))
if(process.env.NODE_ENV === 'production') {
    app.use(express.status(path.join(__dirname, '..client/build')))
}

app.get('*', (req,res)=>{
    res.sendFile(path.join(__dirname, '..client/build/index.html'))
})

db.once('open', ()=> {
    app.listen(PORT, ()=> {
        console.log(`
        Server Is Running!!
        Listening on port ${PORT}
        Explore at http://localhost:${PORT}${server.graphqlPath}`)
    })
})