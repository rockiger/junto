import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import GoogleLogin from '../components/googleLogin';

describe('GoogleLogin', () => {
    const props = {
        setIsSigningIn: (isSignedIn) => {},
    }
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <GoogleLogin {...props} />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(
            <GoogleLogin {...props} />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});