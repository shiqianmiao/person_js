<div class="pop_route" id="js_map">
    <div class="pop_box_content clearfix">
        <div class="pic lazy_load" id="bdMap"></div>
        <div class="font">
                <div class="add">
                   <h5><a href="<%= data.shop_url %>" target="_blank"><%= data.shop_name %></a></h5>
                   <p>
                       <label>地址：</label><%= data.address %><br />
                       <label>电话：</label>
                        <% if (data.ext_phone) { %>
                           <strong>400-6030-273</strong> 转 <strong><%= data.ext_phone %></strong>
                        <% } else { %>
                           <strong>400-6030-273</strong>
                        <% } %>
                   </p>
                </div>
                <div class="find">
                    <h6><a href="javascript:;" class="current" type="gj" data-eqselog="/car@etype=click@kclx=gj">查询公交路线</a><a href="javascript:;" type="jc" data-eqselog="/car@etype=click@kclx=jc">查询驾车路线</a></h6>
                    <div class="enter">
                        <div class="input_box"><label>起点</label><input id="qidian" name="start_name" type="text" /></div>
                        <div class="input_box"><label>终点</label><input id="zhongdian" disabled="disabled" type="text" value="<%= data.address %>" disabled="disabled" /></div>
                    </div>
                    <div class="btn"><button id="map_search" data-eqselog="/car@etype=click@kclx=cxjc">查找路线</button><span id="mst_result" style="color: red"></span></div>
                    <input type="hidden" id="search_type" name="search_type" value="gj" />
                    <input type="hidden" name="dept_id" value="<%= data.shop_id %>" />
                    <input type="hidden" name="start_point" value="" />
                </div>
        </div>
    </div>
    <p id="ms_result"></p>
</div>