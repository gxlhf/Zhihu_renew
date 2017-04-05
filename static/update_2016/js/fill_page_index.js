var getIndexListLink = 'get_content_new.php';//获取内容列表的链接
var getDetailLink = 'get_detail_new.php';//获取活动详情的链接
var getSearchLink = 'get_search_result.php';//获取搜索结果的链接
var likeToggleLink = 'like_action.php';//用户进行收藏操作时调用的链接

var loadTime = 0;
var pageIndex = 0;
var lastActID = '';
var eachtimeLimit = 10;
var theresnomore = false;
var kind = '';

var searchFlag = false;
var keyword = '';

var rankFlag = false;
var rankType = 0;	

function stopPropagation(e) { //阻止冒泡
    e = e || window.event;
    if(e.stopPropagation) { //W3C阻止冒泡方法
        e.stopPropagation();
    } else {
        e.cancelBubble = true; //IE阻止冒泡方法
    }
}


function gen_actItem(act) { //产生活动的对象
	var newItem;
	var likeImg = 'unlike';
	if(act.isLike)
		likeImg = 'like';
	if(searchFlag){
		act.title = act.title.replace(new RegExp(keyword, "g"), "<em>" + keyword + "</em>");
	}
	if(act.isTop){
		act.title += "<span>推荐</span>";
	}
	if(act.address == '' && act.date_begin != '')
	{
		newItem = $(
		'<div actid="' + act.id + '" class="act-item">'
			+ '<div class="left-side">'
				+ '<h2>' + act.title + '</h2>'
				+ '<p><img src="img/time.png">' + act.date_begin + '</p>'
			+ '</div>'
			+ '<div class="right-side">'
			+ ' <p><img src="img/' + act.typetag + '.png">' + act.typetag + '</p>'
			+ ' <p><img class="btn-list-like" src="img/' + likeImg + '.png"><span class="list-likecount">' + act.like + '</span></p>'
			+ '</div>'
		+ '</div>');
	}
	else if(act.date_begin == '' && act.address != '')
	{
		newItem = $(
		'<div actid="' + act.id + '" class="act-item">'
			+ '<div class="left-side">'
				+ '<h2>' + act.title + '</h2>'
				+ '<p><img src="img/locate.png">' + act.address + '</p>'
			+ '</div>'
			+ '<div class="right-side">'
			+ ' <p><img src="img/' + act.typetag + '.png">' + act.typetag + '</p>'
			+ ' <p><img class="btn-list-like" src="img/' + likeImg + '.png"><span class="list-likecount">' + act.like + '</span></p>'
			+ '</div>'
		+ '</div>');
	}
	else if(act.date_begin == '' && act.address == '')
	{
		newItem = $(
		'<div actid="' + act.id + '" class="act-item">'
			+ '<div class="left-side">'
				+ '<h2>' + act.title + '</h2>'
			+ '</div>'
			+ '<div class="right-side">'
			+ ' <p><img src="img/' + act.typetag + '.png">' + act.typetag + '</p>'
			+ ' <p><img class="btn-list-like" src="img/' + likeImg + '.png"><span class="list-likecount">' + act.like + '</span></p>'
			+ '</div>'
		+ '</div>');
	}
	else
	{
		newItem = $(
		'<div actid="' + act.id + '" class="act-item">'
			+ '<div class="left-side">'
				+ '<h2>' + act.title + '</h2>'
				+ '<p><img src="img/locate.png">' + act.address + '</p>'
				+ '<p><img src="img/time.png">' + act.date_begin + '</p>'
			+ '</div>'
			+ '<div class="right-side">'
			+ ' <p><img src="img/' + act.typetag + '.png">' + act.typetag + '</p>'
			+ ' <p><img class="btn-list-like" src="img/' + likeImg + '.png"><span class="list-likecount">' + act.like + '</span></p>'
			+ '</div>'
		+ '</div>');
	}
	return newItem;
}

//获取并弹出详情
function getDetail(id) {  
	
	$('#loading-layer').show();
	var respHtml = xjy_ajax_get_html(getDetailLink + '?id=' + id).responseText;
	if(respHtml != '')
	{
		$('#detail').html(respHtml);
		//$('#loading-layer').hide();
	}
	else
	{
		alert('获取活动详情失败');
		$('#loading-layer').hide();
		return;
	}
	
	$('#detail').show();
	$('#detail-lower').css('height', ($('#detail').height() - 35) + 'px');
	$('#under-layer').show();
	// $('body').css('overflow','hidden');
	lockList();
	if(location.href.search("#detail-actid") == -1){
		location.hash = "detail-actid=" + id;
		document.title = "知湖 - " + $("#detail-title > h4").text();
	}

	//点击关闭按钮
	$('#detail-close').click(function () {
		// $('body').css('overflow','scroll');
		unlockList();
		$('#detail').hide();
		$('#under-layer').hide();
        location.hash = '0'; 
		document.title = "知湖";
	});

	//收藏操作
	$('#btn-like').click(function (a) {

		var result = xjy_ajax_get_html(likeToggleLink + '?id=' + $('#detail-title').attr('detail-actid'));
		
		if(result.responseText == '1')
		{
			if ($(this).attr('src') == 'img/like.png')
			{
				$(this).attr('src', 'img/unlike.png');
				$('#detail-likecount').text($('#detail-likecount').text() - 1);
			}
			else
			{
				$(this).attr('src', 'img/like.png');
				$('#detail-likecount').text($('#detail-likecount').text() - 0 + 1);
			}
			$('[actid = "' + $('#detail-title').attr('detail-actid') + '"]').find('.list-likecount').text($('#detail-likecount').text());
		}
		else if(result.responseText == '404')
		{
			window.location.href = 'out_of_wx.html';
		}
		else
		{
			if ($(this).attr('src') == 'img/like.png')
			{
				alert('取消收藏失败');
			}
			else
			{
				alert('收藏失败');
			}
		}
	});

	//滚动到一定位置修改作者位置内容
	var titleHeight = $('#detail-title > h4').height();
	var titleElem = $('#detail-title > h4');
	var title = titleElem.text();
	var authorElem = $('#detail-header > h3 > nobr');
	var author = authorElem.text();
	$("#detail-lower").scroll(function (e) {
		stopPropagation(e);
		if($(this).scrollTop() > titleHeight - 10)
		{
			authorElem.text(title);
		}
		else
		{
			authorElem.text(author);
		}
	});

}

function addActs(newActs) { //在页面中添加html内容
	if(newActs != null)
	{
		lastActID = newActs[newActs.length - 1].id;
		for (var i = 0; i < newActs.length; i++) 
		{
			var thisElem = gen_actItem(newActs[i]);
			thisElem.click(function (e) {
				getDetail($(e.currentTarget).attr('actid'));
			});
			thisElem.bind("touchstart", function () {
				$(this).css('background','#f5f5f5');
			});
			thisElem.bind("touchmove", function () {
				$(this).css('background','white');
			});
			thisElem.bind("touchend", function () {
				$(this).css('background','white');
			});

			//列表页点击红心收藏
			thisElem.find('.btn-list-like').click(function (e) {  
				stopPropagation(e);

				var result = xjy_ajax_get_html(likeToggleLink + '?id=' + $(this).parents('.act-item').attr('actid'));
				
				if(result.responseText == '1')
				{
					if ($(this).attr('src') == 'img/like.png')
					{
						$(this).attr('src', 'img/unlike.png');
						$(this).next().text($(this).next().text() - 1);
					}
					else
					{
						$(this).attr('src', 'img/like.png');
						$(this).next().text($(this).next().text() - 0 + 1);
					}
				}
				else if(result.responseText == '404')
				{
					window.location.href = 'out_of_wx.html';
				}
				else
				{
					if ($(this).attr('src') == 'img/like.png')
					{
						alert('取消收藏失败');
					}
					else
					{
						alert('收藏失败');
					}
				}			
			});
			thisElem.insertBefore("#loadmore");
		}
	}
	else
	{
		$("#loadmore")[0].innerHTML = "暂时没有更多活动了 ^_^";
	}

	if (newActs.length < eachtimeLimit) 
	{
		$("#loadmore")[0].innerHTML = "暂时没有更多活动了 ^_^";
	}
}

function ListLoadmore() {
	var totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());

	if ($(document).height() <= totalheight) {  //触发 加载新条目

		if(kind == "" && !searchFlag && !rankFlag){
			var resp = gen_discover_acts(eachtimeLimit, lastActID, getIndexListLink);
		}else if(searchFlag){
			var resp = gen_search_acts(eachtimeLimit, lastActID, keyword, getSearchLink);
		}else if(rankFlag && kind != ""){
			var resp = gen_discover_acts_rank_kind(eachtimeLimit, lastActID, rankType, kind, getIndexListLink);
		}else if(rankFlag){
			var resp = gen_discover_acts_rank(eachtimeLimit, lastActID, rankType, getIndexListLink);
		}else{
			var resp = gen_discover_acts_kind(eachtimeLimit, lastActID, kind, getIndexListLink);
		}
		var newActsCount = resp.meta.count;
		var newActs = resp.obj;
		if(newActsCount){
			addActs(newActs);
		}else{
			$("#loadmore")[0].innerHTML = "暂时没有更多活动了 ^_^";
		}
	}
}

$(function () {

	//滚动到页面底部时加载新内容
	$(window).scroll(function () {
		ListLoadmore();
	});

	//改变地址栏
	if(location.href.search("#") == -1){
		// location.href += "#";
	}else{
		if(location.href.search("#detail-actid") != -1){
			getDetail(location.href.split("#detail-actid=")[1]);
		}
	}

    // $(window).on("popstate",function(e){
    //     console.log(e);
    // });

    window.onhashchange = function(e) {
        console.log(location.hash);
    };

});
