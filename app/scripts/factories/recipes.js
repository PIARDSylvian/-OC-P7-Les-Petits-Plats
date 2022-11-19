/**
 * Retrun data of recipes (tags or recipes)
 * 
 * @param {Array} data
 * @param {string} search
 * @param {string} type
 * @param {string} tagType
 * @param {Array} tags
 * 
 * @returns {object} mediaObject for call getMediaCardDOM();
 */
 function recipesFactory(data, search, type, tagType, tags) { // eslint-disable-line
    if(type === 'tag') {
        return new TagSearch(data, search, tagType); // eslint-disable-line
    } else if(type === 'recipes') {
        return new RecipesSearch(data, search, tags); // eslint-disable-line
    } else {
        throw 'Unknown type format'
    }
}