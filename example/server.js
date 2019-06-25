const express = require('express')
const bodyParser = require('body-parser')
const portfinder = require('portfinder')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const app = express()
const compiler = webpack(WebpackConfig)
const router = express.Router()
app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))
app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
router.get('/simple/get', function(req, res) {
  res.json({
    msg: `hello world`
  })
})
app.post('/post', function (req, res) {
  res.json({code: 0, data: req.body})
})
router.post('/base/post', function(req, res) {
  res.json({code: 0, data: typeof req})
})

router.post('/base/buffer', function(req, res) {
  let msg = []
  req.on('data', (chunk) => {
    if (chunk) {
      msg.push(chunk)
    }
  })
  req.on('end', () => {
    let buf = Buffer.concat(msg)
    res.json(buf.toJSON())
  })
})
router.get('/base/get', function(req, res) {
  res.json({
    code: 0,
    msg: 'success'
  })
})
router.get('/error/get', function(req, res) {
  if (Math.random() > 0.5) {
    res.json({
      msg: `hello world`
    })
  } else {
    res.status(500)
    res.end()
  }
})

router.get('/error/timeout', function(req, res) {
  setTimeout(() => {
    res.json({
      msg: `hello world`
    })
  }, 3000)
})
app.use(router)
module.exports = new Promise(resolve => {
  portfinder.basePort = process.env.PORT || 8080
  portfinder.getPort(function (err, port) {
    //
    // `port` is guaranteed to be a free port
    // in this scope.
    //
    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
    })
    resolve(app)
  })
})
