const express = require('express');
const router = express.Router();

const passport = require('passport');

const loanController = require('../controllers/loan');

router.get(
    '/loans',
    passport.authenticate('jwt', { session: false }),
    loanController.getAllLoans
);

router.get(
    '/loans-statistic',
    passport.authenticate('jwt', { session: false }),
    loanController.getLoansStatistic
);

router.post(
    '/loan-book',
    passport.authenticate('jwt', { session: false }),
    loanController.loanBook
);

module.exports = router;
