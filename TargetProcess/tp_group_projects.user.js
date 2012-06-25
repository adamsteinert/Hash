// ==UserScript==
// @name       TP Time Sheet highlighter
// @namespace  http://adamsteinert.com
// @version    0.51
// @description  Groups tasks in the time sheet with common background colors.
// @copyright  2012+, Adam Steinert
// @match      http://*/Default/TimeSheet.aspx*
// @require	   http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// ==/UserScript==

var colors = ['#907D6D', '#7D2A2A', '#415757', '#9bcc9b', '#4e7373', '#0F0F0F'];
var projects = function() {};

function highlight()
{
    projects = function() {};
	var i = 0;
	$('.dataRow').each(function(index, ele) {
		var name = $('td:first-child', ele).text().trim();
		
		if(!projects[name])
		{
			projects[name] = colors[i];
			i++;
		}
		
		//alert($('td:first-child', ele).text());
		//$('td', ele).css('background', projects[name]);
        $('td:first-child', ele).css('background', projects[name]);
	});
}

function insertUi()
{
    $('<p class="tptshhighlight">Refresh highlights</p>').insertAfter('.settings');
    $('.tptshhighlight').css('cursor', 'pointer');
    $('.tptshhighlight').click(function () {
        highlight();
    });
}

function initialize()
{
    insertUi();
    highlight();
}

console.log('starting up...');
window.addEventListener("load", initialize, null);