const express = require("express");
const Card = require("../models/index").Card;
const Deck = require("../models/index").Deck;
const User = require("../models/index").User;
const router = express.Router();
const bcrypt = require("bcrypt");
let username;
let password;
let name;
let deckCards;
let qCard;
let qDeck;
let index = 1;
let counter = 0;
let deckNum;
let questionNumber = 0;
let numOfQuestions;
let deckToUpdate;
const passport = require('passport');
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
router.get("/user", function(req, res){
	questionNumber = 1;
	Deck.findAll().then(function(decks){

	
	res.render("index", {decks});
})
})

router.post("/user/create", function(req,res){
 
	let newDeck = {
		name: req.body.deck,
		numberOfQuestions: 0
	}
	console.log("NEW DECK" + newDeck);
	 Deck.create(newDeck).then(function() {
    res.redirect('/user')
  }).catch(function(error) {
    req.flash('error')
    res.redirect('/')
  });
})
router.get("/user/:id", function(req,res){
	
	Card.findAll({
		where: {
			deck: req.params.id
		}
	}).then(function(cards){
		 deckCards = cards;
		 //console.log(deckCards);
	})
	Deck.findOne({
		where: {
			id: req.params.id
		}
	}).then(function(deck){
		numOfQuestions = deck.numberOfQuestions;
		//console.log(deck.length);
	res.render("view", {deck, deckCards})
})
})
router.get("/user/:id/next", function(req,res){
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
		if(index<deck.numberOfQuestions){
	res.redirect(`/user/${req.params.id}/${index}/question`);
}else{
	index = 1;
	res.redirect(`/user/${req.params.id}`);
}
})
})
router.post("/user/:id/create", function(req,res){

console.log("QUESTION # " + questionNumber)
	let newCard = {
		question: req.body.question,
		answer: req.body.answer,
		deck: req.params.id,
		questionNumber: numOfQuestions
		
	}
	Deck.findOne({
		where: {
			id: req.params.id
		}
	}).then(function(DTU){
		deckToUpdate = DTU;
		console.log("DEEECCCKKK" + deckToUpdate.name);
		Deck.update({

		name: deckToUpdate.name,
		numberOfQuestions: deckToUpdate.numberOfQuestions + 1,
	}, {where: {id: req.params.id}

	})
	
	})
	
	
	Card.create(newCard).then(function(card){
		questionNumber++;
		created = card;
		res.redirect(`/user/${req.params.id}`);
		
		
	})
})

router.get("/user/:deckId/delete", function(req, res){
	console.log("DELETING!");

	Deck.destroy({
		
		where: {
			id: req.params.deckId
		}
	}).then(function(deck){
		Card.destroy({
			where: {
				deck: req.params.deckId
			}
		})
		res.redirect("/user");
	})
})
router.get("/user/:deckId/:cardId/question", function(req,res){
	index ++;

	Card.findOne({
		where: {
			questionNumber: req.params.cardId,
			deck: req.params.deckId
		}
	}).then(function(card){
		qCard = card;
		Deck.findOne({
		where: {
			id: req.params.deckId
		}
	}).then(function(deck){
		console.log(deck);
		qDeck = deck;
		res.render("question", {qDeck, qCard});
	})
	})


	
	
})
router.get("/user/:deckId/:cardId/answer", function(req,res){
	Card.findOne({
		where: {
			questionNumber: req.params.cardId,
			deck: req.params.deckId
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
router.get("/user/:deckId/startquiz", function(req,res){

	index = 0;
	console.log("quiz started");
	deckNum = req.params.deckId;
	Card.findAll({
		where: {
			deck: req.params.deckId
		}
	}).then(function(cards){

		 questions = cards;
		 console.log("questions" + questions);
		 res.redirect(`/user/${deckNum}/${index}/question`)
	})
	
})
module.exports = router;