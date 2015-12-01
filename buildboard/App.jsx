App = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {

        return {
            items: Items.find({}).fetch()
        };
    },

    render(){
        return <div>{this.data.items.map(item=>{return <div key={item._id}>{JSON.stringify(item)}<br/></div>})}</div>;
   }
});