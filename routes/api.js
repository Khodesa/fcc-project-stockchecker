'use strict';

let StocksChecker = require("../controllers/stocks_checker.js");
const expect = require('chai').expect;
const express = require('express');
const mongoose = require('mongoose');
const requestIp = require('request-ip');
const bcrypt = require('bcrypt');

module.exports = function (app) {

  let stocks = new StocksChecker();

  app.route('/api/stock-prices')
    .get(async function (req, res){
      let stock = req.query.stock;
      let like = req.query.like === "true";
      let clientIp = bcrypt.hashSync(requestIp.getClientIp(req), 12);
      
      if(typeof stock == "string") {
        
        let stock1 = await 
stocks.getStockInfo(stock, like, clientIp);
        return res.json({"stockData": stock1});
      } else {
        let stock1 = await stocks.getStockInfo(stock[0], like, clientIp);
        let stock2 = await stocks.getStockInfo(stock[1], like, clientIp);

        return res.json({
          "stockData":[
            {
              "stock":stock1.stock,
              "price":stock1.price,
              "rel_likes":stock1.likes - stock2.likes
            },
            {
              "stock":stock2.stock,
              "price":stock2.price,
              "rel_likes":stock2.likes - stock1.likes
            }
          ]
        });
      }
    });
    
};
