/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.967196819085487, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get User By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Post"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quote By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Login (alias: /user/login)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Users"], "isController": false}, {"data": [1.0, 500, 1500, "Delete User"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Quote"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Generate 2FA TOTP Code"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Categories"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Quotes"], "isController": false}, {"data": [1.0, 500, 1500, "Update Product (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todo By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Caller IP Address"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Meal Type"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products By Category"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New User"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PUT"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Filter Users"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Carts"], "isController": false}, {"data": [0.0, 500, 1500, "Get Posts - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe By Id"], "isController": false}, {"data": [0.0, 500, 1500, "Get Products - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (alias: /user/me)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Square Image"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (me)"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Background Color"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Search Products"], "isController": false}, {"data": [0.8, 500, 1500, "Create Custom Mock Response"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quotes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Search Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments For Post"], "isController": false}, {"data": [1.0, 500, 1500, "Search Users"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Cart By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comment By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tag List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts By User Id"], "isController": false}, {"data": [0.9, 500, 1500, "Login (get access + refresh token)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Text + Colors"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Refresh Token"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments By Post Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Category List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Products"], "isController": false}, {"data": [1.0, 500, 1500, "Update Product (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments - Paginated"], "isController": false}, {"data": [0.0, 500, 1500, "Get Products - Simulate Delay (perf testing)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Sized Image"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Search Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos - Paginated"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 503, 0, 0.0, 185.8906560636182, 7, 2428, 113.0, 139.60000000000002, 378.39999999999213, 2368.3199999999993, 4.231086287242812, 28.643473018413214, 2.3912810470676806], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get User By Id", 5, 0, 0.0, 113.6, 111, 120, 112.0, 120.0, 120.0, 120.0, 22.321428571428573, 54.26025390625, 11.749267578125], "isController": false}, {"data": ["Add New Post", 5, 0, 0.0, 114.4, 111, 118, 114.0, 118.0, 118.0, 118.0, 39.37007874015748, 44.72194881889764, 27.105376476377952], "isController": false}, {"data": ["Delete Recipe", 5, 0, 0.0, 112.6, 112, 113, 113.0, 113.0, 113.0, 113.0, 22.42152466367713, 41.300273262331835, 12.327459360986547], "isController": false}, {"data": ["Get Quote By Id", 5, 0, 0.0, 110.0, 107, 116, 109.0, 116.0, 116.0, 116.0, 25.12562814070352, 28.31540515075377, 13.24984296482412], "isController": false}, {"data": ["Add New Product", 5, 0, 0.0, 114.4, 111, 119, 114.0, 119.0, 119.0, 119.0, 22.93577981651376, 27.26311639908257, 26.049132740825687], "isController": false}, {"data": ["Get Recipes - Paginated", 5, 0, 0.0, 119.6, 114, 131, 118.0, 131.0, 131.0, 131.0, 21.008403361344538, 198.66892069327733, 11.38639049369748], "isController": false}, {"data": ["Update User (PUT)", 5, 0, 0.0, 110.0, 109, 112, 110.0, 112.0, 112.0, 112.0, 10.0, 24.27734375, 5.72265625], "isController": false}, {"data": ["Update User (PATCH)", 5, 0, 0.0, 113.2, 111, 118, 112.0, 118.0, 118.0, 118.0, 9.920634920634921, 24.028475322420636, 5.871000744047619], "isController": false}, {"data": ["Login (alias: /user/login)", 5, 0, 0.0, 116.6, 114, 121, 116.0, 121.0, 121.0, 121.0, 9.784735812133071, 27.754632460861057, 6.19190313111546], "isController": false}, {"data": ["Get All Posts", 5, 0, 0.0, 8.2, 7, 10, 8.0, 10.0, 10.0, 10.0, 12.468827930174564, 191.3283198254364, 6.5388287094763085], "isController": false}, {"data": ["Get Recipes - Sorted", 5, 0, 0.0, 116.2, 113, 124, 114.0, 124.0, 124.0, 124.0, 21.008403361344538, 590.2212447478992, 11.509486607142858], "isController": false}, {"data": ["Update Todo (PUT)", 5, 0, 0.0, 110.6, 110, 112, 110.0, 112.0, 112.0, 112.0, 27.932960893854748, 31.053596368715084, 15.985073324022347], "isController": false}, {"data": ["Update Recipe (PUT)", 5, 0, 0.0, 111.6, 111, 113, 111.0, 113.0, 113.0, 113.0, 22.727272727272727, 40.49183238636363, 14.626242897727273], "isController": false}, {"data": ["Get All Users", 5, 0, 0.0, 10.4, 9, 11, 11.0, 11.0, 11.0, 11.0, 42.3728813559322, 1779.1396318855934, 22.220934851694917], "isController": false}, {"data": ["Delete User", 5, 0, 0.0, 111.2, 109, 113, 112.0, 113.0, 113.0, 113.0, 9.940357852882704, 24.66839587475149, 5.445840581510934], "isController": false}, {"data": ["Get Random Quote", 5, 0, 0.0, 109.8, 108, 112, 110.0, 112.0, 112.0, 112.0, 24.752475247524753, 28.716738861386137, 13.173924814356434], "isController": false}, {"data": ["Update Comment (PUT)", 5, 0, 0.0, 112.0, 110, 119, 110.0, 119.0, 119.0, 119.0, 35.97122302158273, 41.577675359712224, 21.70919514388489], "isController": false}, {"data": ["Generate 2FA TOTP Code", 5, 0, 0.0, 121.2, 115, 133, 116.0, 133.0, 133.0, 133.0, 23.809523809523807, 25.33482142857143, 12.927827380952381], "isController": false}, {"data": ["Get Product Categories", 5, 0, 0.0, 115.0, 110, 118, 117.0, 118.0, 118.0, 118.0, 22.831050228310502, 79.77044092465754, 12.285067066210045], "isController": false}, {"data": ["Get All Todos", 5, 0, 0.0, 110.0, 108, 115, 109.0, 115.0, 115.0, 115.0, 32.05128205128205, 110.5205829326923, 16.808143028846153], "isController": false}, {"data": ["Get All Quotes", 5, 0, 0.0, 112.0, 109, 117, 111.0, 117.0, 117.0, 117.0, 26.041666666666668, 125.75276692708333, 13.682047526041666], "isController": false}, {"data": ["Update Product (PUT)", 5, 0, 0.0, 439.4, 420, 457, 446.0, 457.0, 457.0, 457.0, 9.09090909090909, 14.030539772727272, 5.291193181818182], "isController": false}, {"data": ["Get Todo By Id", 5, 0, 0.0, 112.6, 107, 119, 110.0, 119.0, 119.0, 119.0, 28.089887640449437, 31.15673279494382, 14.785595154494382], "isController": false}, {"data": ["Get Caller IP Address", 5, 0, 0.0, 118.0, 111, 125, 118.0, 125.0, 125.0, 125.0, 10.080645161290322, 11.017830141129032, 5.256898941532258], "isController": false}, {"data": ["Get Products - Field Selection", 5, 0, 0.0, 116.4, 114, 124, 115.0, 124.0, 124.0, 124.0, 23.148148148148145, 74.48097511574075, 12.839988425925926], "isController": false}, {"data": ["Get Recipes By Meal Type", 5, 0, 0.0, 118.8, 114, 130, 115.0, 130.0, 130.0, 130.0, 22.123893805309734, 541.905766039823, 12.01258296460177], "isController": false}, {"data": ["Get All Recipes", 5, 0, 0.0, 116.0, 114, 118, 116.0, 118.0, 118.0, 118.0, 21.645021645021643, 601.6301406926407, 11.393229166666666], "isController": false}, {"data": ["Get Products By Category", 5, 0, 0.0, 114.8, 113, 118, 114.0, 118.0, 118.0, 118.0, 22.62443438914027, 187.30999010180994, 12.284360859728507], "isController": false}, {"data": ["Get Posts - Sorted", 5, 0, 0.0, 114.4, 111, 122, 113.0, 122.0, 122.0, 122.0, 9.9601593625498, 132.3261640936255, 5.446962151394422], "isController": false}, {"data": ["Get Product By Id", 5, 0, 0.0, 10.2, 8, 14, 9.0, 14.0, 14.0, 14.0, 45.45454545454545, 115.47407670454545, 24.058948863636363], "isController": false}, {"data": ["Add New User", 5, 0, 0.0, 112.4, 109, 117, 111.0, 117.0, 117.0, 117.0, 10.040160642570282, 17.85069967369478, 6.206466490963855], "isController": false}, {"data": ["Test Route - PUT", 5, 0, 0.0, 112.8, 111, 118, 112.0, 118.0, 118.0, 118.0, 10.080645161290322, 10.584677419354838, 5.808184223790323], "isController": false}, {"data": ["Get User's Todos", 5, 0, 0.0, 110.4, 109, 111, 111.0, 111.0, 111.0, 111.0, 10.040160642570282, 12.014856300200803, 5.343640185742972], "isController": false}, {"data": ["Get User's Posts", 5, 0, 0.0, 129.0, 109, 156, 122.0, 156.0, 156.0, 156.0, 9.487666034155597, 15.254388045540797, 5.049587879506642], "isController": false}, {"data": ["Filter Users", 5, 0, 0.0, 120.0, 115, 132, 118.0, 132.0, 132.0, 132.0, 9.398496240601503, 302.67012746710526, 5.240763040413533], "isController": false}, {"data": ["Get All Carts", 5, 0, 0.0, 131.0, 114, 154, 134.0, 154.0, 154.0, 154.0, 22.831050228310502, 694.0505493721461, 11.972923801369863], "isController": false}, {"data": ["Get Posts - Field Selection", 5, 0, 0.0, 2287.2, 2031, 2380, 2328.0, 2380.0, 2380.0, 2380.0, 2.0644095788604457, 8.9499412933526, 1.1430861632947975], "isController": false}, {"data": ["Update Post (PUT)", 5, 0, 0.0, 110.6, 110, 111, 111.0, 111.0, 111.0, 111.0, 40.983606557377044, 59.70639088114754, 24.65420081967213], "isController": false}, {"data": ["Get Posts - Paginated", 5, 0, 0.0, 111.2, 109, 113, 112.0, 113.0, 113.0, 113.0, 9.940357852882704, 59.41887736083499, 5.368181535785288], "isController": false}, {"data": ["Get Recipe By Id", 5, 0, 0.0, 113.2, 111, 120, 111.0, 120.0, 120.0, 120.0, 21.1864406779661, 37.89145259533898, 11.193226959745763], "isController": false}, {"data": ["Get Products - Paginated", 5, 0, 0.0, 2320.0, 2098, 2428, 2386.0, 2428.0, 2428.0, 2428.0, 1.9786307874950535, 32.02251620003957, 1.0743346853977047], "isController": false}, {"data": ["Get Posts By User Id", 5, 0, 0.0, 124.6, 119, 132, 122.0, 132.0, 132.0, 132.0, 36.76470588235294, 59.20410156249999, 19.53125], "isController": false}, {"data": ["Get Carts - Paginated", 5, 0, 0.0, 112.2, 111, 113, 112.0, 113.0, 113.0, 113.0, 23.041474654377883, 255.98538306451613, 12.443296370967742], "isController": false}, {"data": ["Get Recipe Tags", 5, 0, 0.0, 117.8, 110, 124, 118.0, 124.0, 124.0, 124.0, 21.09704641350211, 41.38235100210971, 11.207805907172997], "isController": false}, {"data": ["Get Authenticated User (alias: /user/me)", 5, 0, 0.0, 118.4, 112, 128, 113.0, 128.0, 128.0, 128.0, 9.861932938856016, 23.97682445759369, 5.19099790433925], "isController": false}, {"data": ["Get Products - Sorted", 5, 0, 0.0, 144.6, 122, 228, 124.0, 228.0, 228.0, 228.0, 21.929824561403507, 913.0302563048245, 12.05712033991228], "isController": false}, {"data": ["Generate Square Image", 5, 0, 0.0, 175.4, 137, 203, 197.0, 203.0, 203.0, 203.0, 5.279831045406547, 16.559282602956706, 2.7894419878563887], "isController": false}, {"data": ["Get Authenticated User (me)", 5, 0, 0.0, 115.0, 112, 119, 115.0, 119.0, 119.0, 119.0, 9.523809523809526, 23.113839285714285, 5.013020833333333], "isController": false}, {"data": ["Delete Product", 5, 0, 0.0, 112.2, 110, 114, 113.0, 114.0, 114.0, 114.0, 25.510204081632654, 65.52435427295919, 14.050542091836734], "isController": false}, {"data": ["Get Random Todo", 5, 0, 0.0, 114.0, 109, 125, 111.0, 125.0, 125.0, 125.0, 27.624309392265193, 30.251856008287294, 14.675414364640885], "isController": false}, {"data": ["Delete Cart", 5, 0, 0.0, 113.2, 111, 115, 113.0, 115.0, 115.0, 115.0, 21.73913043478261, 45.20210597826087, 11.909816576086955], "isController": false}, {"data": ["Test Route - PATCH", 5, 0, 0.0, 112.8, 112, 116, 112.0, 116.0, 116.0, 116.0, 10.080645161290322, 10.600428427419354, 5.827872983870968], "isController": false}, {"data": ["Get All Comments", 5, 0, 0.0, 113.2, 111, 120, 112.0, 120.0, 120.0, 120.0, 34.96503496503497, 175.79490821678323, 18.43859265734266], "isController": false}, {"data": ["Add New Cart", 5, 0, 0.0, 116.2, 111, 132, 113.0, 132.0, 132.0, 132.0, 21.459227467811157, 34.2425563304721, 15.193300697424892], "isController": false}, {"data": ["Generate Image With Background Color", 5, 0, 0.0, 149.0, 134, 158, 152.0, 158.0, 158.0, 158.0, 5.701254275940707, 40.63479903078677, 3.073332383124287], "isController": false}, {"data": ["Get User's Carts", 5, 0, 0.0, 113.6, 110, 120, 113.0, 120.0, 120.0, 120.0, 9.46969696969697, 19.533099550189394, 5.040024266098484], "isController": false}, {"data": ["Test Route - POST", 5, 0, 0.0, 114.2, 110, 121, 111.0, 121.0, 121.0, 121.0, 10.080645161290322, 10.590584047379032, 5.739273563508065], "isController": false}, {"data": ["Test Route - DELETE", 5, 0, 0.0, 110.4, 109, 111, 111.0, 111.0, 111.0, 111.0, 10.224948875255624, 10.750175741308794, 5.571798312883436], "isController": false}, {"data": ["Get Post By Id", 5, 0, 0.0, 112.2, 109, 117, 112.0, 117.0, 117.0, 117.0, 33.333333333333336, 48.782552083333336, 17.545572916666668], "isController": false}, {"data": ["Test Route - GET", 5, 0, 0.0, 112.2, 110, 118, 111.0, 118.0, 118.0, 118.0, 10.080645161290322, 10.584677419354838, 5.276587701612903], "isController": false}, {"data": ["Search Products", 5, 0, 0.0, 115.0, 113, 116, 115.0, 116.0, 116.0, 116.0, 23.148148148148145, 866.8755425347223, 12.54611545138889], "isController": false}, {"data": ["Create Custom Mock Response", 5, 0, 0.0, 544.2, 238, 1042, 240.0, 1042.0, 1042.0, 1042.0, 4.7664442326024785, 5.10158484270734, 3.0395391444232605], "isController": false}, {"data": ["Delete Todo", 5, 0, 0.0, 109.6, 108, 111, 110.0, 111.0, 111.0, 111.0, 27.027027027027028, 31.619510135135137, 14.806798986486486], "isController": false}, {"data": ["Get Quotes - Paginated", 5, 0, 0.0, 111.6, 111, 112, 112.0, 112.0, 112.0, 112.0, 25.773195876288657, 60.02335695876288, 13.943701675257731], "isController": false}, {"data": ["Get Post Tags", 5, 0, 0.0, 116.0, 114, 120, 115.0, 120.0, 120.0, 120.0, 40.983606557377044, 608.1663037909836, 21.69249487704918], "isController": false}, {"data": ["Search Posts", 5, 0, 0.0, 123.8, 114, 136, 119.0, 136.0, 136.0, 136.0, 33.11258278145696, 50.34794081125828, 17.849751655629138], "isController": false}, {"data": ["Get Comments For Post", 5, 0, 0.0, 111.6, 109, 113, 112.0, 113.0, 113.0, 113.0, 42.73504273504273, 62.31637286324786, 22.869925213675213], "isController": false}, {"data": ["Search Users", 5, 0, 0.0, 197.6, 121, 448, 140.0, 448.0, 448.0, 448.0, 8.928571428571429, 9.453473772321427, 4.813058035714286], "isController": false}, {"data": ["Update Comment (PATCH)", 5, 0, 0.0, 109.6, 109, 111, 109.0, 111.0, 111.0, 111.0, 35.97122302158273, 41.29665017985611, 20.549966276978417], "isController": false}, {"data": ["Get Cart By Id", 5, 0, 0.0, 111.0, 110, 112, 111.0, 112.0, 112.0, 112.0, 23.25581395348837, 46.602470930232556, 12.24109738372093], "isController": false}, {"data": ["Get Comment By Id", 5, 0, 0.0, 112.2, 109, 118, 111.0, 118.0, 118.0, 118.0, 31.446540880503143, 36.27407625786164, 16.644555817610062], "isController": false}, {"data": ["Add New Recipe", 5, 0, 0.0, 112.8, 110, 117, 113.0, 117.0, 117.0, 117.0, 22.42152466367713, 29.980030829596412, 22.53100476457399], "isController": false}, {"data": ["Add New Comment", 5, 0, 0.0, 136.0, 119, 144, 139.0, 144.0, 144.0, 144.0, 31.25, 35.906982421875, 19.83642578125], "isController": false}, {"data": ["Get Post Tag List", 5, 0, 0.0, 111.6, 111, 112, 112.0, 112.0, 112.0, 112.0, 42.73504273504273, 113.28959668803418, 22.786458333333332], "isController": false}, {"data": ["Get Carts By User Id", 5, 0, 0.0, 116.2, 114, 119, 117.0, 119.0, 119.0, 119.0, 22.93577981651376, 47.30952551605505, 12.184633027522937], "isController": false}, {"data": ["Login (get access + refresh token)", 5, 0, 0.0, 286.2, 138, 593, 146.0, 593.0, 593.0, 593.0, 5.89622641509434, 16.74205852004717, 1.5201208726415094], "isController": false}, {"data": ["Update Cart", 5, 0, 0.0, 113.8, 112, 119, 113.0, 119.0, 119.0, 119.0, 21.645021645021643, 48.79007711038961, 14.014306006493506], "isController": false}, {"data": ["Generate Image With Text + Colors", 3, 0, 0.0, 152.66666666666666, 147, 156, 155.0, 156.0, 156.0, 156.0, 18.51851851851852, 115.51167052469135, 10.416666666666666], "isController": false}, {"data": ["Update Todo (PATCH)", 5, 0, 0.0, 111.4, 109, 117, 110.0, 117.0, 117.0, 117.0, 27.17391304347826, 30.17259680706522, 15.630307404891305], "isController": false}, {"data": ["Refresh Token", 5, 0, 0.0, 121.0, 112, 132, 120.0, 132.0, 132.0, 132.0, 9.505703422053232, 25.344210432509506, 9.087972314638783], "isController": false}, {"data": ["Get Posts By Tag", 5, 0, 0.0, 128.2, 121, 132, 129.0, 132.0, 132.0, 132.0, 37.31343283582089, 534.6461054104477, 20.004955690298505], "isController": false}, {"data": ["Get Recipes By Tag", 5, 0, 0.0, 112.6, 110, 114, 113.0, 114.0, 114.0, 114.0, 22.22222222222222, 40.546875, 11.9140625], "isController": false}, {"data": ["Update Recipe (PATCH)", 5, 0, 0.0, 113.0, 109, 120, 112.0, 120.0, 120.0, 120.0, 22.62443438914027, 40.39256928733032, 12.94718608597285], "isController": false}, {"data": ["Get Users - Sorted", 5, 0, 0.0, 120.8, 117, 130, 118.0, 130.0, 130.0, 130.0, 22.026431718061676, 921.7115225770925, 12.131745594713657], "isController": false}, {"data": ["Get Comments By Post Id", 5, 0, 0.0, 114.8, 111, 119, 116.0, 119.0, 119.0, 119.0, 31.446540880503143, 45.83087657232704, 16.798103380503143], "isController": false}, {"data": ["Add New Todo", 5, 0, 0.0, 109.0, 107, 110, 109.0, 110.0, 110.0, 110.0, 28.735632183908045, 31.77756824712644, 18.3245779454023], "isController": false}, {"data": ["Get Recipes - Field Selection", 5, 0, 0.0, 113.8, 111, 120, 112.0, 120.0, 120.0, 120.0, 21.008403361344538, 72.54464285714286, 11.694130777310924], "isController": false}, {"data": ["Get Product Category List", 5, 0, 0.0, 111.4, 109, 117, 110.0, 117.0, 117.0, 117.0, 23.041474654377883, 31.1959965437788, 12.465797811059907], "isController": false}, {"data": ["Get Todos By User Id", 5, 0, 0.0, 111.2, 109, 118, 110.0, 118.0, 118.0, 118.0, 28.735632183908045, 34.28632363505747, 15.26580459770115], "isController": false}, {"data": ["Get All Products", 5, 0, 0.0, 13.0, 11, 14, 14.0, 14.0, 14.0, 14.0, 13.089005235602095, 577.5651382526178, 6.902405104712042], "isController": false}, {"data": ["Update Product (PATCH)", 5, 0, 0.0, 114.6, 111, 119, 112.0, 119.0, 119.0, 119.0, 24.509803921568626, 38.29178155637255, 14.073988970588236], "isController": false}, {"data": ["Get Comments - Paginated", 5, 0, 0.0, 114.2, 111, 120, 113.0, 120.0, 120.0, 120.0, 33.11258278145696, 78.8816742549669, 17.979097682119207], "isController": false}, {"data": ["Get Products - Simulate Delay (perf testing)", 5, 0, 0.0, 2128.0, 2118, 2163, 2119.0, 2163.0, 2163.0, 2163.0, 2.2512381809995494, 99.27608622242232, 1.2113596071589374], "isController": false}, {"data": ["Get Users - Paginated", 5, 0, 0.0, 117.2, 115, 120, 117.0, 120.0, 120.0, 120.0, 22.026431718061676, 325.25554102422905, 11.895133535242291], "isController": false}, {"data": ["Generate Sized Image", 5, 0, 0.0, 141.6, 136, 151, 139.0, 151.0, 151.0, 151.0, 5.675368898978434, 40.32948176787741, 3.0205820800227015], "isController": false}, {"data": ["Delete Post", 5, 0, 0.0, 110.6, 109, 113, 110.0, 113.0, 113.0, 113.0, 37.59398496240601, 57.073836936090224, 20.59592340225564], "isController": false}, {"data": ["Get Users - Field Selection", 5, 0, 0.0, 118.6, 117, 121, 119.0, 121.0, 121.0, 121.0, 22.026431718061676, 62.38814702643172, 12.196276156387665], "isController": false}, {"data": ["Delete Comment", 5, 0, 0.0, 111.2, 107, 119, 109.0, 119.0, 119.0, 119.0, 33.557046979865774, 40.425755033557046, 18.482592281879196], "isController": false}, {"data": ["Search Recipes", 5, 0, 0.0, 110.4, 110, 111, 110.0, 111.0, 111.0, 111.0, 21.27659574468085, 22.58560505319149, 11.510970744680852], "isController": false}, {"data": ["Update Post (PATCH)", 5, 0, 0.0, 112.2, 109, 119, 111.0, 119.0, 119.0, 119.0, 38.16793893129771, 55.48515028625954, 21.73037929389313], "isController": false}, {"data": ["Get Todos - Paginated", 5, 0, 0.0, 119.2, 107, 130, 121.0, 130.0, 130.0, 130.0, 29.76190476190476, 55.832635788690474, 16.072591145833332], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 503, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
