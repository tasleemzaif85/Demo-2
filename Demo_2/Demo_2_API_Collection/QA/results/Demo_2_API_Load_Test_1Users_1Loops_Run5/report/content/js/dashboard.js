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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9722222222222222, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get User By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Post"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quote By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Login (alias: /user/login)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PUT)"], "isController": false}, {"data": [0.0, 500, 1500, "Update Recipe (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Users"], "isController": false}, {"data": [1.0, 500, 1500, "Delete User"], "isController": false}, {"data": [0.0, 500, 1500, "Get Random Quote"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Generate 2FA TOTP Code"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Categories"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Quotes"], "isController": false}, {"data": [1.0, 500, 1500, "Update Product (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todo By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Caller IP Address"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Meal Type"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products By Category"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New User"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PUT"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Filter Users"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (alias: /user/me)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Square Image"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (me)"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Background Color"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image - Custom Format"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Search Products"], "isController": false}, {"data": [1.0, 500, 1500, "Create Custom Mock Response"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quotes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Search Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments For Post"], "isController": false}, {"data": [1.0, 500, 1500, "Search Users"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Cart By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comment By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tag List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Login (get access + refresh token)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Text + Colors"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 201 Created - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Refresh Token"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments By Post Id"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PUT"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Identicon"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Category List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Products"], "isController": false}, {"data": [1.0, 500, 1500, "Update Product (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments - Paginated"], "isController": false}, {"data": [0.0, 500, 1500, "Get Products - Simulate Delay (perf testing)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Sized Image"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Search Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos - Paginated"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 108, 0, 0.0, 175.6203703703704, 9, 3832, 93.0, 113.20000000000002, 336.29999999999995, 3730.7499999999964, 0.8563680479566107, 5.500169985092852, 0.4835422341096151], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get User By Id", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 25.858128324468083, 5.599650930851064], "isController": false}, {"data": ["Add New Post", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 12.020029920212766, 7.32421875], "isController": false}, {"data": ["Delete Recipe", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 20.175137362637365, 6.041809752747253], "isController": false}, {"data": ["Get Quote By Id", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 12.394831730769232, 5.794986263736264], "isController": false}, {"data": ["Add New Product", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 12.85453464673913, 12.345023777173914], "isController": false}, {"data": ["Get Recipes - Paginated", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 101.78301411290323, 5.827872983870968], "isController": false}, {"data": ["Update User (PUT)", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 25.544819078947366, 6.0238486842105265], "isController": false}, {"data": ["Update User (PATCH)", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 25.76462765957447, 6.295711436170213], "isController": false}, {"data": ["Login (alias: /user/login)", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 29.83141447368421, 6.661184210526316], "isController": false}, {"data": ["Get All Posts", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 1704.7526041666667, 58.26822916666667], "isController": false}, {"data": ["Get Recipes - Sorted", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 292.633056640625, 5.706787109375], "isController": false}, {"data": ["Update Todo (PUT)", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 12.244591346153847, 6.288633241758242], "isController": false}, {"data": ["Update Recipe (PUT)", 1, 0, 0.0, 2707.0, 2707, 2707, 2707.0, 2707.0, 2707.0, 2707.0, 0.3694126339120798, 0.6590985177318065, 0.23773723217584042], "isController": false}, {"data": ["Get All Users", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 3499.4303385416665, 43.701171875], "isController": false}, {"data": ["Delete User", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 26.6612063172043, 5.890877016129032], "isController": false}, {"data": ["Get Random Quote", 1, 0, 0.0, 3832.0, 3832, 3832, 3832.0, 3832.0, 3832.0, 3832.0, 0.2609603340292275, 0.3121839933455115, 0.13889002152922755], "isController": false}, {"data": ["Update Comment (PUT)", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 12.759701236263737, 6.632039835164836], "isController": false}, {"data": ["Generate 2FA TOTP Code", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 11.697287087912088, 5.96668956043956], "isController": false}, {"data": ["Get Product Categories", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 37.52940188172043, 5.785870295698925], "isController": false}, {"data": ["Get All Todos", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 37.44904891304348, 5.70015285326087], "isController": false}, {"data": ["Get All Quotes", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 51.862819220430104, 5.649361559139785], "isController": false}, {"data": ["Update Product (PUT)", 1, 0, 0.0, 322.0, 322, 322, 322.0, 322.0, 322.0, 322.0, 3.105590062111801, 4.828222049689441, 1.8075504658385093], "isController": false}, {"data": ["Get Todo By Id", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 12.32638888888889, 5.848524305555555], "isController": false}, {"data": ["Get Caller IP Address", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 11.976304945054945, 5.730597527472527], "isController": false}, {"data": ["Get Products - Field Selection", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 33.9124177631579, 5.838815789473684], "isController": false}, {"data": ["Get Recipes By Meal Type", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 247.42542613636363, 5.484532828282828], "isController": false}, {"data": ["Get All Recipes", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 292.5061677631579, 5.540707236842105], "isController": false}, {"data": ["Get Products By Category", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 89.02469758064517, 5.838373655913979], "isController": false}, {"data": ["Mock 200 OK - PATCH", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 13.0615234375, 7.2265625], "isController": false}, {"data": ["Get Posts - Sorted", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 141.30028257978722, 5.81781914893617], "isController": false}, {"data": ["Get Product By Id", 1, 0, 0.0, 9.0, 9, 9, 9.0, 9.0, 9.0, 9.0, 111.1111111111111, 282.00954861111114, 58.81076388888889], "isController": false}, {"data": ["Add New User", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 19.27649456521739, 6.719174592391305], "isController": false}, {"data": ["Test Route - PUT", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 11.495838994565217, 6.262737771739131], "isController": false}, {"data": ["Get User's Todos", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 12.971297554347826, 5.785071331521739], "isController": false}, {"data": ["Get User's Posts", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 17.674708104395606, 5.848643543956044], "isController": false}, {"data": ["Filter Users", 1, 0, 0.0, 133.0, 133, 133, 133.0, 133.0, 133.0, 133.0, 7.518796992481203, 242.1875, 4.192610432330826], "isController": false}, {"data": ["Get All Carts", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 320.0452302631579, 5.520148026315789], "isController": false}, {"data": ["Get Posts - Field Selection", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 46.57048051075269, 5.953881048387097], "isController": false}, {"data": ["Update Post (PUT)", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 15.667002688172044, 6.468413978494624], "isController": false}, {"data": ["Get Posts - Paginated", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 63.53889627659574, 5.745096409574468], "isController": false}, {"data": ["Get Recipe By Id", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 19.856770833333336, 5.870225694444445], "isController": false}, {"data": ["Get Products - Paginated", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 170.42557565789474, 5.715460526315789], "isController": false}, {"data": ["Get Posts By User Id", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 17.63178228021978, 5.8379120879120885], "isController": false}, {"data": ["Get Carts - Paginated", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 119.44514448924731, 5.806871639784946], "isController": false}, {"data": ["Get Recipe Tags", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 21.527300824175825, 5.8379120879120885], "isController": false}, {"data": ["Get Authenticated User (alias: /user/me)", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 26.178175403225808, 5.659862231182796], "isController": false}, {"data": ["Get Products - Sorted", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 420.47427398989896, 5.5535827020202015], "isController": false}, {"data": ["Generate Square Image", 1, 0, 0.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 28.480113636363637, 4.802911931818182], "isController": false}, {"data": ["Get Authenticated User (me)", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 24.782764668367346, 5.37109375], "isController": false}, {"data": ["Delete Product", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 27.61676747311828, 5.922379032258065], "isController": false}, {"data": ["Get Random Todo", 1, 0, 0.0, 90.0, 90, 90, 90.0, 90.0, 90.0, 90.0, 11.11111111111111, 12.217881944444445, 5.902777777777778], "isController": false}, {"data": ["Delete Cart", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 22.292926747311828, 5.890877016129032], "isController": false}, {"data": ["Test Route - PATCH", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 11.351226478494624, 6.216397849462366], "isController": false}, {"data": ["Get All Comments", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 54.02595766129032, 5.670362903225806], "isController": false}, {"data": ["Add New Cart", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 17.397673233695652, 7.695737092391305], "isController": false}, {"data": ["Generate Image With Background Color", 1, 0, 0.0, 110.0, 110, 110, 110.0, 110.0, 110.0, 110.0, 9.09090909090909, 64.7549715909091, 4.900568181818182], "isController": false}, {"data": ["Get User's Carts", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 21.920711436170212, 5.661984707446808], "isController": false}, {"data": ["Generate Image - Custom Format", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 20.86001536885246, 4.578637295081967], "isController": false}, {"data": ["Test Route - POST", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 11.421535326086957, 6.18843410326087], "isController": false}, {"data": ["Test Route - DELETE", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 11.256720430107526, 5.859375], "isController": false}, {"data": ["Get Post By Id", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 16.05425824175824, 5.7842548076923075], "isController": false}, {"data": ["Test Route - GET", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 11.38969089673913, 5.689538043478261], "isController": false}, {"data": ["Search Products", 1, 0, 0.0, 96.0, 96, 96, 96.0, 96.0, 96.0, 96.0, 10.416666666666666, 390.07568359375, 5.645751953125], "isController": false}, {"data": ["Create Custom Mock Response", 1, 0, 0.0, 119.0, 119, 119, 119.0, 119.0, 119.0, 119.0, 8.403361344537815, 8.969603466386555, 5.358784138655462], "isController": false}, {"data": ["Delete Todo", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 12.738238324175825, 6.020346840659341], "isController": false}, {"data": ["Get Quotes - Paginated", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 24.98109879032258, 5.817372311827957], "isController": false}, {"data": ["Mock 200 OK - GET", 1, 0, 0.0, 348.0, 348, 348, 348.0, 348.0, 348.0, 348.0, 2.8735632183908044, 3.005455280172414, 1.515355603448276], "isController": false}, {"data": ["Get Post Tags", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 156.16776315789474, 5.571546052631579], "isController": false}, {"data": ["Search Posts", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 16.76253434065934, 5.923763736263736], "isController": false}, {"data": ["Get Comments For Post", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 15.448387632978724, 5.6931515957446805], "isController": false}, {"data": ["Search Users", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 11.654361263736265, 5.923763736263736], "isController": false}, {"data": ["Update Comment (PATCH)", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 12.58799793956044, 6.277901785714286], "isController": false}, {"data": ["Get Cart By Id", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 22.074605082417584, 5.7842548076923075], "isController": false}, {"data": ["Get Comment By Id", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 12.4012936827957, 5.691364247311828], "isController": false}, {"data": ["Add New Recipe", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 14.605511675824177, 11.04266826923077], "isController": false}, {"data": ["Add New Comment", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 12.577266483516484, 6.975446428571429], "isController": false}, {"data": ["Get Post Tag List", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 28.766134510869566, 5.795686141304348], "isController": false}, {"data": ["Get Carts By User Id", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 22.156418010752688, 5.71236559139785], "isController": false}, {"data": ["Login (get access + refresh token)", 1, 0, 0.0, 380.0, 380, 380, 380.0, 380.0, 380.0, 380.0, 2.631578947368421, 7.462993421052632, 0.678453947368421], "isController": false}, {"data": ["Update Cart", 1, 0, 0.0, 94.0, 94, 94, 94.0, 94.0, 94.0, 94.0, 10.638297872340425, 23.977726063829788, 6.887882313829787], "isController": false}, {"data": ["Mock 200 OK - DELETE", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 13.202136075949367, 6.947191455696203], "isController": false}, {"data": ["Generate Image With Text + Colors", 1, 0, 0.0, 113.0, 113, 113, 113.0, 113.0, 113.0, 113.0, 8.849557522123893, 55.22331305309734, 4.977876106194691], "isController": false}, {"data": ["Update Todo (PATCH)", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 12.190934065934066, 6.32082760989011], "isController": false}, {"data": ["Mock 201 Created - POST", 1, 0, 0.0, 79.0, 79, 79, 79.0, 79.0, 79.0, 79.0, 12.658227848101266, 13.474090189873417, 7.305676424050633], "isController": false}, {"data": ["Refresh Token", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 27.323820153061224, 9.755660076530612], "isController": false}, {"data": ["Get Posts By Tag", 1, 0, 0.0, 95.0, 95, 95, 95.0, 95.0, 95.0, 95.0, 10.526315789473683, 150.77097039473685, 5.643503289473684], "isController": false}, {"data": ["Get Recipes By Tag", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 20.07855425824176, 5.891569368131869], "isController": false}, {"data": ["Update Recipe (PATCH)", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 19.660027472527474, 6.288633241758242], "isController": false}, {"data": ["Get Users - Sorted", 1, 0, 0.0, 99.0, 99, 99, 99.0, 99.0, 99.0, 99.0, 10.101010101010102, 422.6740056818182, 5.56344696969697], "isController": false}, {"data": ["Get Comments By Post Id", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 16.022063873626372, 5.870106456043956], "isController": false}, {"data": ["Mock 200 OK - PUT", 1, 0, 0.0, 80.0, 80, 80, 80.0, 80.0, 80.0, 80.0, 12.5, 13.0859375, 7.2021484375], "isController": false}, {"data": ["Add New Todo", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 11.834257392473118, 6.856938844086022], "isController": false}, {"data": ["Generate Identicon", 1, 0, 0.0, 106.0, 106, 106, 106.0, 106.0, 106.0, 106.0, 9.433962264150942, 22.414873231132077, 5.039431014150944], "isController": false}, {"data": ["Get Recipes - Field Selection", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 37.03587029569893, 5.985383064516129], "isController": false}, {"data": ["Get Product Category List", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 14.927455357142858, 5.945226648351649], "isController": false}, {"data": ["Get Todos By User Id", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 13.15676510989011, 5.8379120879120885], "isController": false}, {"data": ["Get All Products", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 13.0, 76.92307692307693, 3393.7049278846157, 40.56490384615385], "isController": false}, {"data": ["Update Product (PATCH)", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 16.962466032608695, 6.241508152173913], "isController": false}, {"data": ["Get Comments - Paginated", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 25.621639784946236, 5.838373655913979], "isController": false}, {"data": ["Get Products - Simulate Delay (perf testing)", 1, 0, 0.0, 2096.0, 2096, 2096, 2096.0, 2096.0, 2096.0, 2096.0, 0.47709923664122134, 21.04175363788168, 0.25672039002862596], "isController": false}, {"data": ["Get Users - Paginated", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 158.7911626344086, 5.806871639784946], "isController": false}, {"data": ["Generate Sized Image", 1, 0, 0.0, 115.0, 115, 115, 115.0, 115.0, 115.0, 115.0, 8.695652173913043, 61.829144021739125, 4.628057065217391], "isController": false}, {"data": ["Delete Post", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 16.43172554347826, 5.9549082880434785], "isController": false}, {"data": ["Get Users - Field Selection", 1, 0, 0.0, 100.0, 100, 100, 100.0, 100.0, 100.0, 100.0, 10.0, 28.271484375, 5.537109375], "isController": false}, {"data": ["Delete Comment", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 13.088060461956522, 5.986752717391305], "isController": false}, {"data": ["Search Recipes", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 11.382728494623656, 5.817372311827957], "isController": false}, {"data": ["Update Post (PATCH)", 1, 0, 0.0, 92.0, 92, 92, 92.0, 92.0, 92.0, 92.0, 10.869565217391305, 15.773607336956522, 6.18843410326087], "isController": false}, {"data": ["Get Todos - Paginated", 1, 0, 0.0, 91.0, 91, 91, 91.0, 91.0, 91.0, 91.0, 10.989010989010989, 20.582932692307693, 5.9344951923076925], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 108, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
