import React, { Component } from "react";
import ReviewContainer from 'containers/ReviewContainer';

class ReviewScreen extends Component {
    render() {
        return (
            <ReviewContainer navigation={this.props.navigation} />
        );
    }
};

export default ReviewScreen;