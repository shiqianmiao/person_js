<div class="city_inner">
    <div class="shortcut">
    <% if (obj.nearCity.length > 0) { %>
        <dl class="dl1 clearfix">
            <dt>周边城市：</dt>
            <dd>
            <% obj.nearCity.forEach(function (city) { %><a href="<%= city.uri %>" ><%= city.name %></a><% }); %>
           </dd>
        </dl>
    <% } %>
    <% if (obj.hotCity.length > 0) { %>
        <dl class="clearfix">
            <dt>热门城市：</dt>
            <dd>
            <a href="<%if (obj.country){%><%= obj.country%><% }else {%> http://www.273.cn <%}%>">全国</a>
            <% obj.hotCity.forEach(function (city) { %><a href="<%= city.uri %>" ><%= city.name %></a><% }); %>
            </dd>
        </dl>
    <% } %>
    </div>
    <div class="title" id="hover_title"><a href="http://www.273.cn/city.html" target="_blank" class="all" id="change7">查看所有城市&gt;&gt;</a><em>省份首字母：</em><a href="#" class="letter current" id="change1">ABCF</a><a href="#" class="letter" id="change2">G</a><a href="#" class="letter" id="change3">H</a><a href="#" class="letter" id="change4">JLN</a><a href="#" class="letter" id="change5">QS</a><a href="#" class="letter" id="change6">TXYZ</a></div>
    <% var group = [ ['a','b','c','f'],
                     ['g'],
                     ['h'],
                     ['j','l','n'],
                     ['q','s'],
                     ['t','x','y','z']
       ];
       if (!obj.provinces) {
           return;
       }
       for (var i=0; i<group.length; ++i) {%>
          <div class="city" id="city<%= i+1 %>" <%if(i==0){%>style="display: block;"<%}else{%>style="display:none;"<%}%>>
         <%for (var j=0; j<group[i].length; ++j) {
               var provinceGroup = obj.provinces[group[i][j]];
               if(!provinceGroup){
                   continue;
               }
               for (var pkey in provinceGroup){
                   var province = provinceGroup[pkey];
                   if (!province.domain) {
                       continue;
                   }%>
                   <dl class="clearfix">
                   <dt><em><%= group[i][j].toUpperCase() %></em><a href="<%= province.uri %>"><%= province.name %></a></dt>
                   <dd>
                 <%var citysInProvince = obj.citys[province.domain];
                   if(!citysInProvince){
                       continue;
                   }
                   for (var ckey in citysInProvince) {var city = citysInProvince[ckey];if (!city.name||!city.uri) {continue;}%><a href="<%= city.uri %>" <% if(city.chain==1){%>class="hot"<%}%>><%= city.name %></a><%}%>
                   </dd>
                   </dl>
              <%}
          }%>
        </div> 
    <% } %>
</div>