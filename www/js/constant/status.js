app.constant("ReserveStatus", {
    "REQUEST": "00",
    "CHECKING": "01",
    "RESERVE": "02",
    "PICKUP": "03",
    "NO_STOCK": "04",
    "CANCEL": "09"
}).run(function($rootScope, ReserveStatus) {
    $rootScope.ReserveStatus = ReserveStatus;
});

app.constant("ReserveStatusName", {
    "00": "取置き依頼",
    "01": "在庫確認中",
    "02": "取置き済み",
    "03": "処理済み",
    "04": "在庫不足",
    "09": "キャンセル依頼"
}).run(function($rootScope, ReserveStatusName) {
    $rootScope.ReserveStatusName = ReserveStatusName;
});

app.constant("ReserveStatusList", {
    list: [
        //{name: "取置き依頼", code: "00"},
        {name: "在庫確認中", code: "01"},
        {name: "取置き済み", code: "02"},
        {name: "処理済み", code: "03"},
        {name: "在庫不足", code: "04"},
        {name: "キャンセル依頼", code: "09"}
    ]
}).run(function($rootScope, ReserveStatusList) {
    $rootScope.ReserveStatusList = ReserveStatusList;
});

app.constant("DeliveryStatus", {
    "ORDER": "00",
    "CHECKING": "01",
    "DELIVERY": "02",
    "PURCHASED": "03",
    "NO_STOCK": "04",
    "RETURNED": "05",
    "PART_DELIVERY": "06"
    
}).run(function($rootScope, DeliveryStatus) {
    $rootScope.DeliveryStatus = DeliveryStatus;
});

app.constant("DeliveryStatusName", {
    "00": "配送依頼",
    "01": "在庫確認中",
    "02": "配送済み",
    "03": "購入済み",
    "04": "在庫不足",
    "05": "返品済み",
    "06": "一部配送済み",
    "07": "配送キャンセル"
}).run(function($rootScope, DeliveryStatusName) {
    $rootScope.DeliveryStatusName = DeliveryStatusName;
});

app.constant("DeliveryStatusList", {
    list: [
        //{name: "受注済み", code: "00"},
        {name: "在庫確認中", code: "01"},
        {name: "配送済み", code: "02"},
        //{name: "購入済み", code: "03"},
        {name: "在庫不足", code: "04"},
        //{name: "返品済み", code: "05"},
        //{name: "一部配送済み", code: "06"},
        {name: "配送キャンセル", code: "07"}
    ]
}).run(function($rootScope, DeliveryStatusList) {
    $rootScope.DeliveryStatusList = DeliveryStatusList;
});

app.constant("ReturnStatus", {
    "REQUEST": "01",
    "RETURNED": "02"
}).run(function($rootScope, ReturnStatus) {
    $rootScope.ReturnStatus = ReturnStatus;
});

app.constant("RequestStatus", {
    RESERVE: "01",
    DELIVERY: "02",
    FITTING: "03"
}).run(function($rootScope, RequestStatus) {
    $rootScope.RequestStatus = RequestStatus;
});


