App = React.createClass({
    mixins: [ReactMeteorData],
    getMeteorData() {

        return {
            items: Items.find({}).fetch()
        };
    },

    render(){
        return <div>{this.data.items.map(item=>{return <div key="{item.task.id}">{item.task.name}</div>})}</div>;
   }
});