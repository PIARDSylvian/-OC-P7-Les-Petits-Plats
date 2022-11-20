const generalSearch = document.querySelector('#search');
generalSearch.addEventListener("keyup", function(e){
    if(this.value.length >= 3) {
        searchRecipes(this.value);
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

function renderRecipes() {
    let toRender;
    if (data.length > 0) {
        toRender = data;
    } else {
        toRender = recipes;
    }

    let toRenderLength = toRender.length;
    document.querySelector('#results').innerHTML = "";
    for (let index = 0; index < toRenderLength; index++) {
        const recipe = toRender[index];

        const cardContainer = document.createElement('div');
        cardContainer.classList.add('col-12', 'col-md-4');
        const card = document.createElement('div');
        card.classList.add('card');
        const img = document.createElement('img');
        img.classList.add('card-img-top');
        card.append(img)
        const body = document.createElement('div');
        body.classList.add('card-body');
        const title = document.createElement('h5');
        title.innerText = recipe.name;
        body.append(title);
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
    init();
}

function init() {
    renderTagList(document.querySelector('#ingredients~.dropdown-menu'), searchTag('', 'ingredients'));
    renderTagList(document.querySelector('#appliance~.dropdown-menu'), searchTag('', 'appliance'));
    renderTagList(document.querySelector('#ustensils~.dropdown-menu'), searchTag('', 'ustensils'));
    renderRecipes();
}

init();