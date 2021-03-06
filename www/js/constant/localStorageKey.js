// ローカルストレージのアプリ判定用（アプリごとに変える！）
var APP_ID = "DTPSHOP_";

// ローカルストレージのキー
app.constant('LocalStorageKey', {
    APP_NAME: APP_ID + 'APP',
    DEVICE_ID : APP_ID + 'DEVICE_ID',
    APP_FIRST_FLAG : APP_ID + 'APP_FIRST_FLAG',
    TOP_CONTENTS : APP_ID + 'TOP_CONTENTS',
    TOP_CONTENTS_LAST_UPDATE : APP_ID + 'TOP_CONTENTS_LAST_UPDATE',
    TOP_CONTENT_ID : APP_ID + 'TOP_CONTENT_',
    TOP_RECOMMENDS : APP_ID + 'TOP_RECOMMENDS',
    TOP_RECOMMENDS_LAST_UPDATE : APP_ID + 'TOP_RECOMMENDS_LAST_UPDATE',
    TOP_RECOMMEND_ID : APP_ID + 'TOP_RECOMMEND_',
    PUSH_PERMIT : APP_ID + 'PUSH_PERMIT',
    PUSH_NEWS : APP_ID + 'PUSH_NEWS',
    PUSH_NEWS_LAST_UPDATE : APP_ID + 'PUSH_NEWS_LAST_UPDATE',
    PUSH_CONTENTS : APP_ID + 'PUSH_CONTENTS',
    PUSH_CONTENTS_LAST_UPDATE : APP_ID + 'PUSH_CONTENTS_LAST_UPDATE',
    PUSH_CONTENT_ID : APP_ID + 'PUSH_CONTENT_',
    STORES : APP_ID + 'STORES',
    STORES_LAST_UPDATE : APP_ID + 'STORES_LAST_UPDATE',
    STORES_PREFECTURE : APP_ID + 'STORES_PREFECTURE_',
    STORE_ID : APP_ID + 'STORE_',
    LOGIN_INFO : APP_ID + 'LOGIN_INFO',
    USER_INFO: APP_ID + 'USER_INFO',
    COUPON: APP_ID + 'COUPON',
    COUPON_ID: APP_ID + "'COUPON_",
    COUPON_LAST_UPDATE: APP_ID + 'COUPON_LAST_UPDATE',
    CONTENT_IMAGE_LIST: APP_ID + 'CONTENT_IMAGE_LIST',
    
    MASTER_SHOP: APP_ID + 'MASTER_SHOP',
    MASTER_STAFF: APP_ID + 'MASTER_STAFF',
});