import React, { Fragment, useState } from 'react';

import Collapse from 'antd/lib/collapse';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import Radio from 'antd/lib/radio';
import Divider from 'antd/lib/divider';
import Select from 'antd/lib/select';
import Spin from 'antd/lib/spin';
import List from 'antd/lib/list';
import Avatar from 'antd/lib/avatar';
import Image from 'antd/lib/image';
import Button from 'antd/lib/button';

import Space from 'antd/lib/space';
import message from 'antd/lib/message';

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';

const { Panel } = Collapse;
const { Option } = Select;

import { 
    ctCollapsible, ctInlineCombination,
    ctStringInput, ctOptionInput, ctDateInput,
    ctDivider,
    ctSingleModuleOption
} from '../../imports/coreapi/controltypes';

import { debounce } from '../coreapi/helpers/basics';

const getLabel = elem => {
    return (elem.noTitle ? '' : elem.title);
}

const LayoutElements = ({ elements, mod, mode }) => {
    return elements.map( (elem, index) => {
        if (elem.controlType === ctStringInput ) return <StringInput key={index} elem={elem} mod={mod} mode={mode} />
        if (elem.controlType === ctOptionInput ) return <OptionInput key={index} elem={elem} mod={mod} mode={mode} />
        if (elem.controlType === ctDateInput ) return <DateInput key={index} elem={elem} mod={mod} mode={mode} />
        
        if (elem.controlType === ctCollapsible ) return <Collapsible key={index} elem={elem} mod={mod} mode={mode} />
        if (elem.controlType === ctDivider ) return <DividerControl key={index} elem={elem} mod={mod} mode={mode} />
        if (elem.controlType === ctInlineCombination ) return <InlineCombination key={index} elem={elem} mod={mod} mode={mode} />

        if (elem.controlType === ctSingleModuleOption ) return <SingleModuleOption key={index} elem={elem} mod={mod} mode={mode} />

        return null;
    });
}

class ModuleListInput extends React.Component {
    constructor(props){
        super (props);

        const { productId, moduleId, fieldId, mode } = props;

        this.state = {
            currentInput: '',
            value: props.value || [],
            fetching: false,
            options: []
        }

        this.selectRef = React.createRef();

        this.onSearch = debounce( currentInput => {
            const { value } = this.state;

            Meteor.call('modules.getModuleOptions', { productId, moduleId, fieldId, mode, currentInput, values: value }, (err, options) => {
                if (err) {
                    message.error('Es ist ein unbekannter Systemfehler aufgetreten. Bitte wenden Sie sich an den Systemadministrator.' + err.message);
                    this.setState({ fetching: false });
                } else {
                    this.setState({ options, fetching: false });
                }
            });
        }, 600, false, () => {
            this.setState({ fetching: true });
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.value !== this.props.value) {
            this.setState({ value: this.props.value });
        }
    }

    onSelectChange(selectedId) {        
        const { options, value } = this.state;
        const { targetProductId, targetModuleId } = this.props;

        const found = options.find( i => i._id === selectedId );
        
        const newValues = value.concat([{ 
            _id: selectedId, 
            title: found.title,
            imageUrl: found.imageUrl,
            description: found.description,
            link: found.link //`/records/${targetProductId}/${targetModuleId}/${v.value}`
        }]);
        this.setState({ value: newValues, currentInput: '' });

        const { onChange } = this.props;
        if (onChange) onChange(newValues);
    }

    removeSeletedItem({ _id }) {
        const { value } = this.state;
        const { onChange } = this.props;

        const newValues = value.filter( item => _id !== item._id);
        this.setState({ value: newValues });

        if (onChange) onChange(newValues);
    }

    render() {
        const { currentInput, value, options, fetching } = this.state;
        const { hasDescription, hasImage, linkable, mode } = this.props;

        const onSearch = this.onSearch.bind(this);
        const onChange = this.onSelectChange.bind(this);
        const removeSeletedItem = this.removeSeletedItem.bind(this);

        const getActionButtons = item => {
            if (mode === 'EDIT') 
                return [
                    <Button type="link" onClick={ _ => removeSeletedItem(item) } icon={<DeleteOutlined />} ></Button>
                ]
            return null
        };

        return <Fragment>
            <List
                itemLayout="horizontal"
                dataSource={ value }
                renderItem={ item => 
                    <List.Item 
                        actions={getActionButtons(item)}
                    >
                        <List.Item.Meta
                            avatar={hasImage ? <Image src={item.imageUrl} width={48} /> : null}
                            title={
                                (linkable && item.link) ? <a href={item.link}>{item.title}</a> : <span>{item.title}</span>
                            }
                            description={(hasDescription ? <span style={{fontSize:10}}>{item.description}</span> : null)}
                        />
                    </List.Item>
                }
            />

            { mode === 'SHOW' ? null :
                <Select
                    ref={this.selectRef}
                    showSearch
                    value={currentInput}
                    filterOption={false}
                    onSearch={onSearch}
                    onChange={onChange}
                    loading={fetching}
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                >
                    { 
                        options.map( ({ _id, title, imageUrl, description }) => {
                            return (
                                <Option key={_id} value={_id}>
                                    { hasImage ? <Image src={imageUrl} width={32} /> : null }
                                    <span>{title}</span>
                                    { hasDescription ? <br /> : null }
                                    { hasDescription ? <span style={{fontSize:10,color:'#ccc'}}>{description}</span> : null }
                                </Option>
                            );
                        })
                    }
                </Select>
            }
        </Fragment>
    }
}

const SingleModuleOption = ({ elem, mod, mode }) => {
    const [ fetching, setFetching ] = useState(false);
    const [ options, setOptions ] = useState([]);
    const [ selectedValues, setSelectedValues ] = useState([]);
    const [ enteredValue, setEnteredValue ] = useState('');

    const { _id, productId } = mod
    const moduleId = _id;
    
    const field = mod.fields[elem.field];
    const
        targetProductId = field.productId,
        targetModuleId = field.moduleId;

    return (
        <Fragment>
            <Form.Item 
                label={getLabel(elem)}
                name={elem.field}
                //rules={rules}
            >
                <ModuleListInput
                    productId={productId}
                    moduleId={moduleId}
                    fieldId={elem.field}

                    targetProductId={targetProductId}
                    targetModuleId={targetModuleId}

                    mode={mode}

                    hasDescription={field.moduleDetails.hasDescription}
                    hasImage={field.moduleDetails.hasImage}
                    linkable={field.moduleDetails.linkable}
                />
            </Form.Item>

        </Fragment>
    )
}

/*
const SingleModuleOption = ({ elem, mod, mode }) => {
    const [ fetching, setFetching ] = useState(false);
    const [ options, setOptions ] = useState([]);
    const [ selectedValues, setSelectedValues ] = useState([]);
    const [ enteredValue, setEnteredValue ] = useState('');

    const { _id, productId } = mod
    const moduleId = _id;
    const fieldId = elem.field;

    const field = mod.fields[elem.field];
    const
        targetProductId = field.productId,
        targetModuleId = field.moduleId;

    const onSearch = debounce( value => {
        Meteor.call('modules.getModuleOptions', { productId, moduleId, fieldId, mode, value, selectedValues }, (err, options) => {
            if (err) {
                message.error('Es ist ein unbekannter Systemfehler aufgetreten. Bitte wenden Sie sich an den Systemadministrator.' + err.message);
            } else {
                setOptions(options);
            }
            setFetching(false);
        });
    }, 600, false, () => {
        setFetching(true);
    });

    const onChange = v => {        
        let description = '';
        let logoUri = null;

        const found = options.find( i => i._id === v.value );
        
        if (found) {
            description = found.firma1 + ' • ' + found.strasse + ' • ' + found.plz + ' ' + found.ort;
            logoUri = found.logoUri;
        }

        const newItem = { 
            _id: v.value, 
            title: v.label, 
            logoUri: logoUri,
            description,
            link: `/records/${targetProductId}/${targetModuleId}/${v.value}`
        }

        setSelectedValues(
            selectedValues.concat([ newItem ])
        );
        setEnteredValue('');
    }

    return (
        <Fragment>
            <Form.Item 
                label={getLabel(elem)}
                name={elem.field}
                //rules={rules}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={selectedValues}
                    renderItem={ item => 
                        <List.Item >
                            <List.Item.Meta
                                avatar={<Image src={item.logoUri} width={32} />}
                                title={
                                    item.link ? <a href={item.link}>{item.title}</a> : item.titel 
                                }
                                description={item.description}
                            />
                        </List.Item>
                    }
                />

                <Select
                    labelInValue
                    showSearch
                    //mode="multiple"
                    //tagRender={itemRender}
                    value={enteredValue}
                    filterOption={false}
                    onSearch={onSearch}
                    onChange={onChange}
                    loading={fetching}
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                >
                    { options.map( ({ _id, title }) => <Option key={_id} value={_id}>{title}</Option> ) }
                </Select>
            </Form.Item>

        </Fragment>
    )
}
*/

const InlineCombination = ({ elem, mod, mode }) => {
    return (
        <Row className="ant-form-item" style={{ display: 'flex', flexFlow:'row wrap' }}>
            <Col span={4} className="ant-form-item-label">
                <label>{getLabel(elem)}</label>
            </Col>
            <Col className="ant-form-item-control" style={{ display: 'flex', flexFlow:'row wrap' }}>
                <LayoutElements elements={elem.elements} mod={mod} mode={mode} />
            </Col>
        </Row>
    )
}

const OptionInput = ({ elem, mod, mode }) => {
    const { fields } = mod;
    let { rules } = fields[elem.field];

    if (rules && rules.length) {
        rules = rules.map(r => {
            if (r.customValidator) {
                return eval(r.customValidator);
            }
            return r;
        });
    }
    
    return (
        <Form.Item 
            label={getLabel(elem)}
            name={elem.field}
            rules={rules}
        >            
            <Radio.Group buttonStyle="outline" disabled={mode==='SHOW'}>
                <Space direction="horizontal">
                    { elem.values.map( v => <Radio.Button style={{['--radio-color']:v.color, ['--radio-bgcolor']:v.backgroundColor}} key={v._id} value={v._id} >{v.title}</Radio.Button> )}
                </Space>
            </Radio.Group>
        </Form.Item>
    )
}

const StringInput = ({ elem, mod, mode }) => {
    const { fields } = mod;
    let { rules } = fields[elem.field];

    if (rules && rules.length) {
        rules = rules.map(r => {
            if (r.customValidator) {
                return eval(r.customValidator);
            }
            return r;
        });
    }

    return (
        <Form.Item 
            label={getLabel(elem)}
            name={elem.field}
            rules={rules}
        >
            <Input className={mode} disabled={mode==='SHOW'} />
        </Form.Item>
    )
}

const DateInput = ({ elem, mod, mode }) => {   
    return (
        <Form.Item label={getLabel(elem)}>
            <DatePicker format='DD.MM.YYYY' />
        </Form.Item>
    )
}

const DividerControl = ({ elem, mod, mode }) => {
    return (
        <Divider orientation={elem.orientation || 'left'} >{elem.title}</Divider>
    );
}

const Collapsible = ({ elem, mod, mode }) => {
    return (
        <Collapse defaultActiveKey={elem.collapsedByDefault ? ['1'] : null}
            style={{marginBottom:16}}
        >
            <Panel header={getLabel(elem)} key="1">
                <LayoutElements elements={elem.elements} mod={mod} mode={mode} />
            </Panel>
        </Collapse>
    );
}

export const ModLayout = ({ product, mod, layoutName = 'default', mode }) => {
    // aktuell wird nur das default-layout unterstützt
    const layout = mod.layouts && (mod.layouts[layoutName] || mod.layouts.default);
    
    return (
        <LayoutElements elements={layout.elements} mod={mod} mode={mode} />
    )
}