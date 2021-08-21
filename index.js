const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const { dest } = require('./services/common');
const cors = require('cors')


const app = express();
const port = 3000;
const saltRounds = 2;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'))

// const connection =  mysql.createConnection({
//     'host': 'localhost',
//     'user': 'vikasrai19',
//     'password': 'vikasrai',
//     'database': 'shopp_mart',
// })

const connection = mysql.createConnection({
    "host": "192.168.1.33",
    "user": "vikasrai",
    "password": "vikasrai",
    // "port": "3306",
    "port": 3306,
    "database": "shopp_mart",
})

connection.connect();

app.listen(process.env.PORT || port, () => {
    console.log(`Sever started successfully @ http://localhost:${port}`);
})


app.get('/', (req, res) => {
    res.json({
        "message": "connected successfully",
    })
})

app.get('/cart', (req, res) => {
    res.sendFile('./public/pages/cart.html',{ root : __dirname});
})

app.get('/orders', (req, res) => {
    res.sendFile('./public/pages/orders.html',{ root : __dirname});
})

app.get('/check-username/:username', function(req, res){
    connection.query(`SELECT username FROM user where username = ${connection.escape(req.params.username)}`, function(err, result, field){
        if(err) throw err;
        if(result.length > 0){
            res.json({
                "message": true,
            })
        }else{
            res.json({
                "message": false,
            })
        }
    });
});

app.post('/signup', async function(req, res){
    const name = req.body.name;
    const username = req.body.username;
    const password = await bcrypt.hash(req.body.password, saltRounds);
    const id = Date.now(); 
    const address = req.body.address;
    
    connection.query(`SELECT username FROM user where username = ${connection.escape(username)}`, function(er, resp, fld){
        if(er){
            res.json({
                "message": "something went wrong",
            })
        }
        if(resp.length > 0){
            res.json({
                "status": 502,
                "code": "AL_PRESENT",
                "message":"user already present"
            })
        }else{

            connection.query(`INSERT INTO user values(${connection.escape(id)}, ${connection.escape(username)},   
            ${connection.escape(name)},${connection.escape(password)}, ${connection.escape(address)});`, function(err, result, field){
                if(err) {
                    throw err;
                    // res.json({
                    //     "status": 501,
                    //     "message": "something went wrong"
                    // })
                }else{
                    connection.query(`SELECT * FROM user where user_id = ${connection.escape(id)};`, (err, result, field) => {
                        if(err){
                            res.json({
                                "status": 500,
                                "message": "something went wrong",
                            })
                        }else{

                            res.json({
                                "status": 200,
                                "message": "New user registered successfully",
                                "data": dest(result),
                            })
                        }

                    });
                }
            });
        }
    });

});


app.post('/signin', function(req, res){
    connection.query(`SELECT * FROM user WHERE username = ${connection.escape(req.body.username)}`, async function(err, result, field){
        if(err) throw err;
        console.log(result.length);
        if(result.length == 0){
            res.json({
                "status": 404,
                "message":"no user found",
                "data": [],
            })
        }else if(result.length > 0){

            const password = req.body.password;
            const comparison = await bcrypt.compare(password, result[0].password);
            if(comparison){
                res.json({
                    "status": 200,
                    "code": "SUCCESS",
                    "message": "Successfully logged In",
                    "data": dest(result)
                })
            }else{
                res.json({
                    "status": 502,
                    "code": "INVALID_CRED",
                    "message": "Check ur credentials"
                })
            }
        }

    });
});

app.get('/products', (req, res) => {
    connection.query(`SELECT * FROM Products;`, function(err, result, field){
        if(err){
            res.json({
                "status": 404,
                "message": "something went wrong",
                "data":[],
            })
        }else{

            res.json({
                "status": 200,
                "message": "successful",
                "data": dest(result),
            });
        }
    });
})

app.get('/products/cat/:id/', (req, res) => {
    connection.query('SELECT * FROM Products where cat_id =' + connection.escape(req.params.id), function(err, result, field){
        if(err) throw err;
        res.json({
            "status": 200,
            "message": "data",
            "data": dest(result),
        })
    });
});

app.get('/categories', (req, res) => {
    connection.query(`SELECT * FROM category;`, function(err, result, field){
        if(err){
            res.json({
                "status": 400,
                "message": "some thing went wrong",
                "data": [],
            })
        }else{
            res.json({
                "status": 200,
                "message": "success",
                "data": dest(result)
            })
        }
    });
});


app.post('/add_to_cart', (req, res) => {
    const id = `cart${Date.now()}`;
    const user_id = req.body.user_id;
    const prod_id = req.body.prod_id;
    const qty = req.body.qty;
    const singlePrice = req.body.price;
    const totalPrice = singlePrice * qty;

    connection.query(`SELECT * FROM cart where product_id = ${connection.escape(prod_id)} and user_id = ${connection.escape(user_id)} and status = 'pending';`, (err, result, feild) =>{

        if(result.length == 0){
            
            connection.query(`INSERT INTO cart values (${connection.escape(id)}, ${connection.escape(prod_id)}, ${connection.escape(user_id)}, 'pending', ${connection.escape(qty)}, ${connection.escape(totalPrice)});`, (err, result, field) => {
                if(err){
                    res.json({
                        "status": 404,
                        "message": "Something went wrong",
                        "data": [],
                    })
                }else{
                    res.json({
                        "status": 200,
                        "message": "Inserted successfully",
                        "data": result
                    })
                }
            });
        }else if(result.length > 1){
            res.json({
                "status": 501,
                "message": "Already added to cart",
            })
        }
    });
});

app.get('/cancel_cart/:id', (req, res) => {
    connection.query(`UPDATE cart set status = 'canceled' where product_id = ${req.params.id};`, (err, result, field) => {
        if(err){
            res.json({
                "status": 404,
                "message": "Something went wrong",
                "data": [],
            })
        }else{
            res.json({
                "status": 200,
                "message": "Successfully canceled",
                "data": [],
            })
        }
    })
})

app.get('/cart_items/:id', (req, res) => {
    console.log(req.params.id);
    connection.query(`SELECT c.id, c.product_id, c.status, c.qty, c.user_id, c.price, p.Product_name, p.Image FROM cart c, Products p WHERE c.product_id = p.Product_Id and user_id = ${connection.escape(req.params.id)} and status = 'pending';`, (err, result, field) => {
        if (err){
            res.json({
                "status": 404,
                "message": "Something went wrong",
                "data": [],
            })
        }else{
            res.json({
                "status": 200,
                "message": "Successful",
                "data": dest(result),
            })
        }
    });
});

app.post('/add_to_orders', (req, res) => {
    const cart_id = req.body.cart_id;
    const orderId =  `ord${Date.now()}`;
    const prod_id = req.body.prod_id;
    const user_id = req.body.user_id;
    const qty = req.body.qty;
    const order_status = 'pending';
    // const order_date = req.body.date;
    const order_date = `'${new Date().toISOString().slice(0, 10)}'`;
    console.log(order_date)
    const price = req.body.price;

    connection.query(`INSERT INTO orders VALUES ('${orderId}', ${prod_id}, ${user_id}, ${qty}, 
    '${order_status}', ${order_date}, ${price});`, (err, result, field) => {
        if(err){
            res.json({
                "status": 404,
                "message": "Something went wrong",
                "data": [],
            })
        }else{
            connection.query(`UPDATE cart SET status = 3 where id = '${cart_id}';`, (err, result, field) => {
                if(err){
                    res.json({
                        "status": 404,
                        "message": "Something went wrong",
                        "data": [],
                    })  
                }else{

                    res.json({
                        "status": 200,
                        "message": "Success",
                        "data": [],
                    })
                }
            })
        }
    })
})

app.post('/buy_products', (req, res) => {
    const orderId =  `ord${Date.now()}`;
    const prod_id = req.body.prod_id;
    const user_id = req.body.user_id;
    const qty = req.body.qty;
    const order_status = 'pending';
    // const order_date = req.body.date;
    const order_date = `'${new Date().toISOString().slice(0, 10)}'`;
    console.log(order_date)
    const price = req.body.price;

    connection.query(`INSERT INTO orders VALUES ('${orderId}', ${prod_id}, ${user_id}, ${qty}, 
    '${order_status}', ${order_date}, ${price});`, (err, result, field) => {
        if(err){
            res.json({
                "status": 404,
                "message": "Something went wrong",
                "data": [],
            })
        }else{
            res.json({
                "status": 200,
                "message": "Success",
                "data": [],
            })
        }
    })

})

// app.get('/order_items/:id', (req, res) => {
//     connection.query(`SELECT p.Product_name, p.Image, o.price from orders 0, Products p where p.Product_ID = o.product_id and 0.user_id = ${req.params.id};`,(err, result, field) => {
//         if(err){
//             res.json({
//                 "status": 404,
//                 "message": "Something went wrong",
//                 "data": [],
//             })
//         }else{
//             res.json({
//                 "status": 200,
//                 "message":"Success",
//                 "data": dest(result)
//             })
//         }
//     })
// })

app.get('/order_items/:id', (req, res) => {
    connection.query(`SELECT p.Image, o.order_date, o.order_id, o.product_id, p.Product_name, o.price, o.order_status, p.cat_id from orders o, Products p where p.Product_ID = o.product_id and o.user_id = '${req.params.id}';`, (err, result, field) => {
        if(err){
            throw(err)
            // res.json({
            //     "status": 404,
            //     "message": "Something went wrong",
            //     "data": [],
            // })
        }else{
            res.json({
                "status": 200,
                "message":"Success",
                "data": dest(result)
            })
        }
    });
})