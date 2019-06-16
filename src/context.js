import React, { Component } from "react";
// import items from "./data";
import Client from './Contentful';

const RoomContext = React.createContext();

//

class RoomProvider extends Component {
    state = {
        rooms: [],
        sortedRooms: [],
        featuredRooms: [],
        loading: true
    };

    // getData
    getData = async () => {
        try {
            this.setState({ loading: true });
            let response = await Client.getEntries({
                content_type: "beach-resort",
                order: "fields.price"
            });
            let rooms = this.formatData(response.items);
            let featuredRooms = rooms.filter(room => room.featured);
            let maxPrice = Math.max(...rooms.map(item => item.price));
            let price = maxPrice;
            let maxSize = Math.max(...rooms.map(item => item.size));

            this.setState({
                rooms: rooms,
                sortedRooms: rooms,
                featuredRooms: featuredRooms,
                loading: false,
                type: "all",
                capacity: 1,
                price: price,
                minPrice: 0,
                maxPrice: maxPrice,
                minSize: 0,
                maxSize: maxSize,
                breakfast: false,
                pets: false
            });

        } catch (error) {
            console.log(error);
        }
    }


    componentDidMount() {
        this.getData();
    }

    handleChange = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = event.target.name;
        this.setState({
            [name]: value
        }, this.filterRooms)
    };

    filterRooms = () => {
        let {
            rooms,
            type,
            capacity,
            price,
            minSize,
            maxSize,
            breakfast,
            pets
        } = this.state;

        // all the rooms
        let tempRooms = [...rooms];

        // transform value
        capacity = parseInt(capacity)
        price = parseInt(price)

        // filter by type
        if (type !== 'all') {
            tempRooms = tempRooms.filter(room => room.type === type)
        }

        // filter by capacity
        if (capacity !== 1) {
            tempRooms = tempRooms.filter(room => room.capacity >= capacity);
        }

        // filter by price
        tempRooms = tempRooms.filter(room => room.price <= price);

        // filter by size
        tempRooms = tempRooms.filter(room => room.size >= minSize && room.size <= maxSize);

        // breakfast 
        if (breakfast) {
            tempRooms = tempRooms.filter(room => room.breakfast);
        }

        // pets allowed
        if (pets) {
            tempRooms = tempRooms.filter(room => room.pets);
        }
        this.setState({
            sortedRooms: tempRooms
        })
    };

    formatData = items => {
        let tempItems = items.map(item => {
            let id = item.sys.id;
            let images = item.fields.images.map(image => {
                return image.fields.file.url;
            });
            let room = { ...item.fields, images, id };
            return room;
        });
        return tempItems;
    };

    getRoom = slug => {
        let tempRooms = [...this.state.rooms];
        const room = tempRooms.find(room => room.slug === slug);
        return room;
    };

    render() {
        return (
            <RoomContext.Provider
                value={{
                    ...this.state,
                    getRoom: this.getRoom,
                    handleChange: this.handleChange
                }}
            >
                {this.props.children}
            </RoomContext.Provider>
        );
    }
}

const RoomConsumer = RoomContext.Consumer;

export function withRoomConsumer(Component) {
    return function ConsumerWrapper(props) {
        return (
            <RoomConsumer>
                {value => <Component {...props} context={value} />}
            </RoomConsumer>
        );
    };
}

export { RoomProvider, RoomConsumer, RoomContext };
