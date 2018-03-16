import './css/index.css'
import './css/less/black.less'
import './css/sass/test.scss'
import weiwei from './js/weiwei.js'

let s = "<h1>Hello World</h1>"
document.write(s);

weiwei();

$('#title').html('Hello jquery');

var json =require('../config.json');
document.getElementById("json").innerHTML= json.name;