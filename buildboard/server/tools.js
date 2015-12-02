PMTool = class PMTool {
    constructor(config) {
        this._url = config.url;
    }

    getTasks() {
        return HTTP.get(this._url + 'tasks').data.tasks;
    }
};

CodeTool = class CodeTool {
    constructor(config) {
        this._url = config.url;
    }

    getBranches() {
        return HTTP.get(this._url + 'branches').data.branches;
    }
};

BuildTool = class BuildTool {
    constructor(config) {
        this._url = config.url;
    }

    getBuilds() {
        return HTTP.get(this._url + 'builds').data.builds;
    }
};