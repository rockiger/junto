import React from 'react';

/*
 * Custom toolbar component including insertStar button and dropdowns
 */
const EditorToolbar = () => (
    <div id="toolbar">
        <span className="ql-formats">
            <button type="button" className="ql-header" value="2"></button>
            <button type="button" className="ql-header" value="3">H3</button>
        </span>
        <span className="ql-formats">
            <button className="ql-link" />
        </span>
        <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <select className="ql-color">
        <option value="red" />
        <option value="green" />
        <option value="blue" />
        <option value="orange" />
        <option value="violet" />
        <option value="#d0d1d2" />
      </select>
      </span>
    </div>
  );

  export default EditorToolbar;