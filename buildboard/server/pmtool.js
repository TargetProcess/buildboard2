PMTool = class PMTool {
    constructor(url) {
        this._url = url;
    }

    getTasks() {
        console.log(this._url);
        return HTTP.get(this._url + 'tasks').data.tasks;
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

