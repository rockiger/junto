import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import { MemoryRouter } from 'react-router-dom';

import Nav from '../components/nav';

describe('Nav', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(
            <MemoryRouter>
                <Nav />
            </MemoryRouter>, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    test('has a valid snapshot', () => {
        const component = renderer.create(
            <MemoryRouter>
                <Nav />
            </MemoryRouter>
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});