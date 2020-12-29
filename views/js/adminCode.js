// window.onload = fetch("../../ingredients.json")
// .then(response => {
//    return response.json();
// })
// .then(data => console.log(data));

function loadItems(){
    console.log('hello there');
    fetch('/items')
    .then(res => res.json())
    .then(data => {
        console.log(data);
    })
}

loadItems();