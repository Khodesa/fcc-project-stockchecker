const fetch = require('node-fetch');
const mongoose = require('mongoose');

mongoose.connect(
		process.env.DB,
		{ useNewUrlParser: true, useUnifiedTopology: true },
);

let stockSchema = mongoose.Schema({
    stock: String,
    ipLikes: [String]
  });

let Stock = mongoose.model("Stock", stockSchema);

class StocksChecker {


  

  async getStockInfo(stock, like, clientIp) {
    let price = await this.getStockPrice(stock);
    let likes = await this.getLikes(stock, like, clientIp);

    return {
      "stock": stock,
      "price": price,
      "likes": likes
    };
  }
  
  async getStockPrice(stock){
    let url = "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/" + stock + "/quote";
    let price = await fetch(url)
      .then(resp => resp.text())
      .then(data => JSON.parse(data))
      .then(obj => obj["latestPrice"]);
    return price;
  }

  async getLikes(stock, like, clientIp) {
    
    Stock.findOne(
      {stock: stock},
      (error, stockFound) => {
        if(error) {
          console.log("Error:\n" + error);
        }else if(!stockFound) {
          let newStock = new Stock({
            stock: stock
          });
          newStock.save();
        }
      }
    )

    if (like) {
      Stock.findOne(
        { stock: stock },
        (error, stockFound) => {
          if(!stockFound.ipLikes.includes(clientIp)) {
            const update = { $push: { ipLikes: [clientIp] } };
            Stock.updateOne(
              {stock: stock},
              update
            )
          } 
        }
      )
    }

    let likes; 
    try {
      likes = await Stock.findOne(
      {stock: stock}/*,
      (error, stockFound) => {
        if (error) {
          console.log("Error");
        }
        if (!stockFound) {
          console.log("No stock found");
        }
        likes = stockFound.ipLikes.length;
        return likes;
      }*/
    )
    } catch (error) {
      console.log(error);
    }
    return likes.ipLikes.length;
  }
}

module.exports = StocksChecker;