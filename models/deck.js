'use strict';
module.exports = function(sequelize, DataTypes) {
  var Deck = sequelize.define('Deck', {
    name: DataTypes.STRING,
    numberOfQuestions: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: function(models) {
        Deck.hasMany(models.Card, {
          foreignKey: 'deckId',
        })
        // associations can be defined here
      }
    }
  });

  
  return Deck;
};