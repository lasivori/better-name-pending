var express = require('express');
var router = express.Router();

const controller = require('../controller/user-controller');
const {checkAuthenticated, checkNotAuthenticated} = require('../middlewares/auth');

router.get('/', controller.getIndex);
router.get('/games', controller.getGames);
router.get('/game/:id', controller.getGamePage);
router.get('/addgame', checkAuthenticated, controller.getAddGame);
router.post('/addgame', checkAuthenticated, controller.postAddGame);
router.post('/addreview', checkAuthenticated, controller.postAddReview);
router.post('/downloadgame', controller.getDownload);

router.get('/forums', controller.getForums);
router.get('/thread/:id', controller.getThread);
router.get('/addthread', checkAuthenticated, controller.getAddThread);
router.post('/addthread', checkAuthenticated, controller.postAddThread);
router.post('/addcomment', checkAuthenticated, controller.postAddComment);
router.post('/addreply', checkAuthenticated, controller.postAddReply);

router.get('/profile', checkAuthenticated, controller.getProfile);
router.get('/signup', checkNotAuthenticated, controller.getSignUp);
router.post('/signup', checkNotAuthenticated, controller.postSignUp);
router.post('/login', controller.postLogin);
router.post('/logout', checkAuthenticated, controller.postLogout);

module.exports = router;