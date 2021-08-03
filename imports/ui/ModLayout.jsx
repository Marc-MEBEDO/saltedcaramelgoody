import React, { Fragment, useState } from 'react';

import Collapse from 'antd/lib/collapse';
import Form from 'antd/lib/form';
import Input from 'antd/lib/input';
import DatePicker from 'antd/lib/date-picker';

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';

const { Panel } = Collapse;

import { 
    ctCollapsible, ctInlineCombination,
    ctStringInput, ctDateInput } from '../../imports/coreapi/controltypes';

const getLabel = elem => {
    return (elem.noTitle ? '' : elem.title);
}

const LayoutElements = ({ elements, mod, mode }) => {
    return elements.map( (elem, index) => {
        if (elem.controlType === ctStringInput ) return <StringInput key={index} elem={elem} mod={mod} mode={mode} />
        if (elem.controlType === ctDateInput ) return <DateInput key={index} elem={elem} mod={mod} mode={mode} />
        
        if (elem.controlType === ctCollapsible ) return <Collapsible key={index} elem={elem} mod={mod} mode={mode} />
        if (elem.controlType === ctInlineCombination ) return <InlineCombination key={index} elem={elem} mod={mod} mode={mode} />
        
        return null;
    });
}

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

const StringInput = ({ elem, mod, mode }) => {
    console.log(mode);

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