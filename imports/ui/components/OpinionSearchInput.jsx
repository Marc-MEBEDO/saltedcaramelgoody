import { Meteor } from 'meteor/meteor';
import React from 'react';
import Select from 'antd/lib/select';

import { debounce } from '../../api/helpers/basics';

const { Option } = Select;

export class OpinionSearchInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            data: props.value ? [ props.value ] : [],
            value: props.value || null,
        };
      
        const searchMethod = 'opinions.getSharedOpinions';

        this.handleSearch = debounce( userSearchStr => {
            this.setState({ loading: true });

            Meteor.call(searchMethod, userSearchStr, (err, data) => {
                this.setState({
                    loading: false, 
                    data: err ? [] : data
                });
            });
        }, 300);
    }

    handleChange = value => {
        const { onChange } = this.props;

        this.setState({ value });
        if (onChange) onChange(value);
    };
  
    render() {
        const { value } = this.state;
        const options = this.state.data.map(d => <Option key={d._id} value={d._id}>{d.title}</Option>);

        return (
            <Select
                autoFocus={!!this.props.autoFocus}
                showSearch
                value={value}
                placeholder={this.props.placeholder}
                style={this.props.style || {width:'100%'}}
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