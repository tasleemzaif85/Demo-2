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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9731481481481481, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Get User By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Post"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quote By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update User (PATCH)"], "isController": false}, {"data": [0.8, 500, 1500, "Login (alias: /user/login)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Users"], "isController": false}, {"data": [1.0, 500, 1500, "Delete User"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Quote"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Generate 2FA TOTP Code"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Categories"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Quotes"], "isController": false}, {"data": [0.9, 500, 1500, "Update Product (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todo By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Caller IP Address"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Meal Type"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products By Category"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New User"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PUT"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Todos"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Filter Users"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Carts"], "isController": false}, {"data": [0.8, 500, 1500, "Get Posts - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PUT)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipe By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Paginated"], "isController": false}, {"data": [0.9, 500, 1500, "Get Posts By User Id"], "isController": false}, {"data": [0.9, 500, 1500, "Get Carts - Paginated"], "isController": false}, {"data": [0.8, 500, 1500, "Get Recipe Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (alias: /user/me)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Products - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Square Image"], "isController": false}, {"data": [1.0, 500, 1500, "Get Authenticated User (me)"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Product"], "isController": false}, {"data": [1.0, 500, 1500, "Get Random Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - PATCH"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Comments"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Cart"], "isController": false}, {"data": [0.8, 500, 1500, "Generate Image With Background Color"], "isController": false}, {"data": [1.0, 500, 1500, "Get User's Carts"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image - Custom Format"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - DELETE"], "isController": false}, {"data": [0.9, 500, 1500, "Get Post By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Test Route - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Search Products"], "isController": false}, {"data": [1.0, 500, 1500, "Create Custom Mock Response"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Get Quotes - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - GET"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tags"], "isController": false}, {"data": [1.0, 500, 1500, "Search Posts"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments For Post"], "isController": false}, {"data": [0.8, 500, 1500, "Search Users"], "isController": false}, {"data": [1.0, 500, 1500, "Update Comment (PATCH)"], "isController": false}, {"data": [0.9, 500, 1500, "Get Cart By Id"], "isController": false}, {"data": [0.9, 500, 1500, "Get Comment By Id"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Recipe"], "isController": false}, {"data": [1.0, 500, 1500, "Add New Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Get Post Tag List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Carts By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Login (get access + refresh token)"], "isController": false}, {"data": [1.0, 500, 1500, "Update Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Image With Text + Colors"], "isController": false}, {"data": [1.0, 500, 1500, "Update Todo (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 201 Created - POST"], "isController": false}, {"data": [1.0, 500, 1500, "Refresh Token"], "isController": false}, {"data": [1.0, 500, 1500, "Get Posts By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes By Tag"], "isController": false}, {"data": [1.0, 500, 1500, "Update Recipe (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Sorted"], "isController": false}, {"data": [1.0, 500, 1500, "Get Comments By Post Id"], "isController": false}, {"data": [1.0, 500, 1500, "Mock 200 OK - PUT"], "isController": false}, {"data": [0.8, 500, 1500, "Add New Todo"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Identicon"], "isController": false}, {"data": [1.0, 500, 1500, "Get Recipes - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Get Product Category List"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos By User Id"], "isController": false}, {"data": [1.0, 500, 1500, "Get All Products"], "isController": false}, {"data": [1.0, 500, 1500, "Update Product (PATCH)"], "isController": false}, {"data": [0.9, 500, 1500, "Get Comments - Paginated"], "isController": false}, {"data": [0.0, 500, 1500, "Get Products - Simulate Delay (perf testing)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Paginated"], "isController": false}, {"data": [1.0, 500, 1500, "Generate Sized Image"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Post"], "isController": false}, {"data": [1.0, 500, 1500, "Get Users - Field Selection"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Comment"], "isController": false}, {"data": [1.0, 500, 1500, "Search Recipes"], "isController": false}, {"data": [1.0, 500, 1500, "Update Post (PATCH)"], "isController": false}, {"data": [1.0, 500, 1500, "Get Todos - Paginated"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1080, 0, 0.0, 244.3740740740739, 13, 5299, 172.0, 187.89999999999998, 216.95000000000005, 2982.480000000005, 1.605079183906406, 10.310104050094075, 0.9062967451446354], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Get User By Id", 10, 0, 0.0, 173.79999999999998, 171, 180, 172.5, 180.0, 180.0, 180.0, 0.018535543758711706, 0.045057300316587084, 0.00975650203705626], "isController": false}, {"data": ["Add New Post", 10, 0, 0.0, 171.7, 170, 178, 171.0, 177.5, 178.0, 178.0, 0.018552084048361575, 0.021070384519770027, 0.01277267505282706], "isController": false}, {"data": ["Delete Recipe", 10, 0, 0.0, 172.4, 169, 178, 171.5, 178.0, 178.0, 178.0, 0.018534307002261184, 0.03411108884420062, 0.010190248869407274], "isController": false}, {"data": ["Get Quote By Id", 10, 0, 0.0, 170.3, 169, 173, 169.5, 173.0, 173.0, 173.0, 0.018552393815373998, 0.02091492521530053, 0.00978348892607613], "isController": false}, {"data": ["Add New Product", 10, 0, 0.0, 172.39999999999998, 170, 179, 171.5, 178.6, 179.0, 179.0, 0.018515124079104016, 0.02198309360876432, 0.021028407523435516], "isController": false}, {"data": ["Get Recipes - Paginated", 10, 0, 0.0, 174.8, 171, 179, 174.0, 178.9, 179.0, 179.0, 0.018533516938707806, 0.17532634627467042, 0.010045021387678547], "isController": false}, {"data": ["Update User (PUT)", 10, 0, 0.0, 173.8, 171, 180, 173.0, 179.9, 180.0, 180.0, 0.01853471923607301, 0.044993754958037396, 0.010606782687830845], "isController": false}, {"data": ["Update User (PATCH)", 10, 0, 0.0, 173.8, 171, 180, 173.0, 180.0, 180.0, 180.0, 0.018534856651418657, 0.04499046844996701, 0.010968870244882526], "isController": false}, {"data": ["Login (alias: /user/login)", 10, 0, 0.0, 671.0, 169, 2748, 172.0, 2732.1, 2748.0, 2748.0, 0.01852222296311114, 0.05257851338786275, 0.011721094218843767], "isController": false}, {"data": ["Get All Posts", 10, 0, 0.0, 16.4, 15, 18, 16.5, 17.9, 18.0, 18.0, 0.01854021743967013, 0.28455612633674965, 0.009722750747170762], "isController": false}, {"data": ["Get Recipes - Sorted", 10, 0, 0.0, 176.5, 173, 181, 176.0, 180.9, 181.0, 181.0, 0.018533516938707806, 0.5206651320142411, 0.010153616213491288], "isController": false}, {"data": ["Update Todo (PUT)", 10, 0, 0.0, 170.9, 169, 175, 170.0, 174.9, 175.0, 175.0, 0.018552393815373998, 0.020599679461015853, 0.010616897242001135], "isController": false}, {"data": ["Update Recipe (PUT)", 10, 0, 0.0, 172.6, 170, 179, 171.0, 178.9, 179.0, 179.0, 0.018534066541005697, 0.0330101860912951, 0.011927685400901125], "isController": false}, {"data": ["Get All Users", 10, 0, 0.0, 17.8, 15, 20, 18.0, 19.9, 20.0, 20.0, 0.018539736216633112, 0.7785059741982492, 0.00972249838704295], "isController": false}, {"data": ["Delete User", 10, 0, 0.0, 174.2, 170, 179, 174.0, 179.0, 179.0, 179.0, 0.018534891005573442, 0.046022279170674835, 0.010154368998170606], "isController": false}, {"data": ["Get Random Quote", 10, 0, 0.0, 169.9, 168, 173, 169.5, 172.9, 173.0, 173.0, 0.018552393815373998, 0.021204806368665747, 0.009874076786502763], "isController": false}, {"data": ["Update Comment (PUT)", 10, 0, 0.0, 171.0, 170, 173, 170.5, 173.0, 173.0, 173.0, 0.01855225613986917, 0.02144379918666909, 0.01119657645941323], "isController": false}, {"data": ["Generate 2FA TOTP Code", 10, 0, 0.0, 171.3, 170, 174, 170.5, 173.9, 174.0, 174.0, 0.01855229055855381, 0.019702749982839128, 0.010073314014214765], "isController": false}, {"data": ["Get Product Categories", 10, 0, 0.0, 174.8, 171, 190, 172.5, 188.9, 190.0, 190.0, 0.01851502123672936, 0.0646796230156526, 0.009962672559997927], "isController": false}, {"data": ["Get All Todos", 10, 0, 0.0, 172.39999999999998, 171, 174, 172.0, 174.0, 174.0, 174.0, 0.01855225613986917, 0.06391469649436568, 0.009729064010849359], "isController": false}, {"data": ["Get All Quotes", 10, 0, 0.0, 172.7, 171, 175, 172.5, 175.0, 175.0, 175.0, 0.01855225613986917, 0.08958710562541511, 0.00974718144848595], "isController": false}, {"data": ["Update Product (PUT)", 10, 0, 0.0, 269.1, 169, 681, 170.5, 677.7, 681.0, 681.0, 0.01851519264132184, 0.028564747397226795, 0.01077642071701935], "isController": false}, {"data": ["Get Todo By Id", 10, 0, 0.0, 170.7, 168, 173, 170.5, 172.9, 173.0, 173.0, 0.01855225613986917, 0.02061402054291322, 0.00976529888612254], "isController": false}, {"data": ["Get Caller IP Address", 10, 0, 0.0, 170.6, 169, 174, 170.5, 173.7, 174.0, 174.0, 0.0185191015272703, 0.02027877787356269, 0.0096574220855101], "isController": false}, {"data": ["Get Products - Field Selection", 10, 0, 0.0, 173.9, 172, 177, 173.5, 176.8, 177.0, 177.0, 0.018519581679689017, 0.05961352063729584, 0.010272580462952503], "isController": false}, {"data": ["Get Recipes By Meal Type", 10, 0, 0.0, 175.8, 172, 184, 175.0, 183.7, 184.0, 184.0, 0.018533723035749697, 0.45402915609472216, 0.010063232429567219], "isController": false}, {"data": ["Get All Recipes", 10, 0, 0.0, 186.9, 172, 287, 175.0, 276.50000000000006, 287.0, 287.0, 0.018532040044032128, 0.5151038442863868, 0.009754657796614568], "isController": false}, {"data": ["Get Products By Category", 10, 0, 0.0, 173.8, 172, 181, 172.5, 180.5, 181.0, 181.0, 0.01851505551739397, 0.15332057105985733, 0.010053096550460007], "isController": false}, {"data": ["Mock 200 OK - PATCH", 10, 0, 0.0, 171.39999999999998, 169, 179, 170.0, 178.6, 179.0, 179.0, 0.018552221721312236, 0.019429104076108636, 0.010725503182633636], "isController": false}, {"data": ["Get Posts - Sorted", 10, 0, 0.0, 177.20000000000002, 173, 184, 175.5, 183.8, 184.0, 184.0, 0.01853478794349114, 0.24628099479913854, 0.010136212156596717], "isController": false}, {"data": ["Get Product By Id", 10, 0, 0.0, 33.4, 13, 109, 15.0, 108.9, 109.0, 109.0, 0.018520919378437944, 0.04705109342877781, 0.009803064749134147], "isController": false}, {"data": ["Add New User", 10, 0, 0.0, 180.7, 170, 253, 171.5, 245.60000000000002, 253.0, 253.0, 0.01853471923607301, 0.032891886519328006, 0.011457497340267788], "isController": false}, {"data": ["Test Route - PUT", 10, 0, 0.0, 181.20000000000002, 169, 270, 171.0, 260.5, 270.0, 270.0, 0.018518895755283902, 0.019459308430356915, 0.010670066890251467], "isController": false}, {"data": ["Get User's Todos", 10, 0, 0.0, 175.4, 169, 202, 171.5, 199.70000000000002, 202.0, 202.0, 0.01853468488255497, 0.02217646085752573, 0.009864651622062948], "isController": false}, {"data": ["Get User's Posts", 10, 0, 0.0, 172.7, 170, 180, 172.0, 179.9, 180.0, 180.0, 0.01853578425829986, 0.02983464806106429, 0.009865236739036548], "isController": false}, {"data": ["Filter Users", 10, 0, 0.0, 193.20000000000002, 174, 334, 176.0, 319.1, 334.0, 334.0, 0.018535509402137145, 0.5969664901159396, 0.01033571862169952], "isController": false}, {"data": ["Get All Carts", 10, 0, 0.0, 179.70000000000002, 172, 217, 175.5, 213.5, 217.0, 217.0, 0.01853149056191186, 0.5633573130821204, 0.009718174249752605], "isController": false}, {"data": ["Get Posts - Field Selection", 10, 0, 0.0, 742.3000000000001, 171, 3057, 174.5, 3047.8, 3057.0, 3057.0, 0.018534891005573442, 0.08041319021617244, 0.010262971875156388], "isController": false}, {"data": ["Update Post (PUT)", 10, 0, 0.0, 171.9, 170, 178, 172.0, 177.4, 178.0, 178.0, 0.018552084048361575, 0.02701647239542654, 0.011160238060342508], "isController": false}, {"data": ["Get Posts - Paginated", 10, 0, 0.0, 175.0, 171, 180, 173.5, 179.9, 180.0, 180.0, 0.018534891005573442, 0.11084009625168899, 0.010009565162189564], "isController": false}, {"data": ["Get Recipe By Id", 10, 0, 0.0, 178.70000000000002, 169, 234, 172.0, 228.50000000000003, 234.0, 234.0, 0.018533379543226328, 0.03308497832521262, 0.00979156087195844], "isController": false}, {"data": ["Get Products - Paginated", 10, 0, 0.0, 177.5, 173, 187, 176.0, 186.7, 187.0, 187.0, 0.018519375897032272, 0.2997353754803463, 0.01005544238159174], "isController": false}, {"data": ["Get Posts By User Id", 10, 0, 0.0, 377.49999999999994, 169, 2200, 172.5, 1999.6000000000008, 2200.0, 2200.0, 0.01855215288458149, 0.029873676651744552, 0.009855831219933917], "isController": false}, {"data": ["Get Carts - Paginated", 10, 0, 0.0, 477.6, 171, 3191, 174.0, 2891.500000000001, 3191.0, 3191.0, 0.018531559245394905, 0.2058794701595567, 0.010007765881546274], "isController": false}, {"data": ["Get Recipe Tags", 10, 0, 0.0, 777.3000000000001, 170, 3207, 171.0, 3205.3, 3207.0, 3207.0, 0.018533551287896476, 0.03639743324214826, 0.009845949121695004], "isController": false}, {"data": ["Get Authenticated User (alias: /user/me)", 10, 0, 0.0, 172.9, 171, 175, 173.0, 174.9, 175.0, 175.0, 0.01852222296311114, 0.04500321360568409, 0.009749490407340727], "isController": false}, {"data": ["Get Products - Sorted", 10, 0, 0.0, 178.0, 175, 181, 178.0, 181.0, 181.0, 181.0, 0.018519410193824148, 0.7709644931978206, 0.010182058534299798], "isController": false}, {"data": ["Generate Square Image", 10, 0, 0.0, 191.3, 184, 212, 187.5, 210.6, 212.0, 212.0, 0.018552015212652477, 0.05812360859885905, 0.00980140647465331], "isController": false}, {"data": ["Get Authenticated User (me)", 10, 0, 0.0, 173.20000000000005, 170, 177, 173.0, 176.8, 177.0, 177.0, 0.018521948508983147, 0.04503148731246527, 0.009749345943693278], "isController": false}, {"data": ["Delete Product", 10, 0, 0.0, 174.00000000000003, 170, 179, 173.0, 179.0, 179.0, 179.0, 0.01853149056191186, 0.047602766380911085, 0.010206797536053016], "isController": false}, {"data": ["Get Random Todo", 10, 0, 0.0, 174.70000000000002, 168, 212, 170.0, 208.4, 212.0, 212.0, 0.018552324977366162, 0.020411180976074923, 0.009855922644225775], "isController": false}, {"data": ["Delete Cart", 10, 0, 0.0, 174.10000000000002, 171, 182, 172.0, 181.6, 182.0, 182.0, 0.01853210873158835, 0.03849756024788548, 0.010152844725020569], "isController": false}, {"data": ["Test Route - PATCH", 10, 0, 0.0, 171.0, 169, 174, 170.5, 173.9, 174.0, 174.0, 0.018518930050297415, 0.019455727488388627, 0.010706256435328191], "isController": false}, {"data": ["Get All Comments", 10, 0, 0.0, 180.1, 171, 252, 172.5, 244.20000000000005, 252.0, 252.0, 0.01855215288458149, 0.09321369784294119, 0.009783361872728522], "isController": false}, {"data": ["Add New Cart", 10, 0, 0.0, 173.70000000000002, 169, 180, 172.0, 179.9, 180.0, 180.0, 0.018531799641594994, 0.0296183039974945, 0.013120658925933955], "isController": false}, {"data": ["Generate Image With Background Color", 10, 0, 0.0, 704.5, 188, 2813, 194.0, 2799.8, 2813.0, 2813.0, 0.018552772433548605, 0.13219212717739975, 0.010001103889959796], "isController": false}, {"data": ["Get User's Carts", 10, 0, 0.0, 174.39999999999998, 171, 183, 173.0, 182.7, 183.0, 183.0, 0.018535646829199576, 0.038237012072266784, 0.009865163595618915], "isController": false}, {"data": ["Generate Image - Custom Format", 10, 0, 0.0, 208.7, 198, 232, 202.5, 230.9, 232.0, 232.0, 0.018552531492922207, 0.04725460218734347, 0.010363328138624516], "isController": false}, {"data": ["Test Route - POST", 10, 0, 0.0, 182.1, 170, 275, 172.0, 265.20000000000005, 275.0, 275.0, 0.018518861460397416, 0.01943937908572381, 0.010543453350987981], "isController": false}, {"data": ["Test Route - DELETE", 10, 0, 0.0, 171.5, 169, 175, 171.0, 174.7, 175.0, 175.0, 0.0185189986407055, 0.019463033532350838, 0.010091407462415693], "isController": false}, {"data": ["Get Post By Id", 10, 0, 0.0, 410.4, 169, 2557, 170.5, 2319.2000000000007, 2557.0, 2557.0, 0.01855211846640768, 0.027170519593819917, 0.009765226419329823], "isController": false}, {"data": ["Test Route - GET", 10, 0, 0.0, 171.3, 170, 174, 170.5, 174.0, 174.0, 174.0, 0.01852239450107152, 0.01940148470883722, 0.009695315871654625], "isController": false}, {"data": ["Search Products", 10, 0, 0.0, 177.20000000000002, 175, 183, 176.5, 182.7, 183.0, 183.0, 0.018515432613083006, 0.6933631721102038, 0.010035219824473697], "isController": false}, {"data": ["Create Custom Mock Response", 10, 0, 0.0, 277.40000000000003, 265, 372, 267.0, 361.6, 372.0, 372.0, 0.018549090167127302, 0.019911288976275712, 0.011828667850716922], "isController": false}, {"data": ["Delete Todo", 10, 0, 0.0, 170.6, 168, 173, 171.0, 172.9, 173.0, 173.0, 0.018552359396306225, 0.021596105859762717, 0.010163939083327923], "isController": false}, {"data": ["Get Quotes - Paginated", 10, 0, 0.0, 172.20000000000002, 170, 176, 171.0, 176.0, 176.0, 176.0, 0.018552324977366162, 0.0431486495762649, 0.010037097692832866], "isController": false}, {"data": ["Mock 200 OK - GET", 10, 0, 0.0, 171.20000000000002, 169, 175, 171.0, 175.0, 175.0, 175.0, 0.018554080506155316, 0.01943829840527678, 0.009784378391917842], "isController": false}, {"data": ["Get Post Tags", 10, 0, 0.0, 173.9, 171, 180, 173.5, 179.7, 180.0, 180.0, 0.01855204963044317, 0.27527690673328087, 0.009819541894238476], "isController": false}, {"data": ["Search Posts", 10, 0, 0.0, 172.8, 170, 180, 171.5, 179.8, 180.0, 180.0, 0.018552084048361575, 0.02825569363459444, 0.01000073280731991], "isController": false}, {"data": ["Get Comments For Post", 10, 0, 0.0, 179.0, 170, 245, 171.0, 238.40000000000003, 245.0, 245.0, 0.01855215288458149, 0.02698396143192937, 0.009928300567139314], "isController": false}, {"data": ["Search Users", 10, 0, 0.0, 743.9, 169, 3112, 171.0, 3095.4, 3112.0, 3112.0, 0.018535646829199576, 0.019647061590247285, 0.009991872118865396], "isController": false}, {"data": ["Update Comment (PATCH)", 10, 0, 0.0, 170.4, 169, 172, 170.5, 171.9, 172.0, 172.0, 0.01855225613986917, 0.021335094560849543, 0.010598701017405726], "isController": false}, {"data": ["Get Cart By Id", 10, 0, 0.0, 362.5, 169, 2076, 171.0, 1886.1000000000006, 2076.0, 2076.0, 0.018531662271574097, 0.03722077128315083, 0.00975445894958832], "isController": false}, {"data": ["Get Comment By Id", 10, 0, 0.0, 468.5, 168, 3155, 171.0, 2856.700000000001, 3155.0, 3155.0, 0.01855225613986917, 0.021412999542686884, 0.009819651199032314], "isController": false}, {"data": ["Add New Recipe", 10, 0, 0.0, 172.69999999999996, 170, 179, 171.5, 178.8, 179.0, 179.0, 0.018533894786786076, 0.024720306152141033, 0.018624392319924677], "isController": false}, {"data": ["Add New Comment", 10, 0, 0.0, 170.9, 169, 174, 171.0, 173.8, 174.0, 174.0, 0.01855229055855381, 0.02128078172859112, 0.011776356311582008], "isController": false}, {"data": ["Get Post Tag List", 10, 0, 0.0, 172.6, 170, 180, 171.5, 179.4, 180.0, 180.0, 0.018552015212652477, 0.049217191920597377, 0.00989199248643384], "isController": false}, {"data": ["Get Carts By User Id", 10, 0, 0.0, 174.10000000000002, 171, 181, 174.0, 180.5, 181.0, 181.0, 0.018531662271574097, 0.03829394274086992, 0.009844945581773741], "isController": false}, {"data": ["Login (get access + refresh token)", 10, 0, 0.0, 201.0, 170, 428, 173.0, 405.9000000000001, 428.0, 428.0, 0.018512484819762448, 0.0525508699942241, 0.004772749992595006], "isController": false}, {"data": ["Update Cart", 10, 0, 0.0, 173.9, 171, 179, 173.0, 179.0, 179.0, 179.0, 0.018532005700444953, 0.04177664253799525, 0.011998749784565435], "isController": false}, {"data": ["Mock 200 OK - DELETE", 10, 0, 0.0, 171.8, 169, 179, 170.5, 178.6, 179.0, 179.0, 0.01855187754276672, 0.01945048411124448, 0.010181792167026265], "isController": false}, {"data": ["Generate Image With Text + Colors", 10, 0, 0.0, 195.2, 188, 204, 194.5, 203.8, 204.0, 204.0, 0.0185529445378276, 0.1158109584822207, 0.010436031302528024], "isController": false}, {"data": ["Update Todo (PATCH)", 10, 0, 0.0, 170.8, 168, 175, 170.0, 174.9, 175.0, 175.0, 0.018552393815373998, 0.020577938374513462, 0.010671249958257113], "isController": false}, {"data": ["Mock 201 Created - POST", 10, 0, 0.0, 174.70000000000002, 169, 205, 170.5, 202.0, 205.0, 205.0, 0.018552875695732836, 0.019665323515769946, 0.010707763218923933], "isController": false}, {"data": ["Refresh Token", 10, 0, 0.0, 172.7, 170, 177, 172.0, 176.8, 177.0, 177.0, 0.01852215434881662, 0.049430999418404356, 0.01770819248778464], "isController": false}, {"data": ["Get Posts By Tag", 10, 0, 0.0, 174.39999999999998, 172, 182, 174.0, 181.3, 182.0, 182.0, 0.018551911960046602, 0.2658720882774179, 0.009946288736392172], "isController": false}, {"data": ["Get Recipes By Tag", 10, 0, 0.0, 172.4, 169, 179, 170.5, 179.0, 179.0, 179.0, 0.018533619986655796, 0.03386729464749055, 0.009936481809251984], "isController": false}, {"data": ["Update Recipe (PATCH)", 10, 0, 0.0, 172.6, 170, 180, 171.0, 179.8, 180.0, 180.0, 0.018534169595065462, 0.03310086851118722, 0.010606468147176135], "isController": false}, {"data": ["Get Users - Sorted", 10, 0, 0.0, 184.4, 175, 237, 177.5, 232.0, 237.0, 237.0, 0.01853434135437846, 0.7755861659212773, 0.010208367699091262], "isController": false}, {"data": ["Get Comments By Post Id", 10, 0, 0.0, 170.79999999999998, 170, 172, 171.0, 172.0, 172.0, 172.0, 0.01855229055855381, 0.027002279148895116, 0.009910256772977475], "isController": false}, {"data": ["Mock 200 OK - PUT", 10, 0, 0.0, 182.4, 170, 264, 172.0, 256.0, 264.0, 264.0, 0.01855246265389268, 0.019483709314449402, 0.010689407193160822], "isController": false}, {"data": ["Add New Todo", 10, 0, 0.0, 674.6, 169, 2861, 170.5, 2827.3, 2861.0, 2861.0, 0.018552324977366162, 0.020461909989684907, 0.011830730674043072], "isController": false}, {"data": ["Generate Identicon", 10, 0, 0.0, 181.0, 172, 192, 182.0, 191.7, 192.0, 192.0, 0.01855363298687516, 0.04418808606288198, 0.009910973870918665], "isController": false}, {"data": ["Get Recipes - Field Selection", 10, 0, 0.0, 175.3, 170, 182, 174.5, 181.8, 182.0, 182.0, 0.018533345194674256, 0.0639509003035762, 0.010316412852504226], "isController": false}, {"data": ["Get Product Category List", 10, 0, 0.0, 171.6, 169, 178, 170.0, 177.9, 178.0, 178.0, 0.018515124079104016, 0.02513283444331502, 0.010016971425609008], "isController": false}, {"data": ["Get Todos By User Id", 10, 0, 0.0, 173.0, 169, 197, 170.5, 194.5, 197.0, 197.0, 0.01855225613986917, 0.02221197854246055, 0.009855886074305495], "isController": false}, {"data": ["Get All Products", 10, 0, 0.0, 18.099999999999998, 17, 20, 18.0, 19.9, 20.0, 20.0, 0.018524384573633503, 0.8174210317063367, 0.009768718427502043], "isController": false}, {"data": ["Update Product (PATCH)", 10, 0, 0.0, 172.3, 169, 178, 172.0, 177.6, 178.0, 178.0, 0.018531559245394905, 0.028915747424113264, 0.010641168785441607], "isController": false}, {"data": ["Get Comments - Paginated", 10, 0, 0.0, 453.7, 171, 2958, 173.0, 2682.000000000001, 2958.0, 2958.0, 0.01855215288458149, 0.04424434820257467, 0.010073239261550107], "isController": false}, {"data": ["Get Products - Simulate Delay (perf testing)", 10, 0, 0.0, 3254.8, 2179, 5299, 2195.0, 5286.9, 5299.0, 5299.0, 0.018345459682183256, 0.8089989410083398, 0.009871433871956029], "isController": false}, {"data": ["Get Users - Paginated", 10, 0, 0.0, 176.0, 172, 183, 174.5, 182.8, 183.0, 183.0, 0.018534375706623075, 0.27364268133106473, 0.010009286880627499], "isController": false}, {"data": ["Generate Sized Image", 10, 0, 0.0, 194.29999999999998, 188, 204, 192.5, 203.8, 204.0, 204.0, 0.018552772433548605, 0.1318949929313937, 0.009874278297152334], "isController": false}, {"data": ["Delete Post", 10, 0, 0.0, 171.29999999999998, 169, 178, 171.0, 177.4, 178.0, 178.0, 0.018552221721312236, 0.02816169281602318, 0.010163863657867348], "isController": false}, {"data": ["Get Users - Field Selection", 10, 0, 0.0, 177.89999999999998, 172, 202, 173.5, 200.0, 202.0, 202.0, 0.018534581822764917, 0.052428974324043795, 0.010262800677253619], "isController": false}, {"data": ["Delete Comment", 10, 0, 0.0, 170.3, 169, 172, 170.0, 172.0, 172.0, 172.0, 0.018552324977366162, 0.022371495002003652, 0.010218272741439959], "isController": false}, {"data": ["Search Recipes", 10, 0, 0.0, 175.29999999999998, 169, 204, 171.0, 201.4, 204.0, 204.0, 0.018533482589646454, 0.01969906489313594, 0.010026903666664196], "isController": false}, {"data": ["Update Post (PATCH)", 10, 0, 0.0, 171.59999999999997, 170, 178, 171.0, 177.4, 178.0, 178.0, 0.01855211846640768, 0.026976664449688506, 0.010562387759683278], "isController": false}, {"data": ["Get Todos - Paginated", 10, 0, 0.0, 170.4, 169, 172, 170.0, 172.0, 172.0, 172.0, 0.018552324977366162, 0.03482546784325512, 0.010018980187972157], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1080, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
