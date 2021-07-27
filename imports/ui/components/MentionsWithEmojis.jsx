import React from 'react';
import Input from 'antd/lib/input';
//import Form from 'antd/lib/form';
//import Button from 'antd/lib/button';
import Mentions from 'antd/lib/mentions';

const { TextArea } = Input;

//https://unicode.org/emoji/charts/full-emoji-list.html
const emojisMap = [
    {emoji: "😀", s: "-)", e: 128512},
    {emoji: "😅", s: "-)", e: 128517},
    {emoji: "🤣", s: "-))", e: 129315},
    {emoji: "😂", s: "-)", e: 128514},
    {emoji: "😇", s: "-)", e: 128519},
    {emoji: "🤩", s: "-", e: 129321},
    {emoji: "😘", s: "kiss", e: 128536},
    {emoji: "🤭", s: "-", e: 129325},
    {emoji: "🤫", s: "psst", e: 129323},
    {emoji: "🤔", s: "-", e: 129300},
    {emoji: "😎", s: "cool", e: 128526},
    {emoji: "😳", s: "-", e: 128563},
    {emoji: "🙈", s: "affe", e: 128584},
    {emoji: "🙉", s: "affe", e: 128585},
    {emoji: "🙊", s: "affe", e: 128586},
    {emoji: "❤", s: "heart", e: 10084},
    {emoji: "💯", s: "100", e: 128175},
    {emoji: "👌", s: "", e: 128076},
    {emoji: "👍", s: "+1", e: 128077},
    {emoji: "👎", s: "-1", e: 128078},
    {emoji: "👏", s: "-", e: 128079}
];

import { debounce } from '../../api/helpers/basics';

export class MentionsWithEmojis extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            users: [],
            value: {
                mentions: {},
                text: ''
            }
        }

        this.loadUsers = debounce( (text, prefix) => {
            // only for mentions :-(
            if (prefix != '@') return;

            const { loading } = this.state;
            const { method, methodParams } = this.props;

            if (loading) return;
            this.setState( { loading: true } );

            Meteor.call(method /*'opinion.getSharedWith'*/, methodParams, text, (err, users) => {
                this.setState({
                    loading: false, 
                    users: err ? [] : users
                });
            });
        }, 350);
    }

    onSearch(text, prefix) {
        this.setState({prefix});
        
        if (prefix == '@') {
            this.loadUsers(text, prefix);
        }
    }

    onSelect(option, prefix) {
        if (prefix == "@") {
            // store the current mention selected to
            // check later
            let { value } = this.state;

            value.mentions[option.key] = option.value;
            this.setState({value});
        } else {
            setTimeout( _ => {
                let {value} = this.state;

                value.text = value.text.replace(':' + option.value, option.value);
                this.setState({value});
                
                if (this.props.onChange) this.props.onChange(value);
            }, 0);
        }
    }

    onChange(text) {
        let {value} = this.state
        value.text = text
        this.setState({value});

        if (this.props.onChange) this.props.onChange(value);
    }

    render() {
        const [ onSearch, onSelect, onChange ] = [ 'onSearch', 'onSelect', 'onChange' ].map( fn => this[fn].bind(this) );
        const { value, loading, users, prefix } = this.state;

        const filterEmojis = (input, option) => {
            if (prefix == '@') return true;

            // emojis
            const {search} = option;
            return search.startsWith(input);
        }

        const renderEmojiList = () => {
            return emojisMap.map(
                e => <Option key={e.emoji} value={e.emoji} search={e.s}>{e.emoji}</Option>
            )
        }

        return (
            
            <Mentions
                className={ prefix == ':' ? 'mbac-emojis-input' : null }
                prefix={['@',':']} 
                value={value.text}
                autoSize={true}
                loading={loading}
                onSearch={onSearch} onSelect={onSelect} onChange={onChange}
                filterOption={filterEmojis}
                disabled={this.props.disabled || false}
            >
                {prefix == '@' ?
                    users.map(({ userId, firstName, lastName }) => (
                        <Option key={userId} value={firstName + ' ' + lastName} >
                            {firstName + ' ' + lastName} 
                        </Option>
                    ))
                :
                    renderEmojiList()
                }
            </Mentions>
        );
    }
}