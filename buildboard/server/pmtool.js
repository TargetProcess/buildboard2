PMTool = class PMTool {
    constructor(url) {
        this._url = url;
    }

    getEntities() {
        console.log(this._url);
        return HTTP.get(this._url + 'entities').data.entities;
    }
};

CodeTool = class CodeTool {
    constructor(url) {
        this._url = url;
    }

    getBranches() {
        return HTTP.get(this._url + 'branches').data.branches;
    }
};

