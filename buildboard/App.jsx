
App = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        return {
            items: Items.find({}).fetch()
        };
    },
    render(){
        return <ItemList {...this.data}/>;
   }
});