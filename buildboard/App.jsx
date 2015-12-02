const List = Meteor.npmRequire('material-ui/lib/lists/list');
const ListDivider = Meteor.npmRequire('material-ui/lib/lists/list-divider');
const ListItem = Meteor.npmRequire('material-ui/lib/lists/list-item');

App = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {

        return {
            items: Items.find({}).fetch()
        };
    },

    renderItems(items){
        return items.map(item=> {
            return (<ListItem key={item._id}
                              primaryText={item.branch.name}
            />);
        });
    },

    render(){
        return (<List>
            {renderItems(this.data.items)}
        </List>)

   }
});