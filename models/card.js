'use strict';
module.exports = function(sequelize, DataTypes) {
  var Card = sequelize.define('Card', {
    question: DataTypes.STRING,
    answer: DataTypes.STRING,
    deck: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Card.belongsTo(models.Deck, {
          foreignKey: 'deckId',
        })
        // associations can be defined here
      }
    }
  });
  return Card;
};