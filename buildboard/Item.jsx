Item = React.createClass({
        displayName: 'Item',
        _getProperty(object, prop) {
            return object && object[prop] || '';
        },
        render(){
            return (
                <tr>
                    <td className="mdl-data-table__cell--non-numeric">{this._getProperty(this.props.branch,'name')}</td>
                    <td className="mdl-data-table__cell--non-numeric">{this._getProperty(this.props.task,'name')}</td>
                </tr>
            );
        }
    }
);