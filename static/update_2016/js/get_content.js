var xjy_ajax_get = function (a) {        //ajax获取数据
        var b = $.ajax({
            url: a,
            type: 'GET',
            contentType: 'application/json',
            dataType: 'json',                   //返回json类型的数据
            processData: !1,
            async: false,
            error: function(XMLHttpRequest1, textStatus, errorThrown) {
                alert("网络错误\n" + textStatus + ' ' + errorThrown);
                console.log(XMLHttpRequest1, textStatus, errorThrown);
                console.trace();
            }
        });
    return b;
};
var xjy_ajax_get_html = function (a) {        //ajax获取数据
        var b = $.ajax({
            url: a,
            type: 'GET',
            contentType: 'application/json',
            processData: !1,
            async: false,
            error: function(XMLHttpRequest1, textStatus, errorThrown) {
                alert("网络错误\n" + textStatus + ' ' + errorThrown);
                console.log(XMLHttpRequest1, textStatus, errorThrown);
                console.trace();
            },
            success: function () {
                $('#loading-layer').hide();
            }
        });
    return b;
};
var xjy_ajax_put = function (a, b) {        //ajax 插入数据
    var c = $.ajax({
        url: a,
        type: 'PUT',
        contentType: 'application/json',
        dataType: 'json',
        data: b,
        processData: !1,
        async: !1
    });
    return c;
};

var gen_discover_acts = function (limit, lastid, link) {                   
    var b = link + '?actid=' + lastid + '&limit=' + limit;
    var c = xjy_ajax_get(b);     
    return c.responseJSON;											
};
var gen_discover_acts_kind = function (limit, lastid, kind, link) {                   
    var b = link + '?actid=' + lastid + '&limit=' + limit + '&kind=' + kind; 
    var c = xjy_ajax_get(b);                                         	
    return c.responseJSON;
};
var gen_discover_acts_rank = function (limit, lastid, rankType, link) {                   
    var b = link + '?actid=' + lastid + '&limit=' + limit + '&order=' + rankType; 
    var c = xjy_ajax_get(b);                                            
    return c.responseJSON;
};
var gen_discover_acts_rank_kind = function (limit, lastid, rankType, kind, link) {                  
    var b = link + '?actid=' + lastid + '&limit=' + limit + '&order=' + rankType + '&kind=' + kind; 
    var c = xjy_ajax_get(b);                                            
    return c.responseJSON;
};
var gen_search_acts = function (limit, lastid, keyword, link) {                   
    var b = link + '?keyword=' + keyword + '&actid=' + lastid + '&limit=' + limit; 
    var c = xjy_ajax_get(b);
    return c.responseJSON;
};
var get_current_act = function (curid) {
    var b = '../../../foo/api/v1/activityinfo/getphoneactinfo/?actid=' + curid;
    var c = xjy_ajax_get(b);
    return c.responseJSON;
};
var get_beside_act = function (curid, side) {
    var b = '../../../foo/api/v1/activityinfo/getnextphoneactid/?actid=' + curid + '&next=' + side;
    var c = xjy_ajax_get(b);
    return c.responseJSON
};
var toggle_act_like = function (i, j) {
    var a = '../../../foo/api/v1/activityinfo/phone' + ((j==0)?'addgood/':'cancelgood/');
    var b = JSON.stringify({
            actid: i
        });
    var c = xjy_ajax_put(a, b);
    return c.responseJSON && !c.responseJSON.error
};
var get_qntoken = function() {
    var b = '../../../foo/api/v1/activityinfo/getqiniutoken/';
    var c = xjy_ajax_get(b);
    return c.responseJSON
};
