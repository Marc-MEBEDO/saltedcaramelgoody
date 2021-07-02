import { Meteor } from 'meteor/meteor';
import React from 'react';
import Select from 'antd/lib/select';

import { debounce } from '../../api/helpers/basics';

const { Option } = Select;


export class UserSearchInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: props.value ? [ props.value ] : [],
            value: props.value || null,
        };
      
        const searchMethod = 'users.' + this.props.searchMethod || 'getExperts';

        this.handleSearch = debounce( userSearchStr => {
            const { refOpinion } = this.props;

            this.setState({ loading: true });

            Meteor.call(searchMethod, refOpinion, userSearchStr, (err, users) => {
                this.setState({
                    loading: false, 
                    data: err ? [] : users
                });
            });
        }, 300);
    }

    handleChange = value => {
        const { onChange } = this.props;
        const { data } = this.state;

        const newValue = data.find( item => item.userId === value );

        this.setState({ value: newValue });
        if (onChange) onChange(newValue);

        this.waitForComponentDidUpdate = true;
    };
  
    componentDidUpdate(prevProps) {
        if (this.waitForComponentDidUpdate) {
            this.waitForComponentDidUpdate = false;
            return;
        }

        if (prevProps.value !== this.props.value) {
            // value changed from outside the component
            this.setState({
                value: this.props.value,
                data: [ this.props.value ]
            })
        }
    }

    render() {
        const { value } = this.state;
        const options = this.state.data.map(d => <Option key={d.userId} value={d.userId}>{(d.firstName || '') + (d.firstName ? ' ':'') + d.lastName + ' (' + d.username + ')'}</Option>);

        return (
            <Select
                autoFocus={!!this.props.autoFocus}
                showSearch
                value={value && value.userId}
                placeholder={this.props.placeholder}
                style={this.props.style || {width:'100%'}}
                //defaultActiveFirstOption={false}
                showArrow={true}
                filterOption={false}
                onSearch={this.handleSearch}
                onChange={this.handleChange}
                notFoundContent={null}
                allowClear={true}
            >
                { options }
            </Select>
        );
    }
  }