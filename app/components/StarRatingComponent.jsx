import React from 'react';
import cx from 'classnames';

class StarRatingComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        };
    }

    componentWillReceiveProps() {
      this.setState({value: this.props.value});
    }

    onChange(value) {
        var editing = this.props.editing;
        if (!editing) {
            return;
        }
    }

    onStarClick(i, value, name) {
        const { onStarClick, editing } = this.props;
        if (!editing) {
            return;
        }
        onStarClick && onStarClick(i, value, name);
    }

    renderStars() {
        const { name, starCount, starColor, editing, renderStarIcon } = this.props;
        var value = this.props.value;
        const starStyles = {
            float: 'right',
            cursor: editing ? 'pointer' : 'default'
        };
        const radioStyles = {
            display: 'none',
            position: 'absolte',
            marginLeft: -9999
        };

        // populate stars
        var starNodes = [];
        for (let i = starCount; i > 0; i--) {
            const id = `${name}_${i}`;
            var starNodeInput = (
                <input
                    key={`input_${id}`}
                    style={radioStyles}
                    className="dv-star-rating-input"
                    type="radio"
                    name={name}
                    id={id}
                    value={i}
                    checked={value === i}
                    onChange={this.onChange.bind(this, i, name)}
                />
            );
            var starNodeLabel = (
                <label
                    key={`label_${id}`}
                    style={value >= i ? {float: starStyles.float, cursor: starStyles.cursor, color: starColor} : starStyles}
                    className="dv-star-rating-star"
                    htmlFor={id}
                    onClick={this.onStarClick.bind(this, i, value, name)}
                >
                {value < i
                  ? <i style={{fontStyle: 'normal'}}>&#9733;</i>
                  : <i style={{fontStyle: 'normal', color: '#FFD700'}}>&#9733;</i>
                }
                </label>
            );
            starNodes.push(starNodeInput);
            starNodes.push(starNodeLabel);
        }

        return starNodes;
    }

    render() {
        const { editing, className } = this.props;
        const classes = cx('dv-star-rating', {
            'dv-star-rating-non-editable': !editing
        }, className);

        return (
            <span style={{display: 'inline-block', position: 'relative', verticalAlign: 'middle'}} className={classes}>
                <span className="caption"><strong>{this.props.caption}</strong></span>
                {this.renderStars()}
            </span>
        );
    }
}

export default StarRatingComponent;
