class ToolBase {
    constructor(accountToken, config) {
        this._url = config.url;
        this._accountToken = accountToken;
    }

    _get(resource) {
        var url = this._url + `/${resource}?token=${this._accountToken}`;
        console.log(url);
        return HTTP.get(url).data[resource];
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