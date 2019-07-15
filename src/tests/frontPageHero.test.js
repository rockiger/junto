import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import FrontPageHero from '../components/frontPageHero';

describe('FrontPageHero', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<FrontPageHero />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(<FrontPageHero />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});