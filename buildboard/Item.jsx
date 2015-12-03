Item = React.createClass({
        displayName: 'Item',
        _getProperty(object, prop) {
            return object && object[prop] || '';
        },
        _redirect() {
            Router.go('/' + this.props.account + '/items/' + this.props.id);
        },
        render(){
            return (
                <tr onClick={this._redirect}>
                    <td className="mdl-data-table__cell--non-numeric">{this._getProperty(this.props.branch,'name')}</td>
                    <td className="mdl-data-table__cell--non-numeric">{this._getProperty(this.props.task,'name')}</td>
                </tr>
            );
        }
    }
);