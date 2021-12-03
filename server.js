//model
const Comments = require('./models/commentModel')

//import libary and config
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io')


dotenv.config()
const url = process.env.MONGODB_URL
const server = http.createServer(app)
const io = new Server(server)



//Connect database
// mongoose.connect(url)
//     .then(e => console.log('Connect DB succeed'))
//     .catch(err => console.log("Connect DB false"))

mongoose.connect('mongodb+srv://admin:huy16120101@cluster0.rwzsn.mongodb.net/MERN_COMMENT_SOCKET?retryWrites=true&w=majority').then(result => {
    console.log(' Connect DB success')
}).catch(error => {
    console.log('connect false')
})

//app use midleware
app.use(express.json())
app.use(cors())
app.use(express.urlencoded())

//Routes
app.get("/", (req, res) => {
    res.send("Hello wold!")
})

app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/commentRouter'))

//Use socket
let users = []
io.on('connection', (socket) => {
    console.log(`A user has socket id is ${socket.id} connected`);

    socket.on('joinRoom', id => {
        const user = {
            userId: socket.id,
            room: id
        }

        const check = users.every(user => user.userId !== socket.id)

        if (check) {
            users.push(user)
            socket.join(user.room)
        } else {
            users.map(user => {
                if (user.userId === socket.id) {
                    if (user.roomId !== id) {
                        socket.leave(user.room)
                        socket.join(id)
                        user.room = id
                    }
                }
            })
        }

        console.log("huy", users);
    })

    socket.on('createComment', async msg => {
        console.log(msg);
        const { username, content, product_id, createdAt, rating, send, commentId } = msg

        const newComment = new Comments({
            username, content, product_id, createdAt, rating
        })

        if (send === 'replyComment') {
            const { _id, username, content, product_id, createdAt, rating } = newComment

            const comment = await Comments.findById(commentId)

            if (comment) {
                comment.reply.push({ _id, username, content, createdAt, rating })
                await comment.save()
                io.to(product_id).emit('sendReplyCommentToClient', comment)
            }
        } else {
            await newComment.save()
            io.to(product_id).emit('sendCommentToClient', newComment)
        }

    })

    socket.on('disconnect', () => {
        console.log(socket.id + "disconnected");
        users = users.filter(user => user.userId != socket.id)
    })
})

//Server Listen
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`App listen at http://localhost:${PORT}`);
})