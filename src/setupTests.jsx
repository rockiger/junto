import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Mock gapi
global.window.gapi = {
    load: (name, callback) => { },
};

configure({ adapter: new Adapter() });