ItemView = React.createClass({
        mixins: [ReactMeteorData],
        displayName: 'ItemView',
        getMeteorData() {
            return {
                item: Items.findOne({_id: this.props.id})
            };
        },
        render(){
            return (
                <div>{JSON.stringify(this.data.item)}</div>
            );
        }
    }
);