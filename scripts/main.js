window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){console.log(Array.prototype.slice.call(arguments))}};

( function() {

  'use strict';

  var NAC = ( function() {

    function NAC( config ) {
      this.ui = {};
      this.errors = [];

      this.players = [
        {
          name: 'Noughts',
          icon: 'O'
        },
        {
          name: 'Crosses',
          icon: 'X'
        }
      ];
      this.currentPlayer = this.players[ 0 ];

      this.config = config;

      try {
        this.validateConfig();
      } catch( e ) {
        this.errors = e;
      }

      if ( this.errors.length ) {
        this.logErrors();
        return false;
      }

      this.bindEl();
      this.bindUIElements();
      this.bindEvents();
    }

    NAC.fn = NAC.prototype;

    NAC.fn.IS_SELECTED_CLASS = 'is-selected';

    NAC.fn.ENTER_KEYCODE = 13;

    NAC.fn.logErrors = function() {
      if ( this.errors.length ) {
        this.errors.forEach( function( error ) {
          console.error( error );
        });
      }
    };

    NAC.fn.clearErrors = function() {
      this.errors = [];
    };

    NAC.fn.bindEl = function() {
      this.el = document.querySelector( this.config.el );
    };

    NAC.fn.validateConfig = function() {
      var errors = [];
      if ( !this.config.el ) {
        errors.push( 'You need to provide a selector for the config objects el property' );
      }
      if ( !this.config.ui.cells ) {
        errors.push( 'You need to provide a selector for the config objects cells property' );
      }
      if ( !this.config.ui.resetButton ) {
        errors.push( 'You need to provide a selector for the config objects resetButton property' );
      }
      if ( errors.length ) {
        throw errors;
      }
    };

    NAC.fn.bindUIElements = function() {
      var uiElement;
      for( uiElement in this.config.ui ) {
        if ( this.config.ui.hasOwnProperty( uiElement ) ) {
          var matchedElements = this.el.querySelectorAll( this.config.ui[ uiElement ] );
          this.ui[ uiElement ] = matchedElements.length > 1 ? matchedElements : matchedElements[ 0 ];
        }
      }
    };

    NAC.fn.bindEvents = function() {
      Array.prototype.forEach.call( this.ui.cells, function( cell ) {
        cell.addEventListener( 'click', function() {
          if ( this.cellIsPopulated( cell ) ) {
            return false;
          }
          this.deselectCurrentlySelected();
          this.selectCell( cell );
          this.setCurrentlySelected( cell );
        }.bind( this ), false );
      }.bind( this ) );

      this.ui.resetButton.addEventListener(
        'click',
        this.reset.bind( this ),
        false
      );

      window.addEventListener(
        'keyup',
        this.checkKeyboardInput.bind( this )
      );
    };

    NAC.fn.keyWasEnter = function( keyCode ) {
      return keyCode === this.ENTER_KEYCODE;
    };

    NAC.fn.checkKeyboardInput = function( e ) {
      if ( this.keyWasEnter( e.keyCode ) ) {
        this.populateCurrentlySelected();
        if ( this.currentlySelected ) {
          this.switchPlayer();
          this.setCurrentPlayerText();
        }
        this.deselectCurrentlySelected();
      }
    };

    NAC.fn.deselectCurrentlySelected = function() {
      if ( this.currentlySelected ) {
        this.deselectCell( this.currentlySelected );
        this.currentlySelected = null;
      }
    };

    NAC.fn.deselectCell = function( cell ) {
      if ( cell ) {
        cell.classList.remove( this.IS_SELECTED_CLASS );
      }
    };

    NAC.fn.selectCell = function( cell ) {
      cell.classList.add( this.IS_SELECTED_CLASS );
    };

    NAC.fn.populateCurrentlySelected = function() {
      if ( this.currentlySelected ) {
        this.populateCell( this.currentlySelected, this.currentPlayer.icon );
      }
    };

    NAC.fn.populateCell = function( cell, text ) {
      cell.innerText = text;
    };

    NAC.fn.clearCell = function( cell ) {
      cell.innerText = '';
    };

    NAC.fn.cellIsPopulated = function( cell ) {
      return cell.innerText !== '';
    };

    NAC.fn.setCurrentlySelected = function( cell ) {
      this.currentlySelected = cell;
    };

    NAC.fn.reset = function() {
      Array.prototype.forEach.call( this.ui.cells, this.clearCell.bind( this ), false);
    };

    NAC.fn.switchPlayer = function() {
      this.currentPlayer = this.currentPlayer === this.players[ 0 ] ? this.players[ 1 ] : this.players[ 0 ];
    };

    NAC.fn.setCurrentPlayerText = function() {
      this.ui.currentPlayer.innerText = this.currentPlayer.name;
    };

    return NAC;

  })();

  window.addEventListener( 'DOMContentLoaded', function() {
    var game = new NAC({
      el: '.noughts-and-crosses',
      ui: {
        cells: '.grid__cell',
        resetButton: '.reset-button',
        currentPlayer: '.current-player'
      }
    });
  });

})();