/* eslint-disable flowtype/require-valid-file-annotation */
import {shallow, render} from 'enzyme';
import React from 'react';
import Radio from '../Radio';

test('The component should render in unchecked state', () => {
    const radio = render(<Radio checked={false}>My radio</Radio>);
    expect(radio).toMatchSnapshot();
});

test('The component should render in checked state', () => {
    const radio = render(<Radio checked={true}>My radio</Radio>);
    expect(radio).toMatchSnapshot();
});

test('The component should render without children', () => {
    const radio = render(<Radio checked={true} />);
    expect(radio).toMatchSnapshot();
});

test('A click on the button should trigger the change callback', () => {
    const onChangeSpy = jest.fn();
    const radio = shallow(<Radio value="my-radio" checked={false} onChange={onChangeSpy}>My radio</Radio>);
    radio.find('input').simulate('change');
    expect(onChangeSpy).toHaveBeenCalledWith('my-radio');
});
