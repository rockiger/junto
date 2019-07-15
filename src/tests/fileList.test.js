import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import FileList from '../components/fileList';

describe('FileList', () => {
    const props = {
        setIsSigningIn: (isSignedIn) => {},
    };

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <FileList />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(
            <FileList />
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });

});