/**
 * Return search in Recipes with tag
 */
class RecipesSearch extends Search { // eslint-disable-line
    constructor(data, search, tags) {
        super(data, search);
        this._tags = tags;

    }

    /**
     * Return true if tag is valid
     * 
     * @param {string | object} data 
     * @param {string} tag
     *  
     * @returns {boolean} 
     */
    tagValid(data, tag) {
        let valid = false;
        if (typeof data === 'string') {
            valid = data.toLowerCase() === tag;
        } else if (typeof data === 'object') {
            data.forEach(recipe => {
                if (recipe.toLowerCase() === tag)  valid = true;
            });
        } else {
            throw 'Unknown data format';
        }
    
        return valid;
    }

    /**
     * Get result of research
     * 
     * @returns {Array} result
     */
    getResult() {
        let result = [];
        this._data.forEach(recipe => {
            let valid = this.search(recipe.name, this._search);
            if (valid.length === 0) valid = this.search(recipe.description, this._search);
            if (valid.length === 0) valid = this.search(recipe.ingredients.map(ingredients => ingredients.ingredient), this._search);
            if (valid.length > 0) {
                let tagValid = true;
                this._tags.forEach(tag => {
                    if(tag.type === 'ingredients') {
                        if (tagValid) tagValid = this.tagValid(recipe.ingredients.map(ingredients => ingredients.ingredient), tag.value);
                    } else {
                        if (tagValid) tagValid = this.tagValid(recipe[tag.type], tag.value);
                    }
                });
                if (tagValid) result.push(recipe);
            }
        });

        return result;
    }
}