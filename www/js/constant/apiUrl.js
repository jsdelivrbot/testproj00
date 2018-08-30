// APIのURL
app.constant('ApiUrl', {
    //BASE_URL: 'http://35.187.193.31',
    BASE_URL: 'http://lc2test.dtpnet.co.jp',
    CONTEXT_URL: {
        TOP: '/contents-api/v1/frontend',
        NOTICE: '/notice-api/v1/frontend',
        SHOP: '/shop-api/v1/frontend',
        ANALYSIS: '/analysis-api/v1/frontend',
        ITEM: '/item-api/v1/frontend',
        COUPON: '/coupon-api/v1/frontend',
        USERLINK: '/userlink-api/v1/frontend'
    }
}).run(function($rootScope, ApiUrl) {
    $rootScope.ApiUrl = ApiUrl;
});