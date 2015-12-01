PMTool = class PMTool {
    constructor(url) {
        this._url = url;
    }

    getTasks() {
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

BuildTool = class BuildTool {
    constructor(url) {
        this._url = url;
    }

    getBuilds() {
        return HTTP.get(this._url + 'builds').data.builds;
    }
};