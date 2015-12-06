class ToolBase {
    constructor(accountToken, config) {
        if (config) {
            this._url = config.url;
            this._accountToken = accountToken;
        }
    }

    _get(resource) {
        if (this._url) {
            var url = this._url + `/${resource}?token=${this._accountToken}&take=1000`;

            var result = [];
            while (url) {
                var items = HTTP.get(url).data;
                result = result.concat(items[resource]);
                url = items.next;
            }
            return result;
        }
        else {
            return [];
        }
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