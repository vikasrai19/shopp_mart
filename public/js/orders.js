const navHeaders = document.getElementById("nav-header-c");
var isLoggedIn = window.localStorage.getItem('isLoggedIn');
const titleButton = document.getElementById('title_o');

const cartSection = document.getElementById('cart-section');
// const mainSection = document.getElementById('main-section');

titleButton.addEventListener('click', () =>{
    window.location.href = "/";
})

const welcomeSection = document.getElementById("welcome-section");

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
        window.location.href = '/cart';
    });

    ordersButton.addEventListener('click', () => {
        
    });

    const signOut = document.createElement("h3");
    signOut.className = "nav-links";
    signOut.id = "signout-btn";
    const signOutText = document.createTextNode("Sign Out");
    signOut.appendChild(signOutText);
    navHeaders.appendChild(signOut);

    const welcomeSent = document.createElement('h1');
    welcomeSent.innerText = "Your Orders";
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
    console.log("Window loaded");
    if(isLoggedIn != null && isLoggedIn == 'true'){
        fetch(`/order_items/${window.localStorage.getItem('user_id')}`,).then(response => response.json()).then(json => {
            if(json['status'] == 200){
                console.log(json['data'])
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

                        const orderStatus = document.createElement('h4')
                        orderStatus.className = 'order-status'
                        orderStatus.innerText = `Order Status: ${e['order_status']}`
                        descContainer.appendChild(title)
                        descContainer.appendChild(price)
                        descContainer.append(orderStatus);
                        cartCard.appendChild(descContainer);
                        prdContainer.appendChild(cartCard)
                        cartSection.appendChild(prdContainer);
                        

                    })
                   
                }
            }
        });
    }
});