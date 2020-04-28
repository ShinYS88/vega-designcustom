// ==================================================================
// 전역변수 초기화
// ==================================================================
var chartProp = null;
var dataset = [
    ['fixed', 'A', 'B', 'C', 'D', 'E', 'F', 'G'],
    ['data1',  9, 19, 29, 39, 29, 19, 9]
];
var key0 = [];
var value0 = [];
var newData = {};



// ==================================================================
// 초기화 시작
// ==================================================================
dataParser();  


// * 추가 작업사항 => Row추가시 2차원 배열로 생성하도록 변경해야함.
$("#txt_xTitle").val(key0[0]);
$("#txt_yTitle").val(key0[1]);

var tableClass = new TableClass('dataDiv', dataset);

getChartProperty(newData);



// ==================================================================
// 테이블 데이터 적용
// ==================================================================
function DataApply(){
    dataset = tableClass.getDataArray();
    dataParser();
    console.log(newData);
}



// ==================================================================
// cd9테이블 형태 => vega map형태로 변경
// ==================================================================
function dataParser(){
    key0 = [];
    value0 = [];

    $(dataset).each(function(index,item){
        // console.log(item);
        key0.push(item[0]);
        value0.push(item.slice(1,item.length));
        // console.log(key0);
        // console.log(value0);
    });
    
    newData = value0[0].map(function(v, c){
    
        var test = {};
    
        test[key0[0]] = v;
        test[key0[1]] = value0[1][c];
    
        return test;
    
        // return {
        //     key0[0] : data2X[c],
        //     key0[1] : v,
        //     category : c
        // }
    });
}


// ==================================================================
// Vega-lite JSON 생성
// ==================================================================
function getChartProperty(setData){
    chartProp = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.0.json",
        "title": "베가 테스트",
        "description": "A simple bar chart with embedded data.",
        "width":"container",
        "height":"container",
        "data": {
            "values":setData,
            "name":"table",
    // 		"url": "chartData.do",
    // 		"format": {"property": "resultData.aggregations.2.buckets"}
        },
        "encoding": {
            "x": {
                "field": "x",
                "type": "ordinal",
                "axis": {"title": "년도"}
            },
            "y": {
                "field": "y",
                "type": "quantitative",
                "axis": {"title": "건수"}
            },
            "color": {
                "field": "x", "type": "nominal",
                "scale": {"range": ["#4C78A8"]}
            }   

        }
    };


    var selectMark = $("#select_mark").val();


    // 공통
    chartProp.mark = selectMark;
    chartProp.encoding.x.field = key0[0];
    chartProp.encoding.y.field = key0[1];
    chartProp.encoding.color.field = key0[0];
    chartProp.encoding.x.axis.title = $("#txt_xTitle").val();
    chartProp.encoding.y.axis.title = $("#txt_yTitle").val();
    
    // 색상
    switch(selectMark){
        case 'bar':
        case 'point':
            var fieldColor = $("#txt_fieldColor").val() === "" ? "#4c78a8" : $("#txt_fieldColor").val();
                chartProp.encoding.color.scale.range[0] = fieldColor;
                break;
        case 'line':
        case 'area':
                delete(chartProp.encoding.color);
                break;
    }


}


// ==================================================================
// json 출력 버튼 이벤트
// ==================================================================
$("#btn_viewJson").on("click",function(){
    
    var code = JSON.stringify(chartProp);
    code = code.replace(/[}}\]]/gi, '$&\n');

    var codeStr = code;

    $("#viewJson").val(codeStr);
});


// ==================================================================
// 디자인 변경 버튼 이벤트
// ==================================================================
$("#btn_changeDesign").on("click",function(){
    getChartProperty(newData);
    vegaEmbed("#vis", chartProp).then(function(res){
        function getData(){

            var plusValue = Number($("#txt_plusData").val());
    
            newData2 = dataY.map(function(v, c){
                return {
                    'fixed' : dataX[c],
                    'data1' : v + plusValue
                }
            });
    
            dataY = newData2.map(function(v){
                return v.data1;
            });
    
            return newData2;
        }
    
        $("#btn_changeData").on("click",function(){
    
            getChartProperty(newData2);
    
            var changeSet = vega.changeset()
            .insert(getData())
            .remove(function (t) {
            return true;
            });
                          
            res.view.change('table', changeSet).run();
        });
    });
});





// ================================================================================================================
// vega 데이터 샘플 만들기 테스트용
// ==================================================================
var dataX = [2006,2007,2008,2009,2010,2011,2012,2013,2014,2015];
var dataY = [10, 20, 30, 100, 10, 20, 30, 100, 130, 150];
var newData2 = dataY.map(function(v, c){
    return {
        'fixed' : dataX[c],
        'data1' : v
    }
});

// ==================================================================
// vega 데이터 이벤트 함수 테스트
// ==================================================================
vegaEmbed("#vis", chartProp).then(function(res){
    
    function getData(){

        var plusValue = Number($("#txt_plusData").val());

        newData2 = dataY.map(function(v, c){
            return {
                'fixed' : dataX[c],
                'data1' : v + plusValue
            }
        });

        dataY = newData2.map(function(v){
            return v.data1;
        });

        return newData2;
    }

    $("#btn_changeData").on("click",function(){

        getChartProperty(newData2);

        var changeSet = vega.changeset()
        .insert(getData())
        .remove(function (t) {
        return true;
        });
                      
        res.view.change('table', changeSet).run();
    });
});