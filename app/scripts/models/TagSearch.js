/**
 * Return search in tag
 */
class TagSearch extends Search { // eslint-disable-line
    constructor(data, search, tagType) {
        super(data, search);
        this._type = tagType

    }

    /**
     * Get result of research
     * 
     * @returns {Array} result
     */
    getResult() {
        const length = this._data.length;
        let result = [];
        for (let index = 0; index < length; index++) {
            const element = this._data[index];
            let valid;
            if (element[this._type]) {
                if (this._type === 'ingredients') {
                    const typesLength = element.ingredients.length;
                    let ingredients = [];
                    for (let index = 0; index < typesLength; index++) {
                        ingredients.push(element.ingredients[index].ingredient);
                    }
                    valid = this.search(ingredients, this._search);
                } else {
                    valid = this.search(element[this._type], this._search);
                }
            }

            if (valid.length > 0) {
                for (let index = 0; index < valid.length; index++) {
                    const element = valid[index];
                    if (result.indexOf(element) === -1) {
                        result.push(element)
                    }
                }
            }
        }

        return result;
    }
}