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

const tagSearch = document.querySelectorAll('#ingredients, #appareils, #ustensiles');
tagSearch.forEach(search => {
    search.addEventListener("keyup", function(e){
        if(this.value.length >= 3) {
            // Trigger click event on dropdown if not already  open
            const dropdownButton = this.parentNode.querySelector('label:not(.show)');
            if(dropdownButton) dropdownButton.click();
            const dropdownMenu = this.parentNode.querySelector('.dropdown-menu');
            addSpinner(dropdownMenu);

            // TODO Call factory search
            console.log(this.value)


            removeSpinner(dropdownMenu);

            // TODO Append filtered elements

            // If result have too much elements
            this.parentNode.querySelector('.dropdown-menu').classList.add('flex-row');
        }
    });
});