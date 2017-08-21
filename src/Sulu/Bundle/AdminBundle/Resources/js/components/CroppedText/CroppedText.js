// @flow
import React from 'react';
import croppedTextStyle from './croppedText.scss';

type Props = {
    children: string,
};

export default class CroppedText extends React.PureComponent<Props> {
    static renderBackText(text: string) {
        return text.split('').reverse().map((character, index) => <span key={index}>{character}</span>);
    }

    render() {
        const index = Math.ceil(this.props.children.length / 2);
        const frontText = this.props.children.substr(0, index);
        const backText = this.props.children.substr(index);
        return (
            <div
                title={this.props.children}
                aria-label={this.props.children}
                className={croppedTextStyle.croppedText}>
                <div className={croppedTextStyle.whole}>{this.props.children}</div>
                <div className={croppedTextStyle.front} aria-hidden={true}>{frontText}</div>
                <div className={croppedTextStyle.back} aria-hidden={true}>{CroppedText.renderBackText(backText)}</div>
            </div>
        );
    }
}
