const { getData } = require('../controllers/analysis.controller')

const router = require('express').Router()
const verifyAdmin = require('../middleware/verifyAdmin')
const verifyToken = require('../middleware/verifyToken')

router.use(verifyToken)
router.use(verifyAdmin)
router.route('/:year').get(getData)

module.exports = router
