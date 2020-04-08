// import { helloword } from "../helloword.js";
// import './index.less';
// import "./search.css";
// import  logo  from './images/1.jpg';
// document.write(helloword());
// var img = document.getElementById("imgs");
// img.setAttribute("src", logo);
// document.write("你好，这是search页面");
require('./search.css');
var html = `
    <div id="search">
        <h1>你好，这是search页面</h1>
        <p>欢迎!</p>
    </div>
`;
module.exports = {
    "search": html
}