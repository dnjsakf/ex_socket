var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();

/* use */
// cookie 사용
//app.use(cookieParser());
var auth_key = "asdfddb$$#%#$%sda";
app.use(cookieParser(auth_key));
/*@@@@@@*

/* set */

/*@@@@@@*/
// 나중에 데이터베이스에서 가져올 값.
var products = {
  1:{title: 'The history of web 1'},
  2:{title: 'The next web'},
  3:{title: 'The Book Story'}
};

app.get('/products', function(req, res){
  var output = ``;
  for(var name in products){
    output += `
    <li>
      <a href='/cart/${name}'>${products[name].title}</a>
    </li>`;
  }
  res.send(`<h1>Products</h1><ul>${output}</ul><a href='/cart'>Cart</a>`);
});
/*
  var cart = {
    1:5,
    2:1
  }
}
*/
app.get(['/cart','/cart/:id'], function(req, res){
  var id = req.params.id;
  if(id){
    if(req.signedCookies.cart){
      var cart = req.signedCookies.cart;
    } else {
      var cart = {};
    }
    if(!cart[id]){
      cart[id] = 0;
    }
    cart[id] = parseInt(cart[id]) + 1;
    // Create Cookie
    res.cookie('cart', cart, {signed:true});
    res.redirect('/cart');
  } else {
    var cart = req.signedCookies.cart;
    if(!cart){
      res.send("Empty!");
    } else {
      var output = ``;
      for(var id in cart){
        output += `
          <li>
            ${products[id].title} (${cart[id]})
          </li>`;
      }
    }
    res.send(`<h1>Cart</h1><ul>${output}</ul><a href='/products'>Products List</a>`);
  }
});

app.get('/count', function(req, res){
  if(req.signedCookies.count)
    var count = parseInt(req.signedCookies.count);  // String Type
  else
    var count = 0;
  res.cookie('count', count+1, {signed:true});
  res.send('Count: ' + count);
});

app.listen(3000, function(req, res){
  console.log('Connected 3000 port!!')
});
