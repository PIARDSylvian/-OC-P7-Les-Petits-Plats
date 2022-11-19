const generalSearch = document.querySelector('#search');
generalSearch.addEventListener("keyup", function(e){
    if(this.value.length >= 3) {
        // TODO Call factory search
        console.log(this.value)
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
        }
        for (let index = 0; index < tagsLength; index++) {
            const element = tags[index];
            const tag = document.createElement('li');
            tag.classList.add('col-12', 'col-md-4');
            tag.innerText = element
            tag.addEventListener('click', function(e){
                const tag = document.createElement('li');
                tag.innerText = this.innerText;
                const parentClassList = this.parentNode.classList;
                const bgClass = Array.from(parentClassList).filter(className => /^bg-*/.test(className));
                tag.classList.add(bgClass, 'badge');

                const remove = document.createElement('i');
                remove.classList.add('bi', 'bi-x-circle');

                remove.addEventListener('click',function(e){
                    this.parentNode.remove();
                    // TODO call research
                })

                tag.append(remove);
                document.querySelector('#tags').append(tag);
                this.remove();
            });
            dropdownMenu.append(tag);
            // TODO call research
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
            const tags = searchRecipes(this.value, 'tag', this.id);
            removeSpinner(dropdownMenu);
            renderTagList(dropdownMenu, tags)
        } else {
            addSpinner(dropdownMenu);
            tags = searchRecipes('', 'tag', this.id);
            removeSpinner(dropdownMenu);
            renderTagList(dropdownMenu, tags);
        }
    });
});

let data = [];

function searchRecipes(value, tag, tagType) {
    let result = null
    if (data.length > 0) {
        result = recipesFactory(data, value, tag, tagType);
    } else {
        result = recipesFactory(recipes, value, tag, tagType);
    }

    return result.getResult();
}

function init() {
    renderTagList(document.querySelector('#ingredients~.dropdown-menu'), searchRecipes('', 'tag', 'ingredients'));
    renderTagList(document.querySelector('#appliance~.dropdown-menu'), searchRecipes('', 'tag', 'appliance'));
    renderTagList(document.querySelector('#ustensils~.dropdown-menu'), searchRecipes('', 'tag', 'ustensils'));
}

init();