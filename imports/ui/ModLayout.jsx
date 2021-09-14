import React, { Fragment, useEffect, useMemo, useState } from 'react';

import Collapse from 'antd/lib/collapse';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';
import Radio from 'antd/lib/radio';
import Divider from 'antd/lib/divider';
import Select from 'antd/lib/select';
import Spin from 'antd/lib/spin';
import List from 'antd/lib/list';
import Skeleton from 'antd/lib/skeleton';
import Avatar from 'antd/lib/avatar';
import Table from 'antd/lib/table';
import Image from 'antd/lib/image';
import Button from 'antd/lib/button';

import Space from 'antd/lib/space';
import message from 'antd/lib/message';

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import { Summernote } from '../ui/components/Summernote';

import { withTracker } from 'meteor/react-meteor-data';

import moment from 'moment';
import localization from 'moment/locale/de';


const { Panel } = Collapse;
const { Option } = Select;

import { 
    ctCollapsible, ctInlineCombination,
    ctStringInput, ctOptionInput, ctDateInput,
    ctDivider,
    ctSingleModuleOption,
    ctReport,
    ctColumns,
    ctGoogleMap,
    ctHtmlInput,
    ctDatespanInput
} from '../../imports/coreapi/controltypes';

import { debounce, deepClone } from '../coreapi/helpers/basics';

import { getModuleStore } from '../coreapi'; // wird für eval() funktionen benötigt
import { check } from 'meteor/check'; // wird für eval() funktionen benötigt

import { useOnce, useWhenChanged } from '../coreapi/helpers/react-hooks';

const getLabel = (elem, fields) => {
    if (elem.noTitle) return '';

    if (elem.title) return elem.title;

    return fields[elem.field].title;
}

const LayoutElements = ({ elements, mod, defaults, record, mode, onValuesChange }) => {
    return elements.map( (elem, index) => {
        const key = elem.field || index;

        if (elem.controlType === ctStringInput ) return <StringInput key={key} elem={elem} mod={mod} mode={mode} defaults={defaults} record={record} onValuesChange={onValuesChange} />
        if (elem.controlType === ctHtmlInput ) return <HtmlInput key={key} elem={elem} mod={mod} mode={mode} defaults={defaults} record={record} onValuesChange={onValuesChange} />
        if (elem.controlType === ctOptionInput ) return <OptionInput key={key} elem={elem} mod={mod} mode={mode} defaults={defaults} record={record} onValuesChange={onValuesChange} />
        if (elem.controlType === ctDateInput ) return <DateInput key={key} elem={elem} mod={mod} mode={mode} defaults={defaults} record={record} onValuesChange={onValuesChange} />
        if (elem.controlType === ctDatespanInput ) return <DatespanInput key={key} elem={elem} mod={mod} mode={mode} defaults={defaults} record={record} onValuesChange={onValuesChange} />
        
        if (elem.controlType === ctCollapsible ) return <Collapsible key={key} elem={elem} mod={mod} mode={mode} defaults={defaults} onValuesChange={onValuesChange} />
        if (elem.controlType === ctDivider ) return <DividerControl key={key} elem={elem} mod={mod} mode={mode} defaults={defaults} onValuesChange={onValuesChange} />
        if (elem.controlType === ctInlineCombination ) return <InlineCombination key={key} elem={elem} mod={mod} defaults={defaults} mode={mode} onValuesChange={onValuesChange} />

        if (elem.controlType === ctSingleModuleOption ) return <SingleModuleOption key={key} elem={elem} mod={mod} mode={mode} defaults={defaults} onValuesChange={onValuesChange} />

        if (elem.controlType === ctReport ) return <ReportControl key={key} reportId={elem.reportId} title={elem.title} mod={mod} mode={mode} defaults={defaults} record={record} onValuesChange={onValuesChange} />
        if (elem.controlType === ctColumns ) return <ColumnsLayout key={key} elem={elem} mod={mod} mode={mode} defaults={defaults} record={record} onValuesChange={onValuesChange} />
        if (elem.controlType === ctGoogleMap ) return <GoogleMap key={key} elem={elem} mod={mod} mode={mode} defaults={defaults} record={record} onValuesChange={onValuesChange} />

        return null;
    });
}


export const GoogleMap = ({ elem, mod, mode, defaults, record, onValuesChange }) => {
    const height = '500px', width = '100%';
    
    const [location, setLocation] = useState('');
    const [errEval, setErrEval] = useState('');

    let computeLocation = function() {
        console.warn('Die Funktion location für googleMaps lässt sich nicht evaluieren.\n' + errEval.message);
        return '';
    }

    try {
        computeLocation = eval(elem.googleMapDetails.location);
    }
    catch(err) {
        setErrEval(err);
    }

    useOnce( () => {
        try {
            const newLocation = computeLocation({ currentLocation:location, record, mode });
            if (newLocation !== location) setLocation(newLocation);
        } catch (err) {
            console.warn('Die Funktion computeLocation für googleMaps ist fehlerhaft.\n' + err.message);
        }
    });

    onValuesChange( (changedValues, allValues) => {
        try {
            const newLocation = computeLocation({ currentLocation:location, record, mode, allValues, changedValues });
            if (newLocation !== location) setLocation(newLocation);
        } catch (err) {
            console.warn('Die Funktion computeLocation für googleMaps ist fehlerhaft.\n' + err.message);
        }
    });

    const encodedLocation = encodeURIComponent(location);
    
    return (
        <div className="mapouter" style={{position:'relative',textAlign:'right', width, height, marginBottom:16 }}>
            <div className="gmap_canvas" style={{overflow:'hidden',background:'none!important', width, height}}>
                <iframe width={width} height={height} id="gmap_canvas" src={"https://maps.google.com/maps?q=" + encodedLocation + "&t=&z=15&ie=UTF8&iwloc=&output=embed"} frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0">
                </iframe>
                <br />
                <a href="https://www.embedgooglemap.net">google html code</a>
            </div>
        </div>
    );
}

export const ColumnsLayout = ({ elem, mod, mode, defaults, record, onValuesChange }) => {
    const { columns } = elem;

    return (
        <Row gutter={8}>
            { 
                columns.map( (col, colIndex) => {
                    const { columnDetails } = col;
                    return (
                        <Col key={colIndex} { ...columnDetails } >
                            <LayoutElements elements={col.elements} mod={mod} mode={mode} record={record} onValuesChange={onValuesChange} />
                        </Col>
                    );
                })
            }
        </Row>
    )
}

export class ReportStatic extends React.Component {
    state = {
        loading: true,
        data: []
    }

    loadData() {
        const reportId = this.props.report._id;
        const { reportParams } = this.props;
        
        let clonedReportParams = deepClone(reportParams, { transformDate: true, deleteCurrentUser: true });

        Meteor.call('reports.' + reportId,  { ...clonedReportParams }, (err, data) => {
            if (err) {
                message.error('Es ist ein unbekannter Systemfehler aufgetreten. Bitte wenden Sie sich an den Systemadministrator.' + err.message);
                if (!this.unmounted) this.setState({ loading: false });
            } else {
                //setTimeout( () => {
                    if (!this.unmounted) this.setState({ data, loading: false });
                //}, 500);
            }
        });
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.reportParams !== this.props.reportParams) {
            this.loadData();
        }
    }

    componentWillUnmount() {
		this.unmounted = true
	}

    render() {
        const { type, columns, title } = this.props.report;
        const { data, loading } = this.state;

        if (loading) return <Skeleton />;

        if (type == 'table') {
            //const pagination = { defaultPageSize:2, position: ['none', 'none' /*'bottomRight'*/] }
            const pagination = { position: ['none', 'none'] }
            return <Table rowKey="_id" dataSource={data} columns={columns} title={() => title } pagination={pagination} bordered />
        }

        return <div>Unbekannter Reporttype</div>
    }
}

export class ReportControl extends React.Component {
    constructor(props) {
        super(props);
        
        this.unmounted = true

        this.state = {
            loading : true,
            report: {}
        };
    }

    componentDidMount() {
        const { reportId } = this.props;
        
        this.unmounted = false;
        Meteor.call('reports.getReportDefinition', { reportId }, (err, report) => {
            if (err) {
                message.error('Es ist ein unbekannter Systemfehler aufgetreten. Bitte wenden Sie sich an den Systemadministrator.' + err.message);
                if (!this.unmounted) this.setState({ loading: false });
            } else {
                report.columns = report.columns.map( c => {
                    const fnCode = c.render;
                    if (fnCode) {
                        c.render = function renderColumn(col, doc) {
                            let renderer = eval(fnCode);
                            return renderer(col, doc, report.additionalData || {});
                        }
                    };
                    
                    return c;
                });

                if (!this.unmounted) {
                    this.setState({ report, loading: false });
                }
            }
        });
    }

    componentWillUnmount() {
		this.unmounted = true
	}

    render() {
        const { loading, report } = this.state;
        const { isStatic } = report;
        
        if (loading) return <Skeleton />;
        
        const reportParams = {
            defaults: this.props.defaults || {},
            record: this.props.record || {},
            mode: this.props.mode, 
            isServer: false,
        }
        if (isStatic) return <ReportStatic report={report} reportParams={reportParams} />

        return <ReportLiveData report={report} reportParams={reportParams} />
    }
}

class ReportLiveDataControl extends React.Component {
    render() {
        const { data, loading, report } = this.props;
        const { type, columns, title } = report;

        if (loading) return <Skeleton />;

        if (type == 'table') {
            return <Table rowKey="_id" dataSource={data} columns={columns} title={() => title + '(R)' } bordered />
        }

        return <div>Unbekannter Reporttype</div>
    }
}

export const ReportLiveData = withTracker( ({ report, mode, reportParams }) => {
    const { _id, liveData } = report;

    fnLiveData = eval(liveData);
    
    const subscription = Meteor.subscribe('reports.' + _id, reportParams);
   
    return {
        loading: !subscription.ready(),
        data: fnLiveData(reportParams).fetch()
    };
})(ReportLiveDataControl);


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
        const { hasDescription, hasImage, linkable, mode, maxItems = 999 } = this.props;

        const onSearch = this.onSearch.bind(this);
        const onChange = this.onSelectChange.bind(this);
        const removeSeletedItem = this.removeSeletedItem.bind(this);

        const getActionButtons = item => {
            if (mode === 'EDIT' || mode === 'NEW') 
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

            { mode === 'SHOW' || value.length >= maxItems ? null :
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
                                    { hasImage ? <Image src={imageUrl} width={48} style={{marginRight:8}} /> : null }
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

const SingleModuleOption = ({ elem, mod, mode, defaults, record, onValuesChange }) => {
    /*const [ fetching, setFetching ] = useState(false);
    const [ options, setOptions ] = useState([]);
    const [ selectedValues, setSelectedValues ] = useState([]);
    const [ enteredValue, setEnteredValue ] = useState('');*/

    const { _id, productId } = mod
    const moduleId = _id;
    
    const field = mod.fields[elem.field];
    const
        targetProductId = field.productId,
        targetModuleId = field.moduleId;

    return (
        <Fragment>
            <Form.Item 
                label={getLabel(elem, mod.fields)}
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
                    defaults={defaults}
                    record={record}

                    hasDescription={field.moduleDetails.hasDescription}
                    hasImage={field.moduleDetails.hasImage}
                    linkable={field.moduleDetails.linkable}

                    maxItems={1}
                />
            </Form.Item>

        </Fragment>
    )
}

const MultiModuleOption = ({ elem, mod, mode, defaults, record, onValuesChange }) => {
    const { _id, productId } = mod
    const moduleId = _id;
    
    const field = mod.fields[elem.field];
    const
        targetProductId = field.productId,
        targetModuleId = field.moduleId;

    return (
        <Fragment>
            <Form.Item 
                label={getLabel(elem, mod.fields)}
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
                    defaults={defaults}
                    record={record}

                    hasDescription={field.moduleDetails.hasDescription}
                    hasImage={field.moduleDetails.hasImage}
                    linkable={field.moduleDetails.linkable}

                    maxItems={999}
                />
            </Form.Item>

        </Fragment>
    )
}

const InlineCombination = ({ elem, mod, mode, defaults, record, onValuesChange }) => {
    return (
        <Row className="ant-form-item" style={{ display: 'flex', flexFlow:'row wrap' }}>
            <Col span={6} className="ant-form-item-label">
                <label>{getLabel(elem, mod.fields)}</label>
            </Col>
            <Col className="ant-form-item-control" style={{ display: 'flex', flexFlow:'row wrap' }}>
                <LayoutElements elements={elem.elements} mod={mod} mode={mode} defauls={defaults} record={record} onValuesChange={onValuesChange} />
            </Col>
        </Row>
    )
}

const GenericInputWrapper = ({ elem, mod, mode, onValuesChange, defaults, record, children }) => {
    const { fields } = mod;
    const { field, enabled, visible } = elem;
    let { rules, autoValue } = fields[field];
    const [disabled, setDisabled] = useState(mode === 'SHOW');
    const isEnabled = useMemo( () => (enabled ? eval(enabled) : () => true), [enabled] );

    useWhenChanged(mode, oldMode => {
        if (mode == 'EDIT') {
            // initialer Aufruf, wenn man aus dem SHOW in den EDIT-mode geht
            const d = !isEnabled({ allValues: record, mode, moment });
            if (d != disabled) setDisabled(d);
        } else if ( mode == 'SHOW' ) {
            if (!disabled) setDisabled(true);
        } else {
            // NEW
            const d = !isEnabled({ allValues: defaults, mode, moment });
            if (d != disabled) setDisabled(d);
        }
    });

    if (rules && rules.length) {
        rules = rules.map(r => {
            if (r.customValidator) {
                return eval(r.customValidator);
            }
            return r;
        });
    }
    
    if (autoValue) {
        recomputeValue = eval(autoValue);
        onValuesChange( (changedValues, allValues, setValue) => {            
            const newValue = recomputeValue({changedValues, allValues, moment});
            if (allValues[field] !== newValue)
                setValue(field, newValue);
        });
    }

    if (enabled && mode !== 'SHOW') {
        // immer dann aufrufen, wenn sich Werte geändert haben
        onValuesChange( (changedValues, allValues, setValue) => {            
            const d = !isEnabled({changedValues, allValues, mode, moment});
            if (d != disabled) setDisabled(d);
        });
    }

    return (
        <Form.Item 
            label={getLabel(elem, mod.fields)}
            name={field}
            rules={rules}
        >
            { 
                React.cloneElement(children, { className: mode, disabled })
            }
        </Form.Item>
    );
}

const StringInput = props => {
    const { mode } = props;

    return (
        <GenericInputWrapper {...props} >
            <Input  />
        </GenericInputWrapper>
    );
}

const DateInput = props => {   
    const { mode } = props;

    return (
        <GenericInputWrapper {...props} >
            <DatePicker format='DD.MM.YYYY' />
        </GenericInputWrapper>
    );
}

const DatespanInput = props => {
    const { mode } = props;

    return (
        <GenericInputWrapper {...props} >
            <DatePicker.RangePicker format='DD.MM.YYYY'  />
        </GenericInputWrapper>
    );
}


const HtmlInput = props => {
    const options = { 
        //airMode: true, 
        popover: {
            image: [
                ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
                ['float', ['floatLeft', 'floatRight', 'floatNone']],
                ['remove', ['removeMedia']]
            ],
            link: [
                ['link', ['linkDialogShow', 'unlink']]
            ],
            table: [
                ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
                ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
            ],
            air: [
                ['font', ['bold', 'underline', 'italic', 'superscript']],
                ['font1', ['clear']],
                ['color', ['forecolor', 'backcolor']],
                ['para', ['ul', 'ol']],
                ['para1', ['paragraph']],
                ['table', ['table']],
                ['link', ['linkDialogShow', 'unlink']],
                ['view', ['fullscreen', 'codeview']]
            ]
        }  
    };
    
    return (
        <GenericInputWrapper {...props} >
            <Summernote options={options} />
        </GenericInputWrapper>
    )
}

const OptionInput = props => {
    const { mode, elem } = props;

    return (
        <GenericInputWrapper {...props} >
            <Radio.Group buttonStyle="outline" disabled={mode==='SHOW'}>
                <Space direction={elem.direction || 'horizontal'}>
                    { elem.values.map( v => <Radio.Button style={{['--radio-color']:v.color, ['--radio-bgcolor']:v.backgroundColor}} key={v._id} value={v._id} >{v.title}</Radio.Button> )}
                </Space>
            </Radio.Group>
        </GenericInputWrapper>
    )
}

const DividerControl = ({ elem, mod, mode, defaults, record, onValuesChange }) => {
    return (
        <Divider orientation={elem.orientation || 'left'} >{elem.title}</Divider>
    );
}

const Collapsible = ({ elem, mod, mode, defaults, record, onValuesChange }) => {
    return (
        <Collapse defaultActiveKey={elem.collapsedByDefault ? ['1'] : null}
            style={{marginBottom:16}}
        >
            <Panel header={getLabel(elem, mod.fields)} key="1">
                <LayoutElements elements={elem.elements} mod={mod} mode={mode} defaults={defaults} record={record} onValuesChange={onValuesChange} />
            </Panel>
        </Collapse>
    );
}

export const ModLayout = ({ product, mod, defaults, record, layoutName = 'default', mode, onValuesChange }) => {
    // aktuell wird nur das default-layout unterstützt
    const layout = mod.layouts && (mod.layouts[layoutName] || mod.layouts.default);
    
    return (
        <LayoutElements elements={layout.elements} mod={mod} mode={mode} defaults={defaults} record={record} onValuesChange={onValuesChange} />
    )
}