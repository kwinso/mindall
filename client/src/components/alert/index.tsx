// Pretty much ripped of react-alert-template-basic source code.

import React from "react";
import styles from "./styles.module.sass"

var BaseIcon = function BaseIcon(_ref: { color: string; pushRight?: any; children?: any; }) {
    var color = _ref.color,
        _ref$pushRight = _ref.pushRight,
        pushRight = _ref$pushRight === undefined ? true : _ref$pushRight,
        children = _ref.children;
    return React.createElement(
        'svg',
        {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '24',
            height: '24',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: color,
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            style: { marginRight: pushRight ? '20px' : '0', minWidth: 24 }
        },
        children
    );
};

var InfoIcon = function InfoIcon() {
    return React.createElement(
        BaseIcon,
        { color: '#2E9AFE' },
        React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
        React.createElement('line', { x1: '12', y1: '16', x2: '12', y2: '12' }),
        React.createElement('line', { x1: '12', y1: '8', x2: '12', y2: '8' })
    );
};

var SuccessIcon = function SuccessIcon() {
    return React.createElement(
        BaseIcon,
        { color: '#31B404' },
        React.createElement('path', { d: 'M22 11.08V12a10 10 0 1 1-5.93-9.14' }),
        React.createElement('polyline', { points: '22 4 12 14.01 9 11.01' })
    );
};

var ErrorIcon = function ErrorIcon() {
    return React.createElement(
        BaseIcon,
        { color: '#FF0040' },
        React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
        React.createElement('line', { x1: '12', y1: '8', x2: '12', y2: '12' }),
        React.createElement('line', { x1: '12', y1: '16', x2: '12', y2: '16' })
    );
};

var CloseIcon = function CloseIcon() {
    return React.createElement(
        BaseIcon,
        { color: '#FFFFFF', pushRight: false },
        React.createElement('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
        React.createElement('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
    );
};

//@ts-ignore
export const AlertTemplate = ({ options, message, close }) => (
    <div className={styles.alert}>
        {options.type === 'info' && <InfoIcon />}
        {options.type === 'success' && <SuccessIcon />}
        {options.type === 'error' && <ErrorIcon />}
        {message}
        {/* <button onClick={close}><CloseIcon /></button> */}
    </div>
)
