const navHeaders = document.getElementById("nav-header");
const loginForm = document.getElementById("login-form");
const productSection = document.getElementById('product-section');
const sideBar = document.getElementById('sidebar');
const welcomeSection = document.getElementById("welcome-section");
const signUpForm = document.getElementById('popup-signup');

var isLoggedIn = window.localStorage.getItem('isLoggedIn');
if(isLoggedIn == null || isLoggedIn != 'true'){
    const navElement = document.createElement("h3");
    navElement.className = "nav-links";
    navElement.id = "login-btn";
    const node = document.createTextNode("Sign In");
    navElement.appendChild(node);
    navHeaders.appendChild(navElement);

    const navElement2 = document.createElement("h3");
    navElement2.className = "nav-links";
    navElement2.id = "signup-btn";
    const node2 = document.createTextNode("Sign Up");
    navElement2.appendChild(node2);
    navHeaders.appendChild(navElement2);

    navElement2.addEventListener('click', () => {
        // console.log("sign up");
        document.getElementById('popup-login').style.display = "none";
            document.getElementById('popup-signup').style.display = "block";
            
    });

    const signUpCancelBtn = document.getElementById('cancel-btn-s');
    signUpCancelBtn.addEventListener('click', () => {
        document.getElementById('popup-signup').style.display = "none";
    });

    const loginButton = document.getElementById('login-btn');
    loginButton.addEventListener('click', function(){
        document.getElementById('popup-signup').style.display = "none";
        document.getElementById('popup-login').style.display = "block";
    });
    const cancelButton = document.getElementById('cancel-btn');
    cancelButton.addEventListener('click', function(){
        document.getElementById('popup-login').style.display = "none";
    });
}else{
    const cartButton = document.createElement("h3");
    cartButton.className = "nav-links";
    const cartText = document.createTextNode("Cart");
    cartButton.appendChild(cartText);
    navHeaders.appendChild(cartButton);

    const ordersButton = document.createElement('h3');
    ordersButton.className = "nav-links";
    const ordersText = document.createTextNode("Orders");
    ordersButton.appendChild(ordersText)
    navHeaders.appendChild(ordersButton);

    cartButton.addEventListener('click', () => {
        // const url = window.location.href + "cart";
        window.location.href = '/cart';
    });

    ordersButton.addEventListener('click', () => {
        window.location.href = '/orders';
    });

    const signOut = document.createElement("h3");
    signOut.className = "nav-links";
    signOut.id = "signout-btn";
    const signOutText = document.createTextNode("Sign Out");
    signOut.appendChild(signOutText);
    navHeaders.appendChild(signOut);

    const welcomeSent = document.createElement('h1');
    welcomeSent.innerText = "Welcome";
    const nameSpan = document.createElement('span');
    nameSpan.innerText = `${window.localStorage.getItem('name').toUpperCase()}`;
    const newLine = document.createElement('br')
    welcomeSent.appendChild(newLine);
    welcomeSent.appendChild(nameSpan);
    welcomeSection.appendChild(welcomeSent);

    document.getElementById('signout-btn').addEventListener('click', function(){
        window.localStorage.setItem('user_id', "");
        window.localStorage.setItem("username", "");
        window.localStorage.setItem("address", "");
        window.localStorage.setItem("name", "");
        window.localStorage.setItem('isLoggedIn', "false");
        window.location.reload();
    });
}


loginForm.addEventListener('submit',loginUser);
signUpForm.addEventListener('submit', signUpUser);


function signUpUser(e){
    const username = document.getElementById('username-s');
    const password = document.getElementById('password-s');
    const name = document.getElementById('name-s');
    const address = document.getElementById('address-s');

    fetch("http://localhost:3000/signup",{
        method: 'POST',
        body: JSON.stringify({
            "name": name.value,
            "username": username.value,
            "password": password.value,
            "address": address.value,
        }),
        headers: {
            "Content-type": 'application/json;charset=UTF-8'
        }
    }).then(response => response.json()).then(json => {
        // console.log(json);
        if(json['status'] == 502){
            alert('Username is taken');
        }
        else if(json['status'] == 200){

            window.localStorage.setItem('user_id', json['data'][0]['user_id']);
            window.localStorage.setItem("username", json['data'][0]['username']);
            window.localStorage.setItem("address", json['data'][0]['address']);
            window.localStorage.setItem("name", json['data'][0]['name']);
            window.localStorage.setItem('isLoggedIn', "true");
            document.getElementById('popup-signup').style.display = "none";
            window.location.reload();
        }
    });
    e.preventDefault();
}

function loginUser(e){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch("http://localhost:3000/signin",{
        method: 'POST',
        body: JSON.stringify({
            "username": username,
            "password": password,
        }),
        headers: {
            "Content-type": 'application/json;charset=UTF-8'
        }
    }).then(response => response.json()).then(function(json){
        // console.log(json);
        if(json['status'] == 200){
            window.localStorage.setItem('user_id', json['data'][0]['user_id']);
            window.localStorage.setItem("username", json['data'][0]['username']);
            window.localStorage.setItem("address", json['data'][0]['address']);
            window.localStorage.setItem("name", json['data'][0]['name']);
            window.localStorage.setItem('isLoggedIn', "true");
            document.getElementById('popup-login').style.display = "none";  
            window.location.reload();
        }else if(json['status'] == 502){
            alert("Invalid Credentials");
        }else if(json['status'] == 404){
            alert("No Account found");

        }
    });
    e.preventDefault();
}

function getProductData(){
    fetch("http://localhost:3000/products").then(response => response.json()).then(function(json){
        // console.log(json)
         if(json['status'] == 200){
            productSection.innerHTML = "";
            json['data'].forEach(function(d){
                const productCard = document.createElement('div');
                productCard.className = "product-card";
                const imageContainer = document.createElement('div');
                imageContainer.className = "image-container";
                const image = document.createElement('img');
                image.src = `${d['Image']}`;
                image.className = "disp-image";
                imageContainer.appendChild(image);
                productCard.appendChild(imageContainer);
                const prodDetailContainer = document.createElement('div');
                prodDetailContainer.className = "prod-details-container";
                const prodTitle = document.createElement('h1');
                prodTitle.className = "prod-title";
                prodTitle.id = "prod-title";
                prodTitle.innerText = `${d['Product_Name']}`;
                const prodPrice = document.createElement('h3');
                prodPrice.className = "price";
                prodPrice.id = "price";
                prodPrice.innerText = `Rs. ${d['final_price']}.00/-`;
                const buttonContainer = document.createElement('div')
                buttonContainer.className="prod-btn-container"
                buttonContainer.id="prod-btn-container";
                const cartButton = document.createElement('button');
                cartButton.className = "prod-btn";
                cartButton.id = "add-to-cart";
                cartButton.innerText = "Add To Cart";
                const buyButton = document.createElement('button');
                buyButton.className = "prod-btn";
                buyButton.id = "buy-now";
                buyButton.innerText = "Buy Now"
                buttonContainer.appendChild(cartButton);
                buttonContainer.appendChild(buyButton);

                prodDetailContainer.appendChild(prodTitle);
                prodDetailContainer.appendChild(prodPrice);
                prodDetailContainer.appendChild(buttonContainer);
                productCard.appendChild(prodDetailContainer);
                productSection.appendChild(productCard);

                cartButton.addEventListener('click', function(){
                    const loggedStatus = window.localStorage.getItem('isLoggedIn');
                    // console.log(loggedStatus);
                    if(loggedStatus != null && loggedStatus == "true"){

                        addToCart(d['Product_ID'], 1, d['final_price']);
                    }else{
                        alert("Login to your account");
                    }
                });

                buyButton.addEventListener('click', () =>{
                    const loggedStatus = window.localStorage.getItem('isLoggedIn');
                    if(loggedStatus != null && loggedStatus == "true"){
                        fetch('/buy_products',{
                            method: 'POST',
                            body: JSON.stringify({
                               "prod_id": d['Product_ID'],
                               "user_id": window.localStorage.getItem('user_id'),
                               "qty": 1,
                               "price": d['final_price'],
                            }),
                            headers: {
                                "Content-type": 'application/json;charset=UTF-8'
                            }
                        }).then(response => response.json()).then(json => {
                            // console.log(json);
                            if(json['status'] == 200){
                            }
                        });
                    }else{
                        alert("Login yo your account to continue");
                    }
                });
            });
        }
    });
}

function getCategories(){
    fetch("http://localhost:3000/categories").then(response => response.json()).then(json => {
        if(json['status'] == 200){
            const allCategory = document.createElement('h3');
            allCategory.className = "category";
            allCategory.innerText = `All`;
            sideBar.appendChild(allCategory);
            allCategory.addEventListener('click', function(){
                getProductData();
            });
            json['data'].forEach(e => {
                const categoryNameElement = document.createElement('h3');
                categoryNameElement.className = "category";
                categoryNameElement.innerText = `${e['Cat_name']}`;
                sideBar.appendChild(categoryNameElement);

                categoryNameElement.addEventListener('click', function(){
                    // console.log(`Selected ${categoryNameElement.innerText}`);
                    getProductDataCat(e['id']);
                });
            });
        }
    });
}


function getProductDataCat(id){
    fetch(`/products/cat/${id}/`).then(response => response.json()).then(json => {
        productSection.innerHTML = "";
        if(json['status'] == 200){
            json['data'].forEach(function(d){
                const productCard = document.createElement('div');
                productCard.className = "product-card";
                const imageContainer = document.createElement('div');
                imageContainer.className = "image-container";
                const image = document.createElement('img');
                image.src = `${d['Image']}`;
                image.className = "disp-image";
                imageContainer.appendChild(image);
                productCard.appendChild(imageContainer);
                const prodDetailContainer = document.createElement('div');
                prodDetailContainer.className = "prod-details-container";
                const prodTitle = document.createElement('h1');
                prodTitle.className = "prod-title";
                prodTitle.id = "prod-title";
                prodTitle.innerText = `${d['Product_Name']}`;
                const prodPrice = document.createElement('h3');
                prodPrice.className = "price";
                prodPrice.id = "price";
                prodPrice.innerText = `Rs. ${d['final_price']}.00/-`;
                const buttonContainer = document.createElement('div')
                buttonContainer.className="prod-btn-container"
                buttonContainer.id="prod-btn-container";
                const cartButton = document.createElement('button');
                cartButton.className = "prod-btn";
                cartButton.id = "add-to-cart";
                cartButton.innerText = "Add To Cart";
                const buyButton = document.createElement('button');
                buyButton.className = "prod-btn";
                buyButton.id = "buy-now";
                buyButton.innerText = "Buy Now"
                buttonContainer.appendChild(cartButton);
                buttonContainer.appendChild(buyButton);

                prodDetailContainer.appendChild(prodTitle);
                prodDetailContainer.appendChild(prodPrice);
                prodDetailContainer.appendChild(buttonContainer);
                productCard.appendChild(prodDetailContainer);
                productSection.appendChild(productCard);

                cartButton.addEventListener('click', function(){
                    const loggedStatus = window.localStorage.getItem('isLoggedIn');
                    // console.log(loggedStatus);
                    if(loggedStatus != null && loggedStatus == "true"){

                        addToCart(d['Product_ID'], 1, d['final_price']);
                    }else{
                        alert("Login to your account");
                    }
                });

                buyButton.addEventListener('click', () =>{
                    const loggedStatus = window.localStorage.getItem('isLoggedIn');
                    if(loggedStatus != null && loggedStatus == "true"){
                        fetch('/buy_products',{
                            method: 'POST',
                            body: JSON.stringify({
                               "prod_id": d['Product_ID'],
                               "user_id": window.localStorage.getItem('user_id'),
                               "qty": 1,
                               "price": d['final_price'],
                            }),
                            headers: {
                                "Content-type": 'application/json;charset=UTF-8'
                            }
                        }).then(response => response.json()).then(json => {
                            // console.log(json);
                            if(json['status'] == 200){
                            }
                        });
                    }else{
                        alert("Login yo your account to continue");
                    }
                });
            });
        }
    });
}

function addToCart(prod_id, qty, price){
    const userid = window.localStorage.getItem('user_id');
    fetch('add_to_cart', {
        method: "POST",
        body: JSON.stringify({
            "user_id": userid,
            "prod_id": prod_id,
            "qty": qty,
            "price": price,
        }),
        headers: {
            "Content-type": 'application/json;charset=UTF-8'
        }
    }).then(response => response.json()).then(json => { 
        // console.log(json);
    });
}

function getCartItems(){
    const data = [];
    fetch(`http://localhost:3000/cart_items/${window.localStorage.getItem('user_id')}`).then(response => response.json()).then(json => {
        json['data'].forEach(e => data.push(e));
    });
    return data;
}


window.addEventListener('load', () => {
    getCategories();
    getProductData();
});