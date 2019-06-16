import React, { Component } from 'react'
import {FaCocktail, FaHiking, FaShuttleVan, FaBeer} from 'react-icons/fa'
import Title from './Title';

export default class Services extends Component {
    state = {
        services: [
            {
                icon: <FaCocktail />,
                title: "free cocktails",
                info: 'Dolore sit voluptate aliqua ex adipisicing culpa minim sunt non et non.'
            },
            {
                icon: <FaHiking />,
                title: "Endless hiking",
                info: 'Dolore sit voluptate aliqua ex adipisicing culpa minim sunt non et non.'
            },
            {
                icon: <FaShuttleVan />,
                title: "free shuttle",
                info: 'Dolore sit voluptate aliqua ex adipisicing culpa minim sunt non et non.'
            },
            {
                icon: <FaBeer />,
                title: "strongest beer",
                info: 'Dolore sit voluptate aliqua ex adipisicing culpa minim sunt non et non.'
            },
            
        ]
    }
    render() {
        return (
            <section className="services">
                <Title title="Services" />
                <div className="services-center">
                    {this.state.services.map((item, index) => {
                        return <article key={index} className="service">
                            <span>{item.icon}</span>
                            <h6>{item.title}</h6>
                            <p>{item.info}</p>
                        </article>

                    })}
                </div>
            </section>
        )
    }
}
