'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _reducers = require('../reducers');

var _reducers2 = _interopRequireDefault(_reducers);

var _redux = require('redux');

var _LoansOutstanding = require('./LoansOutstanding');

var _LoansOutstanding2 = _interopRequireDefault(_LoansOutstanding);

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InvestorApp = function () {
  function InvestorApp(investor) {
    _classCallCheck(this, InvestorApp);

    this.investor = investor;

    this.onStateChange = this.onStateChange.bind(this);
    this.errorCallback = this.errorCallback.bind(this);
    this.exit = this.exit.bind(this);
  }

  _createClass(InvestorApp, [{
    key: 'start',
    value: async function start() {
      this.store = (0, _redux.createStore)(_reducers2.default);
      this.store.subscribe(this.onStateChange);

      // Creating our screen
      this.screen = _blessed2.default.screen({
        autoPadding: true,
        smartCSR: true
      });

      this.loansOutstanding = new _LoansOutstanding2.default();

      // Adding a way to quit the program
      this.screen.key(['escape', 'q', 'C-c'], this.exit);

      this.screen.append(this.loansOutstanding.getNode());
      this.screen.render();
      this.screen.enableKeys();

      try {
        await this.investor.startDaemon(this.store, this.errorCallback);
      } catch (err) {
        console.error(err.stack);
      }
    }
  }, {
    key: 'onStateChange',
    value: function onStateChange() {
      var state = this.store.getState();
      this.loansOutstanding.render(state.loans);
      this.screen.render();
    }
  }, {
    key: 'errorCallback',
    value: async function errorCallback(err) {
      await this.investor.stopDaemon();
      this.screen.destroy();
      console.log(err);
      setTimeout(function () {
        process.exit(1);
      }, 200);
    }
  }, {
    key: 'exit',
    value: async function exit() {
      await this.investor.stopDaemon();
      setTimeout(function () {
        process.exit(0);
      }, 200);
    }
  }]);

  return InvestorApp;
}();

module.exports = InvestorApp;