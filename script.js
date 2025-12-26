$(document).ready(function () {

    let selectedIngredients = [];
    let selectedOptions = {};
    let basePrice = 12.99;
    let currentTotal = basePrice;

    const ingredientPrices = {
        'tomato': 0.99,
        'mushroom': 1.49,
        'bell-pepper': 1.29,
        'onion': 0.79,
        'olive': 1.99,
        'pepperoni': 2.99,
        'sausage': 3.49,
        'bacon': 3.99,
        'ham': 2.79,
        'mozzarella': 1.99,
        'parmesan': 2.49,
        'goat-cheese': 3.99
    };

    const optionPrices = {
        'double-cheese': 2.50,
        'extra-cheese': 1.99,
        'black-crust': 1.50
    };

    updateTotalPrice();

    $('.category-tab').on('click', function () {
        const category = $(this).data('category');

        $('.category-tab').removeClass('active');
        $(this).addClass('active');

        $('.ingredients-grid').removeClass('active');
        $(`.ingredients-grid[data-category="${category}"]`).addClass('active');
    });

    $('.ingredient-item').on('click', function () {
        const ingredient = $(this).data('ingredient');
        const price = parseFloat($(this).data('price'));

        selectedIngredients.push({ ingredient, price });
        addIngredientToPizza(ingredient);
        updateTotalPrice();
    });

    $('.option-item').on('click', function () {
        const option = $(this).data('option');
        const price = parseFloat($(this).data('price'));

        if (selectedOptions[option]) {
            delete selectedOptions[option];
            $(this).removeClass('active');
            removeOptionFromPizza(option);
        } else {
            selectedOptions[option] = price;
            $(this).addClass('active');
            addOptionToPizza(option);
        }

        updateTotalPrice();
    });

    $('#clearPizza').on('click', function () {
        selectedIngredients = [];
        selectedOptions = {};

        $('.ingredient-item').removeClass('selected');
        $('.option-item').removeClass('active');

        $('#pizzaIngredients').empty();
        $('#pizzaBase').removeClass('black-crust double-cheese');
        $('.cheese-layer').remove();

        updateTotalPrice();

        $('#pizzaBase').addClass('fade-in');
        setTimeout(() => {
            $('#pizzaBase').removeClass('fade-in');
        }, 300);
    });

    function addIngredientToPizza(ingredient) {
        const $pizzaIngredients = $('#pizzaIngredients');
        const $ingredient = $(`<div class="pizza-ingredient ${ingredient}" data-ingredient="${ingredient}"></div>`);

        const position = getRandomPosition();
        $ingredient.css({
            left: position.x + 'px',
            top: position.y + 'px'
        });

        $ingredient.on('click', function () {
            const index = selectedIngredients.findIndex(obj => obj.ingredient === ingredient);
            if (index !== -1) {
                selectedIngredients.splice(index, 1);
            }
            $(this).fadeOut(200, function () {
                $(this).remove();
            });
            updateTotalPrice();
        });

        $pizzaIngredients.append($ingredient);
    }

    function addOptionToPizza(option) {
        const $pizzaBase = $('#pizzaBase');

        switch (option) {
            case 'double-cheese':
                $pizzaBase.addClass('double-cheese');
                break;
            case 'extra-cheese':
                if (!$('.cheese-layer').length) {
                    const $cheeseLayer = $('<div class="cheese-layer"></div>');
                    $pizzaBase.append($cheeseLayer);
                }
                break;
            case 'black-crust':
                $pizzaBase.addClass('black-crust');
                break;
        }
    }

    function removeOptionFromPizza(option) {
        const $pizzaBase = $('#pizzaBase');

        switch (option) {
            case 'double-cheese':
                $pizzaBase.removeClass('double-cheese');
                break;
            case 'extra-cheese':
                $('.cheese-layer').fadeOut(200, function () {
                    $(this).remove();
                });
                break;
            case 'black-crust':
                $pizzaBase.removeClass('black-crust');
                break;
        }
    }

    function updateTotalPrice() {
        let total = basePrice;

        selectedIngredients.forEach(obj => {
            total += obj.price;
        });

        Object.values(selectedOptions).forEach(price => {
            total += price;
        });

        currentTotal = total;

        const $priceValue = $('#totalPrice');
        $priceValue.addClass('updated');
        $priceValue.text(`$${total.toFixed(2)}`);

        setTimeout(() => {
            $priceValue.removeClass('updated');
        }, 500);
    }

    function getRandomPosition(xMin = 30, xMax = 270, yMin = 50, yMax = 300) {
        return {
            x: Math.floor(Math.random() * (xMax - xMin + 1)) + xMin,
            y: Math.floor(Math.random() * (yMax - yMin + 1)) + yMin
        };
    }
});