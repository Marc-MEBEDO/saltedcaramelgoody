import React, { Component } from 'react'
import { Meteor } from 'meteor/meteor';
import Breadcrumb from 'antd/lib/breadcrumb';
import { Link } from './Link';
//import Typography from 'antd/lib/typography';
//const { Link } = Typography;

export class OpinionBreadcrumb extends Component {
    constructor(props) {
        super(props);
        
        const {refOpinion, refDetail} = props;

        this.firstTime = true;
    }

    state = {
        loading: true,
        items: []
    }

    getBreadcrumbItems(refOpinion, refDetail){
        Meteor.call('opinionDetail.getBreadcrumbItems', {refOpinion, refDetail}, (err, result) => {
            if (!err) {
                this.setState({
                    items: result,
                    loading: false
                });
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { refOpinion, refDetail } = this.props;

        if (this.firstTime) {
            this.firstTime = false;
            this.getBreadcrumbItems(refOpinion, refDetail);
        } else {
            if (prevProps.refOpinion !== refOpinion || prevProps.refDetail !== refDetail) {
                this.getBreadcrumbItems(refOpinion, refDetail);
            }
        }
    }

    render() {
        const { items } = this.state;

        return (
            <Breadcrumb>
                {items.map( ({ title, uri }, index) => {
                    return (
                        <Breadcrumb.Item key={index}>
                            <Link href={uri}>{title}</Link>
                        </Breadcrumb.Item>
                    );
                })}
            </Breadcrumb>
        );
    }
}