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
var projects = new Array();
var projectTotals = new Array();

function highlight()
{
    projects = new Array();
    projectTotals = new Array();
	var i = 0;

    
	$('.dataRow').each(function(index, ele) {
		var name = $('td:first-child', ele).text().trim();
	
        var idRegexp = /\?[a-zA-Z]+ID=?(\d+)/g;
        var link = $('td:nth-child(3)', ele);
        var fst = $('a', link).first();
        var match = idRegexp.exec(fst.attr('href'));
        
		if(!projects[name])
		{
			projects[name] = colors[i];
			i++;
            
            //prep the totals object
            projectTotals[name] = 0;
		}
        
        var sum = getSumForProjectRow(ele);
        projectTotals[name] += sum;
		
        $('td:first-child', ele).css('background', projects[name]);
        $('td:first-child', ele).append('(' + match[1] + ')');
	});
}

function alertProjectTotals() {
    var message = "Project Totals:\r\n";   
    var total = getAllHours();
    
    for(var propt in projectTotals){
        var hrs = projectTotals[propt];
        var pct = (hrs / total) * 100;       
        message += propt + ": " + hrs + "     (" + pct.toFixed(2) + "%)\r\n";
    }
    
    alert(message);
}

function getAllHours() {
    var sum = 0;
    for(var propt in projectTotals){
        sum += projectTotals[propt];
    }
    return sum;
}

function getSumForProjectRow(ele) {
    var sum = 0;
    $('.timeButton', ele).each(function() {
        sum += Number($(this).val());
    });    

    return sum;
}


function insertUi()
{
    $('<p class="tptshhighlight">Refresh highlights</p>').insertAfter('.settings');
    $('.tptshhighlight').css('cursor', 'pointer');
    $('.tptshhighlight').click(function () {
        highlight();
    });
    
    
    $('<p class="tptshalert">Show Totals</p>').insertAfter('.settings');
    $('.tptshalert').css('cursor', 'pointer');
    $('.tptshalert').click(function () {
        alertProjectTotals();
    });
}



function initialize()
{
    insertUi();
    highlight();    
}

console.log('starting up...');
window.addEventListener("load", initialize, null);