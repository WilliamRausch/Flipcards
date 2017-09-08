const express = require("express");
const Card = require("../models/index").Card;
const Deck = require("../models/index").Deck;
const router = express.Router();
const bcrypt = require("bcrypt");

let deckCards;
let qCard;
let qDeck;
let index = 1;
let counter = 0;
let deckNum;

const isAuthenticated = function (req, res, next) {
  console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('error', 'You have to be logged in to access the page.')
    res.redirect('/')
  }

router.get("/", function(req, res) {
  res.render("login", {
      messages: res.locals.getMessages()
  });
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/',
    failureFlash: true
}));

router.get("/signup", function(req, res) {
  res.render("signup");
});

router.post("/signup", function(req, res) {
   username = req.body.username
  password = req.body.password
  name = req.body.name

  if (!username || !password) {
    req.flash('error', "Please, fill in all the fields.")
    res.redirect('signup')
  }

  let salt = bcrypt.genSaltSync(10)
  let hashedPassword = bcrypt.hashSync(password, salt)

  let newUser = {
    username: username,
    salt: salt,
    name: name,
    password: hashedPassword
  }

  User.create(newUser).then(function() {
    res.redirect('/')
  }).catch(function(error) {
    req.flash('error', "Please, choose a different username.")
    res.redirect('/signup')
  });
});
router.get("/", function(req, res){
	Deck.findAll().then(function(decks){

	
	res.render("index", {decks});
})
})

router.post("/create", function(req,res){

	let newDeck = {
		name: req.body.deck
	}
	 Deck.create(newDeck).then(function() {
    res.redirect('/')
  }).catch(function(error) {
    req.flash('error')
    res.redirect('/')
  });
})
router.get("/:id", function(req,res){
	Card.findAll({
		where: {
			deck: req.params.id
		}
	}).then(function(cards){
		 deckCards = cards;
		 console.log(deckCards);
	})
	Deck.findOne({
		where: {
			id: req.params.id
		}
	}).then(function(deck){
		console.log(deck.length);
	res.render("view", {deck, deckCards})
})
})
router.get("/:id/next", function(req,res){
	Card.findAll({
		where: {
			deck: req.params.id
		}
	}).then(function(cards){
		 deckCards = cards;
		 console.log(deckCards);
	})
	Deck.findOne({
		where: {
			id: req.params.id
		}
	}).then(function(deck){
		console.log(deck.length);
		if(index<10){
	res.redirect(`/${req.params.id}/${index}/question`);
}else{
	index = 1;
	res.redirect(`/${req.params.id}`);
}
})
})
router.post("/:id/create", function(req,res){
	let newCard = {
		question: req.body.question,
		answer: req.body.answer,
		deck: req.params.id
		
	}
	Card.create(newCard).then(function(card){
		created = card;
		console.log(created);
		//created.setdeckId(req.params.id);
		//card.setforeignKey(req.params.id);
		
		res.redirect(`/${req.params.id}`);
	})
})
router.get("/:deckId/:cardId/question", function(req,res){
	index ++;

	Card.findOne({
		where: {
			id: req.params.cardId
		}
	}).then(function(card){
		qCard = card;
		Deck.findOne({
		where: {
			id: req.params.deckId
		}
	}).then(function(deck){
		qDeck = deck;
		res.render("question", {qDeck, qCard});
	})
	})


	
	
})
router.get("/:deckId/:cardId/answer", function(req,res){
	Card.findOne({
		where: {
			id: req.params.cardId
		}
	}).then(function(card){
		qCard = card;
		Deck.findOne({
		where: {
			id: req.params.deckId
		}
	}).then(function(deck){
		qDeck = deck;
		res.render("answer", {qDeck, qCard});
	})
	})


	
	
	
})
router.get("/:deckId/startquiz", function(req,res){
	index = 1;
	console.log("quiz started");
	deckNum = req.params.deckId;
	Card.findAll({
		where: {
			deck: req.params.id
		}
	}).then(function(cards){
		 questions = cards;
		 console.log(questions);
		 res.redirect(`/${deckNum}/${index}/question`)
	})
	
})
module.exports = router;