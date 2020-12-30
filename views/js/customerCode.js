
var totalPrice = 0;

function loadItems(){
    fetch('/items')
    .then(res => res.json())
    .then(data => {
        let sizes = data.items.size;
        let toppings = data.items.topping;
        let bases = data.items.base;
        loadForm(sizes, 1);
        loadForm(bases, 2);
        loadForm(toppings, 3);
        addCheckBoxListener();
    });
}


function loadForm(data, position){
    let elem;
    if (position == '1') elem = document.getElementById('size');
    if (position == '2') elem = document.getElementById('base');
    if (position == '3') elem = document.getElementById('topping');

    data.forEach(element => {
        if(element != null) {
            let div = document.createElement('div');
            div.classList.add('checkbox');
            let input = document.createElement('input');
            let label = document.createElement('label');
            input.type = "checkbox";
            input.setAttribute('data-price', element.price);
            input.id = element.name
            input.value = element.name;
            if(position=='1') input.name = 'size';
            if(position=='2') input.name = 'base';
            if(position=='3') input.name = 'topping';
            

            label.for = element.name;
            label.innerText = element.name;

            div.appendChild(input);
            div.appendChild(label);
            elem.appendChild(div);
        }
    });

}

loadItems();

$(document).ready(function() {
    $("#myForm").submit(function(event){
        event.preventDefault();
        alert('order placed!!!')
        var form = $(this);
        var url = form.attr('action');

        var toppings = [];
        // this part got from https://gist.github.com/batandwa/3135981
        $.each($("input[name='topping']:checked"), function(){
            toppings.push($(this).val());

        });

        var size = '';
        $.each($("input[name='size']:checked"), function(){
            size = $(this).val();
        });
        
        var base = '';
        $.each($("input[name='base']:checked"), function(){
            base = $(this).val();
        });

        var address = document.getElementById('address').value;
        var price = document.getElementById('price').value;

        // I have copied and modifyed this part of ajax call from https://stackoverflow.com/questions/425095/submit-form-using-ajax-and-jquery

        if(inputsAreValid()){
            $.ajax({
                type: "POST",
                url: url,
                dataType: 'text/json',
                data: {
                    address,
                    price,
                    size,
                    toppings,
                    base
   
                }, 
                success: function(data)
                {
                    alert(data.message)
                }
            });
        }

    });


});

function clearFields(){
    $('input:checkbox').prop('checked', false);
    document.getElementById('price').value = '';
    document.getElementById('address').value = '';
}

// I have got inspiration from this thread for this part https://stackoverflow.com/questions/5229023/how-do-i-check-uncheck-all-checkboxes-with-a-button-using-jquery
function addCheckBoxListener(){

        $("input:checkbox").on('click', function() {

        var $box = $(this);
        if ($box.is(":checked") ) {

            var group = "input:checkbox[name='" + $box.attr("name") + "']";

            if($box.attr("name") != 'topping'){
                $(group).prop("checked", false);
            }
            $box.prop("checked", true);
            
        } else {
            $box.prop("checked", false);
        }
        updatePrice();
        });

}

function inputsAreValid(){
    let isValid = true;
    if($('div.checkbox-group.required :checkbox:checked').length == 0) {
        alert('checkboxes are required');
        isValid = false;
    }
    return isValid;
}

function updatePrice(){
    totalPrice = 0;

   $("input[type='checkbox']:checked").each(function () {
        totalPrice += Number($(this).attr('data-price'));
    });

    document.getElementById('price').value = totalPrice;

}



