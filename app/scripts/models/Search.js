class Search {
    constructor(data, search) {
        this._data =  data,
        this._search = search

    }

    regSearch(data, search) {
        search = search.normalize("NFD").replace(/\p{Diacritic}/gu, "") //remove accents
        data = data.normalize("NFD").replace(/\p{Diacritic}/gu, "") //remove accents

        const reg = new RegExp(search,"gi");
        return reg.test(data);
    }

    search(data, search) {
        let result = [];
        if (typeof data === 'string') {
            let valid = this.regSearch(data, search);
            if (valid) result.push(data.toLowerCase());
        } else if (typeof data === 'object') {
            const dataLength = data.length;
            for (let index = 0; index < dataLength; index++) {
                const element = data[index];
                let valid = this.regSearch(element, search);
                if (valid) result.push(data[index].toLowerCase());
            }
        } else {
            throw 'Unknown data format'
        }
        
        return result;
    }
}