// チャット区分
app.constant("ChatType", {
    REQUEST: "01",
    ROOM: "02"
}).run(function($rootScope, ChatType) {
    $rootScope.ChatType = ChatType;
});

// フラグ
app.constant('Flag', {
    ON : "1",
    OFF : "0"
}).run(function($rootScope, Flag){
    $rootScope.Flag = Flag;
});

// 都道府県（画面表示用）この形式でないとソートが効かない
app.constant('Prefectures', {
    list : [
    {id:'01', name: '北海道', region:'1'},
    {id:'02', name: '青森県', region:'2'},
    {id:'03', name: '岩手県', region:'2'},
    {id:'04', name: '宮城県', region:'2'},
    {id:'05', name: '秋田県', region:'2'},
    {id:'06', name: '山形県', region:'2'},
    {id:'07', name: '福島県', region:'2'},
    {id:'08', name: '茨城県', region:'3'},
    {id:'09', name: '栃木県', region:'3'},
    {id:'10', name: '群馬県', region:'3'},
    {id:'11', name: '埼玉県', region:'3'},
    {id:'12', name: '千葉県', region:'3'},
    {id:'13', name: '東京都', region:'3'},
    {id:'14', name: '神奈川県', region:'3'},
    {id:'15', name: '新潟県', region:'4'},
    {id:'16', name: '富山県', region:'4'},
    {id:'17', name: '石川県', region:'4'},
    {id:'18', name: '福井県', region:'4'},
    {id:'19', name: '山梨県', region:'4'},
    {id:'20', name: '長野県', region:'4'},
    {id:'21', name: '岐阜県', region:'4'},
    {id:'22', name: '静岡県', region:'4'},
    {id:'23', name: '愛知県', region:'4'},
    {id:'24', name: '三重県', region:'5'},
    {id:'25', name: '滋賀県', region:'5'},
    {id:'26', name: '京都府', region:'5'},
    {id:'27', name: '大阪府', region:'5'},
    {id:'28', name: '兵庫県', region:'5'},
    {id:'29', name: '奈良県', region:'5'},
    {id:'30', name: '和歌山県', region:'5'},
    {id:'31', name: '鳥取県', region:'6'},
    {id:'32', name: '島根県', region:'6'},
    {id:'33', name: '岡山県', region:'6'},
    {id:'34', name: '広島県', region:'6'},
    {id:'35', name: '山口県', region:'6'},
    {id:'36', name: '徳島県', region:'7'},
    {id:'37', name: '香川県', region:'7'},
    {id:'38', name: '愛媛県', region:'7'},
    {id:'39', name: '高知県', region:'7'},
    {id:'40', name: '福岡県', region:'8'},
    {id:'41', name: '佐賀県', region:'8'},
    {id:'42', name: '長崎県', region:'8'},
    {id:'43', name: '熊本県', region:'8'},
    {id:'44', name: '大分県', region:'8'},
    {id:'45', name: '宮崎県', region:'8'},
    {id:'46', name: '鹿児島県', region:'8'},
    {id:'47', name: '沖縄県', region:'8'},
    {id:'99', name: '海外', region:'9'},
    ]
}).run(function($rootScope, Prefectures) {
  $rootScope.Prefectures = Prefectures;
});
