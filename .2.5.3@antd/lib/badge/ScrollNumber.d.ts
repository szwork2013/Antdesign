/// <reference types="react" />
import React from 'react';
import { Component } from 'react';
export interface ScrollNumberProps {
    prefixCls?: string;
    className?: string;
    count?: string | number;
    component?: string;
    onAnimated?: Function;
    height?: number;
    style?: React.CSSProperties;
}
export default class ScrollNumber extends Component<ScrollNumberProps, any> {
    static defaultProps: {
        prefixCls: string;
        count: null;
        onAnimated(): void;
        height: number;
    };
    lastCount: any;
    constructor(props: any);
    componentDidMount(): void;
    getPositionByNum(num: any, i: any): any;
    componentWillReceiveProps(nextProps: any): void;
    renderNumberList(position: any): React.ReactElement<any>[];
    renderCurrentNumber(num: any, i: any): React.DOMElement<{
        className: string;
        style: {
            transition: string;
            WebkitTransform: string;
            transform: string;
            height: number | undefined;
        };
        key: any;
    }, Element>;
    renderNumberElement(): any;
    render(): React.DOMElement<any, Element>;
}