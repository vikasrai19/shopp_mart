const navHeaders = document.getElementById("nav-header-c");
var isLoggedIn = window.localStorage.getItem('isLoggedIn');

const welcomeSection = document.getElementById("welcome-section");
const cartSection = document.getElementById('cart-section');
const mainSection = document.getElementById('main-section');
const titleButton = document.getElementById('title_c');

titleButton.addEventListener('click', () => {
    window.location.href = "/";
})

console.log(`Window location ${window.location.href}`)

if (isLoggedIn == null || isLoggedIn == 'false'){
    console.log("Login To your account");
    alert('LYou are not logged in!')
    history.back()
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
    welcomeSent.innerText = "Your Cart Items";
    const nameSpan = document.createElement('span');
    // nameSpan.innerText = "Items"
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

window.addEventListener('load', () => {
    if(isLoggedIn != null && isLoggedIn == 'true'){
        fetch(`/cart_items/${window.localStorage.getItem('user_id')}`,).then(response => response.json()).then(json => {
            if(json['status'] == 200){
                if(json['data'].length == 0){
                    // TODO: display cart empty
                    const msgContainer = document.createElement('div')
                    msgContainer.className = "message-container"
                    const msg = document.createElement('h3')
                    msg.className = "message"
                    const msgText = document.createTextNode('No Items in cart');
                    msg.appendChild(msgText)
                    msgContainer.appendChild(msg)
                    cartSection.appendChild(msgContainer);
                    // msgContainer.appendChild(cartSection);
                }else{
                    // TODO : display the items
                    json['data'].forEach(e => {
                        console.log(e);
                        const prdContainer = document.createElement('div')
                        prdContainer.className = "product-container"
                        prdContainer.id = 'product-container';
                        const cartCard = document.createElement('div')
                        cartCard.className = 'cart-card'

                        const imageContainer = document.createElement('div')
                        imageContainer.className = "img"
                        const imgContainer = document.createElement('img')
                        imgContainer.className = "image-container"
                        imgContainer.src = `${e['Image']}`;
                        imageContainer.appendChild(imgContainer)
                        cartCard.appendChild(imageContainer)

                        const descContainer = document.createElement('div')
                        descContainer.className = "desc-container"

                        const title = document.createElement('h2')
                        title.className = "card-title"
                        const titleText = document.createTextNode(`${e['Product_name']}`);
                        title.appendChild(titleText)    

                        const price = document.createElement('h3')
                        price.className = 'cart-price';
                        price.innerText = `Price: Rs ${e['price']}`
                        descContainer.appendChild(title)
                        descContainer.appendChild(price)


                        const cancelButton = document.createElement('button')
                        cancelButton.className = "cancel-button buttons" 
                        cancelButton.id = "cancel-button"
                        cancelButton.innerText = "Cancel"

                        const confirmButton = document.createElement('button')
                        confirmButton.className = "buttons confirm-button"
                        confirmButton.id = 'confirm-button'
                        confirmButton.innerText = "Confirm"

                        cancelButton.addEventListener('click', () => {

                            fetch(`/cancel_cart/${e['product_id']}`).then(response => response.json()).then(json => {
                                console.log(json);
                                if(json['status'] == 200){
                                    window.location.reload();
                                }
                            });
                        });

                        confirmButton.addEventListener('click', () => {
                            // console.log("ordered");
                            fetch('/add_to_orders',{
                                method: 'POST',
                                body: JSON.stringify({
                                   "prod_id": e['product_id'],
                                   "user_id": e['user_id'],
                                   "qty": 1,
                                   "price": e['price'],
                                   "cart_id": e['id'],
                                }),
                                headers: {
                                    "Content-type": 'application/json;charset=UTF-8'
                                }
                            }).then(response => response.json()).then(json => {
                                console.log(json);
                                if(json['status'] == 200){
                                    
                                    window.location.reload();
                                }
                            });
                        })
                        
                        const buttonContainer = document.createElement('div')
                        buttonContainer.className = 'button-container'
                        buttonContainer.append(cancelButton)
                        buttonContainer.appendChild(confirmButton)
                        descContainer.appendChild(buttonContainer)
                        cartCard.appendChild(descContainer);
                        prdContainer.appendChild(cartCard)
                        cartSection.appendChild(prdContainer);
                        

                    })
                    const amountContainer = document.createElement('div')
                    amountContainer.className = "total-amount-container";
                    amountContainer.id = "total-container"

                    const amountCardTitle = document.createElement('h2')
                    amountCardTitle.className= 'amountCardTitle'
                    amountCardTitle.innerText = "Total Amount"
                    amountContainer.appendChild(amountCardTitle);
                    json['data'].forEach(e => {

                        orderListCard(e['Product_name'], e['price'], amountContainer);
                    })
                    let mrg = 0;
                    if(json['data'].length % 2 == 0){
                        mrg = '40px';
                    }else{
                        mrg = '100px';
                    }
                    amountContainer.style.marginBottom = mrg;
                    let tAmt = 0;
                    json['data'].forEach(e => {
                        tAmt = tAmt + e['price']
                    })
                    orderListCard('Total', tAmt, amountContainer)
                    mainSection.appendChild(amountContainer);
                }
            }
        });
    }
});


function orderListCard(name, price, ammountContainer) {
    const orderListContainer = document.createElement('div')
    orderListContainer.className = "order-list-container";

    const orderName = document.createElement('h3')
    orderName.className = "order-name"

    const orderPrice = document.createElement('h3');
    orderPrice.className = "order-price";

    orderName.innerText = name;
    orderPrice.innerText = price;

    orderListContainer.appendChild(orderName);
    orderListContainer.appendChild(orderPrice);
    ammountContainer.appendChild(orderListContainer);
}