
App = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {
        return {
            items: Items.find({}).fetch(),
            account:this.props.account
        };
    },
    render(){
        return <ItemList {...this.data}/>;
   }
});