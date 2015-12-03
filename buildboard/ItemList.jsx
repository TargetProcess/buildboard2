ItemList = React.createClass({
        displayName: 'ItemList',
        render(){
            return (
                <table className="mdl-data-table mdl-js-data-table">
                    <thead>
                    <tr>
                        <th className="mdl-data-table__cell--non-numeric">Branch name</th>
                        <th className="mdl-data-table__cell--non-numeric">Task name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.items.map((item)=>{return <Item account={this.props.account} key={item._id} id={item._id} {...item} />})}
                    </tbody>
                </table>
            );
        }
    }
);