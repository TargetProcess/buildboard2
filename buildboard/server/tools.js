class ToolBase {
    constructor(account, config) {
        this._url = config.url;
        this._account = account;
    }

    _get(resource) {
        return HTTP.get(this._url + `${this._account}/${resource}`).data[resource];
    }
}

PMTool = class PMTool extends ToolBase {
    getTasks() {
        return this._get('tasks');
    }
};

CodeTool = class CodeTool extends ToolBase {
    getBranches() {
        return this._get('branches');
    }
};

BuildTool = class BuildTool extends ToolBase {
    getBuilds() {
        return this._get('builds');
    }
};