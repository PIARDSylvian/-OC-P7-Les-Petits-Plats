const generalSearch = document.querySelector('#search');
generalSearch.addEventListener("keyup", function(e){
    if(this.value.length >= 3) {
        searchRecipes(this.value);
    } else {
        renderRecipes();
    }
});

function addSpinner(element) {
    element.innerHTML = '<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';
}

function removeSpinner(element) {
    element.innerHTML = '';
}

function renderTagList(dropdownMenu, tags) {
    tagsLength = tags.length;
    dropdownMenu.innerHTML = '';

    if (tagsLength === 0) {
            const tag = document.createElement('li');
            tag.classList.add('col-12', 'col-md-4');
            tag.innerText = 'Aucun resultat';
            dropdownMenu.append(tag);
    } else {
        if (tagsLength > 10) {
            dropdownMenu.classList.add('flex-row','flex-wrap','justify-content-start');
        } else {
            dropdownMenu.classList.remove('flex-row','flex-wrap','justify-content-start');
        }
        for (let index = 0; index < tagsLength; index++) {
            const element = tags[index];

            const selectedTags = document.querySelectorAll('#tags li');
            const selectedTagsLength = selectedTags.length;
            let selectedTag = false;
            if(selectedTagsLength > 0) {
                for (let index = 0; index < selectedTagsLength; index++) {
                    const tag = selectedTags[index];
                    if (tag.innerText === element) {
                        selectedTag = true;
                    }
                }
            }

            if (selectedTag) continue;

            const tag = document.createElement('li');
            tag.classList.add('col-12', 'col-md-4');
            tag.innerText = element
            tag.addEventListener('click', function(e){
                const tag = document.createElement('li');
                tag.innerText = this.innerText;
                const parentClassList = this.parentNode.classList;
                const bgClass = Array.from(parentClassList).filter(className => /^bg-*/.test(className));
                tag.classList.add(bgClass, 'badge');
                tag.dataset.type = this.parentNode.parentNode.querySelector('input').id;

                const remove = document.createElement('i');
                remove.classList.add('bi', 'bi-x-circle');

                remove.addEventListener('click',function(e){
                    this.parentNode.remove();
                    searchRecipes(document.querySelector('#search').value)
                })

                tag.append(remove);
                document.querySelector('#tags').append(tag);
                this.remove();
                searchRecipes(document.querySelector('#search').value)
            });
            dropdownMenu.append(tag);
        }
    }
}

const tagSearch = document.querySelectorAll('#ingredients, #appliance, #ustensils');
tagSearch.forEach(search => {
    search.addEventListener("keyup", function(e){
        const dropdownButton = this.parentNode.querySelector('label:not(.show)');
        const dropdownMenu = this.parentNode.querySelector('.dropdown-menu');
        if(this.value.length >= 3) {
            // Trigger click event on dropdown if not already  open
            if(dropdownButton) dropdownButton.click();
            addSpinner(dropdownMenu);
            const tags = searchTag(this.value, this.id);
            removeSpinner(dropdownMenu);
            renderTagList(dropdownMenu, tags)
        } else {
            addSpinner(dropdownMenu);
            tags = searchTag('', this.id);
            removeSpinner(dropdownMenu);
            renderTagList(dropdownMenu, tags);
        }
    });
});

let data = [];

function searchTag(value, tagType) {
    let result = null
    if (data.length > 0) {
        result = recipesFactory(data, value, 'tag', tagType);
    } else {
        result = recipesFactory(recipes, value, 'tag', tagType);
    }

    return result.getResult();
}

function getTags() {
    const tags = document.querySelectorAll('#tags li');
    tagsLength = tags.length;
    let result = [];
    for (let index = 0; index < tagsLength; index++) {
        let tag = [];
        tag.type = tags[index].dataset.type;
        tag.value = tags[index].innerText;
        result.push(tag);
    }

    return result;
}

function renderRecipes(isSearch = false) {
    let toRender;
    if (isSearch) {
        toRender = data;
    } else {
        toRender = recipes;
    }

    let toRenderLength = toRender.length;
    document.querySelector('#results').innerHTML = "";
    for (let index = 0; index < toRenderLength; index++) {
        const recipe = toRender[index];

        const cardContainer = document.createElement('div');
        cardContainer.classList.add('col-xs-12', 'col-md-6', 'col-lg-4'); 
        const card = document.createElement('div');
        card.classList.add('card');
        const img = document.createElement('img');
        img.classList.add('card-img-top');
        card.append(img)
        const body = document.createElement('div');
        body.classList.add('card-body', 'd-flex');

        const header = document.createElement('div');
        header.classList.add('card-header', 'd-flex', 'justify-content-between');
        const title = document.createElement('h5');
        title.innerText = recipe.name;

        const time = document.createElement('span');
        time.classList.add('d-flex', 'fw-bold');
        const timeIcon = document.createElement('i');
        timeIcon.classList.add('bi','bi-clock', 'me-1')
        time.append(timeIcon)
        time.innerHTML += recipe.time + "min";

        header.append(title, time);
        card.append(header);

        const ingredients = document.createElement('ul');
        ingredients.classList.add('p-0', 'me-2', 'm-0');
        const ingredientsLength = recipe.ingredients.length
        for (let index = 0; index < ingredientsLength; index++) {
            const ingredient = document.createElement('li');
            const ingredientName = document.createElement('span');
            ingredientName.classList.add('fw-bold')
            ingredientName.innerText = recipe.ingredients[index].ingredient
            let unit = '';
            if (recipe.ingredients[index].unit) {
                unit = recipe.ingredients[index].unit.split(' ')[0]
            }
            if(unit.length > 2) unit = ' '+ unit;

            let quantity = recipe.ingredients[index].quantity;
            if(quantity) {
                ingredientName.innerText += ": ";
                ingredient.innerText = quantity + unit;
            }

            ingredient.prepend(ingredientName);
            ingredients.append(ingredient)
        }
        body.append(ingredients)

        const description = document.createElement('p')
        description.classList.add('p-0', 'ms-2', 'm-0');
        if(recipe.description.length > 200) {
            description.innerText = recipe.description.slice(0, 200) + "...";

        } else {
            description.innerText = recipe.description;
        }

        body.append(description)

        card.append(body);
        cardContainer.append(card);

        document.querySelector('#results').append(cardContainer);
    }
}

function searchRecipes(value) {
    const tags = getTags(); 
    let result = null
    result = recipesFactory(recipes, value, 'recipes', null, tags);

    data = result.getResult();
    init(true);
}

function init(isSearch = false) {
    renderTagList(document.querySelector('#ingredients~.dropdown-menu'), searchTag('', 'ingredients'));
    renderTagList(document.querySelector('#appliance~.dropdown-menu'), searchTag('', 'appliance'));
    renderTagList(document.querySelector('#ustensils~.dropdown-menu'), searchTag('', 'ustensils'));
    renderRecipes(isSearch);
}

init(false);