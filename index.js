/**
 * index.js
 * Author: Nathan Johnson
 */

var request = require('request'),
    Wamp = require('wamp1');

var API = {
    'baseUrl': 'https://api.mintpal.com/v2/market/',
    _req: function(url, cb) {
        request.get(url, function(err, data) {
            try {
                return cb(null, JSON.parse(data.body));
            } catch (e) {
                return cb('JSON Parse error @' + url, null);
            }
        });
    },
    getLastTrades: function(currency, masterCurrency, cb) {
        var url = API.baseUrl + 'trades/' + currency + '/' + masterCurrency;
        return this._req(url, cb);
    },
    getOrdersBuy: function(currency, masterCurrency, cb) {
        var url = API.baseUrl + 'orders/' + currency + '/' + masterCurrency + '/BUY/200';
        return this._req(url, cb);
    },
    getOrdersSell: function(currency, masterCurrency, cb) {
        var url = API.baseUrl + 'orders/' + currency + '/' + masterCurrency + '/SELL/200';
        return this._req(url, cb);
    },
    getOrderBook: function(currency, masterCurrency, cb) {
        var url = API.baseUrl + 'orders/' + currency + '/' + masterCurrency + '/ALL/200';
        return this._req(url, cb);
    },
    getHistoricalData: function(marketID, period, cb) {
        var url = API.baseUrl + 'chartdata/' + marketID + '/' + period;
        return this._req(url, cb);
    },
    getAllCoins: function(cb) {
        var url = API.baseUrl + 'summary/';
        return this._req(url, cb);
    }
};

var Websocket = function() {
    this.wamp = new Wamp('wss://push.mintpal.com', function(r) {
        console.log('Opening websocket:', r);
    });
    this.subscriptions = [];
};

Websocket.prototype.subscribe = function(channel, handler) {
    this.wamp.subscribe(channel, function(data) {
        return handler(data);
    });
    this.subscriptions.push(channel);
};

module.exports = {
    'API': API,
    'Websocket': Websocket
};