// @flow
import {action, observable} from 'mobx';
import Action from './Action';
import Divider from './Divider';
import Dropdown from './Dropdown';
import Icon from '../Icon';
import Option from './Option';
import React from 'react';
import type {SelectData} from './types';
import {observer} from 'mobx-react';
import selectStyles from './select.scss';

@observer
export default class Select extends React.PureComponent {
    props: {
        value?: string,
        onChange?: (string) => void,
        children: Array<Option | Action | Divider>,
    };

    static defaultProps = {
        children: [],
    };

    @observable data: SelectData;
    @observable isOpen: boolean;

    componentWillMount() {
        this.setInitialData();
    }

    setInitialData() {
        React.Children.forEach(this.props.children, (child) => {
            if (!this.label || (this.props.value && this.props.value === child.props.value)) {
                this.setData({
                    value: child.props.value,
                    label: child.props.children,
                });
            }
        });
    }

    @action setData = (data: SelectData) => {
        if (this.data && this.props.onChange) {
            this.props.onChange(data.value);
        }
        this.data = data;
    };
    handleOptionClick = this.setData;

    render() {
        return (
            <div>
                <button className={selectStyles.button}>
                    {this.data.label}
                    <Icon className={selectStyles.icon} name="chevron-down" />
                </button>
                <Dropdown isOpen={this.isOpen}>
                    {React.Children.map(this.props.children, (child) => {
                        if (child.type === Option) {
                            child = React.cloneElement(child, {
                                onClick: this.handleOptionClick,
                                selected: child.props.value === this.data.value && !child.props.disabled,
                            });
                        }
                        return child;
                    })}
                </Dropdown>
            </div>
        );
    }
}
