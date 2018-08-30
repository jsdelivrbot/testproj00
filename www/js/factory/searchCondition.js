app.factory('SearchCondition', function ($rootScope) {
    var condition = {};

    return {
        setCondition: function (key, value) {
            condition[key] = value;
        },
        getCondition: function (key) {
            return condition[key];
        },
        getConditionList: function() {
            return condition;
        },
        resetCondition: function() {
            condition = {};
        }
    };
});
